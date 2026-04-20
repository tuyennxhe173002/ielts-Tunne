import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCourseDayDto } from './dto/create-course-day.dto';
import { UpdateCourseDayDto } from './dto/update-course-day.dto';
import { CreateCourseDayItemDto } from './dto/create-course-day-item.dto';
import { UpdateCourseDayItemDto } from './dto/update-course-day-item.dto';

@Injectable()
export class CourseDaysService {
  constructor(private readonly prisma: PrismaService) {}

  async createDay(courseId: string, dto: CreateCourseDayDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const position = dto.position ?? ((await this.prisma.courseDay.count({ where: { courseId } })) + 1);
    return this.prisma.courseDay.create({
      data: {
        courseId,
        dayNumber: dto.dayNumber,
        title: dto.title,
        description: dto.description,
        isTrial: dto.isTrial ?? false,
        position,
      },
      include: { items: { orderBy: { position: 'asc' } } },
    });
  }

  async updateDay(dayId: string, dto: UpdateCourseDayDto) {
    const day = await this.prisma.courseDay.findUnique({ where: { id: dayId } });
    if (!day) throw new NotFoundException('Course day not found');
    return this.prisma.courseDay.update({ where: { id: dayId }, data: dto, include: { items: { orderBy: { position: 'asc' } } } });
  }

  async deleteDay(dayId: string) {
    const day = await this.prisma.courseDay.findUnique({ where: { id: dayId } });
    if (!day) throw new NotFoundException('Course day not found');
    await this.prisma.courseDayItem.deleteMany({ where: { courseDayId: dayId } });
    return this.prisma.courseDay.delete({ where: { id: dayId } });
  }

  async createDayItem(dayId: string, dto: CreateCourseDayItemDto) {
    const day = await this.prisma.courseDay.findUnique({ where: { id: dayId } });
    if (!day) throw new NotFoundException('Course day not found');
    const position = dto.position ?? ((await this.prisma.courseDayItem.count({ where: { courseDayId: dayId } })) + 1);
    return this.prisma.courseDayItem.create({
      data: {
        courseDayId: dayId,
        contentType: dto.contentType,
        title: dto.title,
        description: dto.description,
        lessonId: dto.lessonId,
        lessonAssetId: dto.lessonAssetId,
        noteContent: dto.noteContent,
        position,
      },
      include: { lesson: true, lessonAsset: true },
    });
  }

  async updateDayItem(itemId: string, dto: UpdateCourseDayItemDto) {
    const item = await this.prisma.courseDayItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Course day item not found');
    return this.prisma.courseDayItem.update({ where: { id: itemId }, data: dto, include: { lesson: true, lessonAsset: true } });
  }

  async deleteDayItem(itemId: string) {
    const item = await this.prisma.courseDayItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Course day item not found');
    return this.prisma.courseDayItem.delete({ where: { id: itemId } });
  }
}
