import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuditLogsService } from './audit-logs.service';

@Controller('admin/audit-logs')
@UseGuards(AuthGuard, AdminGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  list(@Query('actionType') actionType?: string, @Query('entityType') entityType?: string, @Query('actorEmail') actorEmail?: string) {
    return this.auditLogsService.listAdmin({ actionType, entityType, actorEmail }).then((data) => ({ data }));
  }
}
