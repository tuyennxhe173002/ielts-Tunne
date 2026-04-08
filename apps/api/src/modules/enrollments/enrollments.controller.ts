import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { ApprovedUserGuard } from '../auth/approved-user.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

class RevokeEnrollmentDto {
  reason?: string;
}

@Controller('admin/enrollments')
@UseGuards(AuthGuard, AdminGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  list(@Query('userId') userId?: string) {
    return this.enrollmentsService.list(userId).then((data) => ({ data }));
  }

  @Post()
  create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.create(dto, user.id).then((data) => ({ data }));
  }

  @Patch(':enrollmentId/revoke')
  revoke(@Param('enrollmentId') enrollmentId: string, @Body() dto: RevokeEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.revoke(enrollmentId, user.id, dto.reason).then((data) => ({ data }));
  }
}

@Controller('me/courses')
@UseGuards(AuthGuard, ApprovedUserGuard)
export class StudentEnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.enrollmentsService.listStudentCourses(user.id).then((data) => ({ data }));
  }
}
