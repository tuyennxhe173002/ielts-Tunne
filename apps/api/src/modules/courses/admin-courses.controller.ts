import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('admin/courses')
@UseGuards(AuthGuard, AdminGuard)
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  list() {
    return this.coursesService.listAdmin().then((data) => ({ data }));
  }

  @Get(':courseId')
  detail(@Param('courseId') courseId: string) {
    return this.coursesService.getAdminCourse(courseId).then((data) => ({ data }));
  }

  @Post()
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthUser) {
    return this.coursesService.createCourse(dto, user.id).then((data) => ({ data }));
  }

  @Patch(':courseId')
  update(@Param('courseId') courseId: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: AuthUser) {
    return this.coursesService.updateCourse(courseId, dto, user.id).then((data) => ({ data }));
  }

  @Patch(':courseId/archive')
  archive(@Param('courseId') courseId: string, @CurrentUser() user: AuthUser) {
    return this.coursesService.archiveCourse(courseId, user.id).then((data) => ({ data }));
  }
}
