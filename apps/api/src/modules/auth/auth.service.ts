import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from '../../common/types/auth-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const studentRole = await this.prisma.role.findUnique({ where: { code: 'student' } });
    if (!studentRole) throw new UnauthorizedException('Role seed missing');

    const passwordHash = await hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        primaryRoleId: studentRole.id,
        profile: { create: { fullName: dto.fullName } },
        credentials: { create: { provider: 'password', passwordHash } },
      },
      include: { profile: true, primaryRole: true },
    }).catch((error: unknown) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    });

    return {
      userId: user.id,
      email: user.email,
      fullName: user.profile?.fullName ?? dto.fullName,
      role: user.primaryRole.code,
      status: user.status,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { credentials: true, profile: true, primaryRole: true },
    });
    const credential = user?.credentials.find((item: { provider: string }) => item.provider === 'password');
    if (!user || !credential?.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await compare(dto.password, credential.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const sessionTokens = await this.createSession(user.id, dto.deviceFingerprint, dto.deviceName);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return {
      ...sessionTokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName ?? '',
        role: user.primaryRole.code,
        status: user.status,
      },
    };
  }

  me(user: AuthUser) {
    return user;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    }).catch(() => null);
    if (!payload?.sub || !payload?.sid) throw new UnauthorizedException('Invalid refresh token');

    const session = await this.prisma.userSession.findFirst({
      where: { id: payload.sid, userId: payload.sub, status: 'active', revokedAt: null },
      include: { user: { include: { primaryRole: true, profile: true } } },
    });
    if (!session) throw new UnauthorizedException('Session not active');
    const currentHash = this.hashToken(refreshToken);
    if (session.refreshTokenHash !== currentHash) throw new UnauthorizedException('Refresh token mismatch');

    const tokens = this.issueTokens(session.userId, session.id, session.user.primaryRole.code, session.user.status);
    const rotated = await this.prisma.userSession.updateMany({
      where: { id: session.id, refreshTokenHash: currentHash, status: 'active' },
      data: {
        refreshTokenHash: this.hashToken(tokens.refreshToken),
        expiresAt: tokens.refreshExpiresAt,
        lastActivityAt: new Date(),
      },
    });
    if (rotated.count !== 1) throw new UnauthorizedException('Refresh token already rotated');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.profile?.fullName ?? '',
        role: session.user.primaryRole.code,
        status: session.user.status,
      },
    };
  }

  async logout(sessionId: string) {
    await this.prisma.userSession.updateMany({ where: { id: sessionId, status: 'active' }, data: { status: 'revoked', revokedAt: new Date(), revokedReason: 'logout' } });
    return { ok: true };
  }

  private async createSession(userId: string, fingerprint?: string, deviceName?: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let deviceId: string | undefined;
      if (fingerprint) {
        const device = await tx.userDevice.upsert({
          where: { userId_fingerprintHash: { userId, fingerprintHash: fingerprint } },
          create: { userId, fingerprintHash: fingerprint, deviceName },
          update: { deviceName, lastSeenAt: new Date(), revokedAt: null },
        });
        deviceId = device.id;
      }

      await tx.userSession.updateMany({ where: { userId, status: 'active' }, data: { status: 'revoked', revokedAt: new Date(), revokedReason: 'new_login' } });

      const session = await tx.userSession.create({
        data: {
          userId,
          deviceId,
          refreshTokenHash: 'pending',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastActivityAt: new Date(),
        },
      });

      const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, include: { primaryRole: true } });
      const tokens = this.issueTokens(user.id, session.id, user.primaryRole.code, user.status);
      await tx.userSession.update({ where: { id: session.id }, data: { refreshTokenHash: this.hashToken(tokens.refreshToken), expiresAt: tokens.refreshExpiresAt } });
      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    });
  }

  private issueTokens(userId: string, sessionId: string, role: string, status: string) {
    const accessToken = this.jwtService.sign({ sub: userId, sid: sessionId, role, status }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: userId, sid: sessionId, nonce: randomBytes(8).toString('hex') }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
    return { accessToken, refreshToken, refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
