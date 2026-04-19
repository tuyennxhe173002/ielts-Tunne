import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('admin/notifications')
@UseGuards(AuthGuard, AdminGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list() {
    return this.notificationsService.listAdmin().then((data) => ({ data }));
  }

  @Post()
  @UseGuards(CsrfGuard)
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto).then((data) => ({ data }));
  }
}

@Controller('me/notifications')
@UseGuards(AuthGuard, ApprovedUserGuard)
export class MyNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.notificationsService.listForUser(user.id).then((data) => ({ data }));
  }

  @Patch(':notificationId/read')
  @UseGuards(CsrfGuard)
  markRead(@CurrentUser() user: AuthUser, @Param('notificationId') notificationId: string) {
    return this.notificationsService.markRead(user.id, notificationId).then((data) => ({ data }));
  }
}
