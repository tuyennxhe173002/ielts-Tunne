import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { ApprovalsService } from './approvals.service';

class ApprovalDecisionDto {
  note?: string;
}

@Controller('admin/approvals')
@UseGuards(AuthGuard, AdminGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('pending')
  pending() {
    return this.approvalsService.pending().then((data) => ({ data }));
  }

  @Post(':userId/approve')
  approve(@Param('userId') userId: string, @Body() dto: ApprovalDecisionDto, @CurrentUser() user: AuthUser) {
    return this.approvalsService.approve(userId, user.id, dto.note).then((data) => ({ data }));
  }

  @Post(':userId/reject')
  reject(@Param('userId') userId: string, @Body() dto: ApprovalDecisionDto, @CurrentUser() user: AuthUser) {
    return this.approvalsService.reject(userId, user.id, dto.note).then((data) => ({ data }));
  }
}
