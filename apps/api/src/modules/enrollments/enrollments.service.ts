import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId?: string) {
    return this.prisma.enrollment.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { grantedAt: 'desc' },
      include: {
        user: { include: { profile: true } },
        course: true,
        grantedBy: { include: { profile: true } },
      },
    });
  }

  async create(dto: CreateEnrollmentDto, adminUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!user) throw new NotFoundException('User not found');
    if (!course) throw new NotFoundException('Course not found');
    return this.prisma.enrollment.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        grantedByUserId: adminUserId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
      include: { course: true, user: { include: { profile: true } } },
    }).catch((error: unknown) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('User already enrolled in this course');
      }
      throw error;
    });
  }

  async revoke(enrollmentId: string, adminUserId: string, reason?: string) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'revoked', revokedAt: new Date(), revokedByUserId: adminUserId, revokeReason: reason ?? null },
    });
  }

  async update(enrollmentId: string, adminUserId: string, dto: { status?: 'active' | 'paused' | 'revoked' | 'expired'; expiresAt?: string | null; reason?: string }) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: dto.status,
        expiresAt: dto.expiresAt === null ? null : dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        revokedAt: dto.status === 'revoked' ? new Date() : undefined,
        revokedByUserId: dto.status === 'revoked' ? adminUserId : undefined,
        revokeReason: dto.reason ?? undefined,
      },
    });
  }

  listStudentCourses(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId, status: 'active', OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: { grantedAt: 'desc' },
      include: {
        course: {
          include: {
            category: true,
            _count: { select: { sections: true, lessons: true } },
          },
        },
      },
    });
  }

  async assertEnrollment(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'active',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }
}
