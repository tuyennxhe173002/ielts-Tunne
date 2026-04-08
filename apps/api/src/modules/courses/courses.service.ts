import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  listPublic() {
    return this.prisma.course.findMany({
      where: { status: 'published', visibility: 'public' },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async detailPublic(slug: string) {
    return this.prisma.course.findFirst({
      where: { slug, status: 'published', visibility: 'public' },
      include: { category: true, sections: { where: { status: 'published' }, orderBy: { position: 'asc' } } },
    });
  }

  listAdmin() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, _count: { select: { sections: true, enrollments: true } } },
    });
  }

  async getAdminCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        sections: {
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              orderBy: { position: 'asc' },
              include: { assets: { orderBy: { position: 'asc' } } },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async createCourse(dto: CreateCourseDto, adminUserId: string) {
    const category = await this.prisma.courseCategory.findUnique({ where: { slug: dto.categorySlug } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.course.create({
      data: {
        categoryId: category.id,
        slug: dto.slug,
        title: dto.title,
        shortDescription: dto.shortDescription,
        longDescription: dto.longDescription,
        thumbnailUrl: dto.thumbnailUrl,
        createdByUserId: adminUserId,
      },
      include: { category: true },
    });
  }

  async updateCourse(courseId: string, dto: UpdateCourseDto, adminUserId: string) {
    await this.getAdminCourse(courseId);
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        ...dto,
        updatedByUserId: adminUserId,
        publishedAt: dto.status === 'published' ? new Date() : undefined,
      },
      include: { category: true },
    });
  }

  async archiveCourse(courseId: string, adminUserId: string) {
    await this.getAdminCourse(courseId);
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'archived', updatedByUserId: adminUserId },
    });
  }

  async getStudentCourse(slug: string, userId: string) {
    const course = await this.prisma.course.findFirst({
      where: { slug, status: 'published' },
      include: {
        category: true,
        sections: {
          where: { status: 'published' },
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              where: { status: 'published' },
              orderBy: { position: 'asc' },
              select: { id: true, slug: true, title: true, summary: true, isPreview: true },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    await this.enrollmentsService.assertEnrollment(userId, course.id);
    return course;
  }
}
