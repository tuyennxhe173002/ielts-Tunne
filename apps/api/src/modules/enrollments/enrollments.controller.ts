import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

class RevokeEnrollmentDto {
  reason?: string;
}

class UpdateEnrollmentDto {
  status?: 'active' | 'paused' | 'revoked' | 'expired';
  expiresAt?: string | null;
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
  @UseGuards(CsrfGuard)
  create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.create(dto, user.id).then((data) => ({ data }));
  }

  @Patch(':enrollmentId/revoke')
  @UseGuards(CsrfGuard)
  revoke(@Param('enrollmentId') enrollmentId: string, @Body() dto: RevokeEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.revoke(enrollmentId, user.id, dto.reason).then((data) => ({ data }));
  }

  @Patch(':enrollmentId')
  @UseGuards(CsrfGuard)
  update(@Param('enrollmentId') enrollmentId: string, @Body() dto: UpdateEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.update(enrollmentId, user.id, dto).then((data) => ({ data }));
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
