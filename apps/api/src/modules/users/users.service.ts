import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers(status?: string) {
    return this.prisma.user.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        primaryRole: true,
        enrollments: { include: { course: true } },
      },
    });
  }

  getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        primaryRole: true,
        enrollments: { include: { course: true } },
        approvals: { include: { decidedBy: { include: { profile: true } } }, orderBy: { decidedAt: 'desc' } },
      },
    });
  }
}
