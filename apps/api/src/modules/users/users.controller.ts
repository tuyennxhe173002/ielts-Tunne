import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('admin/users')
@UseGuards(AuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.usersService.listUsers(status).then((data) => ({ data }));
  }

  @Get('pending')
  pending() {
    return this.usersService.listUsers('pending').then((data) => ({ data }));
  }

  @Get(':userId')
  detail(@Param('userId') userId: string) {
    return this.usersService.getUser(userId).then((data) => ({ data }));
  }
}
