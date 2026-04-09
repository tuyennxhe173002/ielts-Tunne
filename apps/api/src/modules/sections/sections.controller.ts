import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  @UseGuards(CsrfGuard)
  create(@Param('courseId') courseId: string, @Body() dto: CreateSectionDto) {
    return this.sectionsService.create(courseId, dto).then((data) => ({ data }));
  }

  @Patch('sections/:sectionId')
  @UseGuards(CsrfGuard)
  update(@Param('sectionId') sectionId: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(sectionId, dto).then((data) => ({ data }));
  }

  @Delete('sections/:sectionId')
  @UseGuards(CsrfGuard)
  remove(@Param('sectionId') sectionId: string) {
    return this.sectionsService.remove(sectionId).then((data) => ({ data }));
  }
}
