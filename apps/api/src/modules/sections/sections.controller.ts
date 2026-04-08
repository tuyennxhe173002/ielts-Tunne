import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  create(@Param('courseId') courseId: string, @Body() dto: CreateSectionDto) {
    return this.sectionsService.create(courseId, dto).then((data) => ({ data }));
  }

  @Patch('sections/:sectionId')
  update(@Param('sectionId') sectionId: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(sectionId, dto).then((data) => ({ data }));
  }

  @Delete('sections/:sectionId')
  remove(@Param('sectionId') sectionId: string) {
    return this.sectionsService.remove(sectionId).then((data) => ({ data }));
  }
}
