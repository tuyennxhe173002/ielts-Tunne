import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
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
  @UseGuards(CsrfGuard)
  approve(@Param('userId') userId: string, @Body() dto: ApprovalDecisionDto, @CurrentUser() user: AuthUser) {
    return this.approvalsService.approve(userId, user.id, dto.note).then((data) => ({ data }));
  }

  @Post(':userId/reject')
  @UseGuards(CsrfGuard)
  reject(@Param('userId') userId: string, @Body() dto: ApprovalDecisionDto, @CurrentUser() user: AuthUser) {
    return this.approvalsService.reject(userId, user.id, dto.note).then((data) => ({ data }));
  }
}
