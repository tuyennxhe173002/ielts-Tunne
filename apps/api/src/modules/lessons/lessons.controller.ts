import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApprovedUserGuard } from '../auth/approved-user.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('sections/:sectionId/lessons')
  create(@Param('sectionId') sectionId: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(sectionId, dto).then((data) => ({ data }));
  }

  @Get('lessons/:lessonId')
  detail(@Param('lessonId') lessonId: string) {
    return this.lessonsService.detail(lessonId).then((data) => ({ data }));
  }

  @Patch('lessons/:lessonId')
  update(@Param('lessonId') lessonId: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(lessonId, dto).then((data) => ({ data }));
  }

  @Delete('lessons/:lessonId')
  remove(@Param('lessonId') lessonId: string) {
    return this.lessonsService.remove(lessonId).then((data) => ({ data }));
  }
}

@Controller('lessons')
@UseGuards(AuthGuard, ApprovedUserGuard)
export class StudentLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonId')
  detail(@Param('lessonId') lessonId: string, @CurrentUser() user: AuthUser) {
    return this.lessonsService.detailForStudent(lessonId, user.id).then((data) => ({ data }));
  }
}
