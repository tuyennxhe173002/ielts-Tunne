import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
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
  @UseGuards(CsrfGuard)
  update(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.updateLessonProgress(user.id, lessonId, dto).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/complete')
  @UseGuards(CsrfGuard)
  complete(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.progressService.completeLesson(user.id, lessonId).then((data) => ({ data }));
  }
}
