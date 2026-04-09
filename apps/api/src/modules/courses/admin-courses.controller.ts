import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
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
  @UseGuards(CsrfGuard)
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthUser) {
    return this.coursesService.createCourse(dto, user.id).then((data) => ({ data }));
  }

  @Patch(':courseId')
  @UseGuards(CsrfGuard)
  update(@Param('courseId') courseId: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: AuthUser) {
    return this.coursesService.updateCourse(courseId, dto, user.id).then((data) => ({ data }));
  }

  @Patch(':courseId/archive')
  @UseGuards(CsrfGuard)
  archive(@Param('courseId') courseId: string, @CurrentUser() user: AuthUser) {
    return this.coursesService.archiveCourse(courseId, user.id).then((data) => ({ data }));
  }
}
