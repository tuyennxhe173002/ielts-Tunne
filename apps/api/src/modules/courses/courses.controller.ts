import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApprovedUserGuard } from '../auth/approved-user.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  list() {
    return this.coursesService.listPublic().then((data) => ({ data }));
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.coursesService.detailPublic(slug).then((data) => ({ data }));
  }
}

@Controller('me/courses')
@UseGuards(AuthGuard, ApprovedUserGuard)
export class StudentCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':slug')
  detail(@Param('slug') slug: string, @CurrentUser() user: AuthUser) {
    return this.coursesService.getStudentCourse(slug, user.id).then((data) => ({ data }));
  }
}
