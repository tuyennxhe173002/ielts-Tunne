import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  pending() {
    return this.prisma.user.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
      include: { profile: true, primaryRole: true },
    });
  }

  async approve(userId: string, adminUserId: string, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status: 'approved' } });
      await tx.adminApproval.create({ data: { userId, decision: 'approved', note, decidedByUserId: adminUserId } });
      await tx.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'user.approved', entityType: 'user', entityId: userId, payloadJson: { note } } });
      return { ok: true };
    });
    await this.notificationsService.create({
      userId,
      type: 'approval_granted',
      title: 'Tài khoản đã được duyệt',
      body: note || 'Bạn đã được duyệt và có thể đăng nhập học.',
    });
    return { ok: true };
  }

  async reject(userId: string, adminUserId: string, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status: 'rejected' } });
      await tx.adminApproval.create({ data: { userId, decision: 'rejected', note, decidedByUserId: adminUserId } });
      await tx.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'user.rejected', entityType: 'user', entityId: userId, payloadJson: { note } } });
      return { ok: true };
    });
    await this.notificationsService.create({
      userId,
      type: 'approval_rejected',
      title: 'Tài khoản chưa được duyệt',
      body: note || 'Admin đã từ chối tài khoản của bạn.',
    });
    return { ok: true };
  }
}
