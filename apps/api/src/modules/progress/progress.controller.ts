import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApprovedUserGuard } from '../auth/approved-user.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user.type';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressService } from './progress.service';

@Controller('me/progress')
@UseGuards(AuthGuard, ApprovedUserGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.progressService.listByUser(user.id).then((data) => ({ data }));
  }

  @Get('lessons/:lessonId')
  getOne(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.progressService.getLessonProgress(user.id, lessonId).then((data) => ({ data }));
  }

  @Put('lessons/:lessonId')
  update(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.updateLessonProgress(user.id, lessonId, dto).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/complete')
  complete(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.progressService.completeLesson(user.id, lessonId).then((data) => ({ data }));
  }
}
