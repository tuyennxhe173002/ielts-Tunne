import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService,
  ) {}

  listByUser(userId: string) {
    return this.prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { lesson: { select: { id: true, title: true, course: { select: { slug: true, title: true } } } } },
    });
  }

  async getLessonProgress(userId: string, lessonId: string) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    return this.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
  }

  async updateLessonProgress(userId: string, lessonId: string, dto: UpdateProgressDto) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: dto.status,
        progressPercent: dto.progressPercent,
        lastPositionSeconds: dto.lastPositionSeconds,
        lastOpenedAt: new Date(),
        completedAt: dto.status === 'completed' ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        status: dto.status ?? 'in_progress',
        progressPercent: dto.progressPercent ?? 0,
        lastPositionSeconds: dto.lastPositionSeconds,
        firstOpenedAt: new Date(),
        lastOpenedAt: new Date(),
        completedAt: dto.status === 'completed' ? new Date() : null,
      },
    });
  }

  completeLesson(userId: string, lessonId: string) {
    return this.updateLessonProgress(userId, lessonId, { status: 'completed', progressPercent: 100 });
  }
}
