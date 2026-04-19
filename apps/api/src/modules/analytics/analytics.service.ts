import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminSummary() {
    const [users, pendingUsers, courses, activeEnrollments, comments, notifications, recentLogs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'pending' } }),
      this.prisma.course.count(),
      this.prisma.enrollment.count({ where: { status: 'active' } }),
      this.prisma.lessonComment.count({ where: { status: 'visible' } }),
      this.prisma.notification.count(),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { actor: { include: { profile: true } } } }),
    ]);

    return {
      users,
      pendingUsers,
      courses,
      activeEnrollments,
      comments,
      notifications,
      recentLogs,
    };
  }
}
