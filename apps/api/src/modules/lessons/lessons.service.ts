import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async create(sectionId: string, dto: CreateLessonDto) {
    const section = await this.prisma.courseSection.findUnique({ where: { id: sectionId } });
    if (!section) throw new NotFoundException('Section not found');
    const position = dto.position ?? ((await this.prisma.lesson.count({ where: { sectionId } })) + 1);
    return this.prisma.lesson.create({
      data: {
        courseId: section.courseId,
        sectionId,
        slug: dto.slug,
        title: dto.title,
        summary: dto.summary,
        studyNote: dto.studyNote,
        contentHtml: dto.contentHtml,
        lessonType: dto.lessonType ?? 'video',
        position,
        isPreview: dto.isPreview ?? false,
      },
      include: { assets: true },
    });
  }

  async detail(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { assets: { orderBy: { position: 'asc' } } } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(lessonId: string, dto: UpdateLessonDto) {
    await this.detail(lessonId);
    return this.prisma.lesson.update({ where: { id: lessonId }, data: dto, include: { assets: { orderBy: { position: 'asc' } } } });
  }

  async remove(lessonId: string) {
    await this.detail(lessonId);
    await this.prisma.lessonAsset.deleteMany({ where: { lessonId } });
    await this.prisma.lessonProgress.deleteMany({ where: { lessonId } });
    await this.prisma.lessonComment.deleteMany({ where: { lessonId } });
    return this.prisma.lesson.delete({ where: { id: lessonId } });
  }

  async detailForStudent(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: { select: { id: true, slug: true, title: true, status: true, visibility: true } },
        section: { select: { id: true, title: true, status: true } },
        assets: { orderBy: { position: 'asc' } },
      },
    });
    if (
      !lesson ||
      lesson.status !== 'published' ||
      lesson.course.status !== 'published' ||
      lesson.section.status !== 'published'
    ) {
      throw new NotFoundException('Lesson not found');
    }
    await this.enrollmentsService.assertEnrollment(userId, lesson.courseId);
    return lesson;
  }
}
