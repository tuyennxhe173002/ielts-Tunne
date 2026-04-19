import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  listAdmin(filters?: { actionType?: string; entityType?: string; actorEmail?: string }) {
    return this.prisma.auditLog.findMany({
      where: {
        actionType: filters?.actionType || undefined,
        entityType: filters?.entityType || undefined,
        actor: filters?.actorEmail ? { email: { contains: filters.actorEmail, mode: 'insensitive' } } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        actor: { include: { profile: true } },
      },
    });
  }
}
