import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) throw new UnauthorizedException('Missing access token');

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    }).catch(() => null);
    if (!payload?.sub || !payload?.sid) throw new UnauthorizedException('Invalid access token');

    const session = await this.prisma.userSession.findFirst({
      where: { id: payload.sid, userId: payload.sub, status: 'active', revokedAt: null },
      include: { user: { include: { primaryRole: true, profile: true } } },
    });
    if (!session || session.expiresAt <= new Date()) throw new UnauthorizedException('Session expired');

    request.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.primaryRole.code,
      status: session.user.status,
      fullName: session.user.profile?.fullName ?? '',
      sessionId: session.id,
    };
    return true;
  }
}
