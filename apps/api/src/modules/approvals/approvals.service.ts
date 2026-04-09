import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status: 'approved' } });
      await tx.adminApproval.create({ data: { userId, decision: 'approved', note, decidedByUserId: adminUserId } });
      await tx.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'user.approved', entityType: 'user', entityId: userId, payloadJson: { note } } });
      return { ok: true };
    });
  }

  async reject(userId: string, adminUserId: string, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status: 'rejected' } });
      await tx.adminApproval.create({ data: { userId, decision: 'rejected', note, decidedByUserId: adminUserId } });
      await tx.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'user.rejected', entityType: 'user', entityId: userId, payloadJson: { note } } });
      return { ok: true };
    });
  }
}
