import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(courseId: string, dto: CreateSectionDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const position = dto.position ?? ((await this.prisma.courseSection.count({ where: { courseId } })) + 1);
    return this.prisma.courseSection.create({ data: { courseId, title: dto.title, description: dto.description, position } });
  }

  async update(sectionId: string, dto: UpdateSectionDto) {
    const section = await this.prisma.courseSection.findUnique({ where: { id: sectionId } });
    if (!section) throw new NotFoundException('Section not found');
    return this.prisma.courseSection.update({ where: { id: sectionId }, data: dto });
  }

  async remove(sectionId: string) {
    const section = await this.prisma.courseSection.findUnique({ where: { id: sectionId }, include: { lessons: true } });
    if (!section) throw new NotFoundException('Section not found');
    if (section.lessons.length > 0) throw new NotFoundException('Delete lessons in this section first');
    return this.prisma.courseSection.delete({ where: { id: sectionId } });
  }
}
