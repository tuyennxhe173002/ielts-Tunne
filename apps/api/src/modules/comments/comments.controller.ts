import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('lessons/:lessonId/comments')
  @UseGuards(AuthGuard, ApprovedUserGuard)
  list(@Param('lessonId') lessonId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.listForLesson(lessonId, user.id).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/comments')
  @UseGuards(AuthGuard, ApprovedUserGuard, CsrfGuard)
  create(@Param('lessonId') lessonId: string, @CurrentUser() user: AuthUser, @Body() dto: CreateCommentDto) {
    return this.commentsService.createRoot(lessonId, user.id, dto.body).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/comments/:commentId/replies')
  @UseGuards(AuthGuard, ApprovedUserGuard, CsrfGuard)
  reply(@Param('lessonId') lessonId: string, @Param('commentId') commentId: string, @CurrentUser() user: AuthUser, @Body() dto: CreateCommentDto) {
    return this.commentsService.reply(lessonId, commentId, user.id, dto.body).then((data) => ({ data }));
  }

  @Patch('comments/:commentId')
  @UseGuards(AuthGuard, ApprovedUserGuard, CsrfGuard)
  update(@Param('commentId') commentId: string, @CurrentUser() user: AuthUser, @Body() dto: UpdateCommentDto) {
    return this.commentsService.updateOwn(commentId, user.id, dto.body).then((data) => ({ data }));
  }

  @Delete('comments/:commentId')
  @UseGuards(AuthGuard, ApprovedUserGuard, CsrfGuard)
  remove(@Param('commentId') commentId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.deleteOwn(commentId, user.id).then((data) => ({ data }));
  }

  @Get('admin/comments')
  @UseGuards(AuthGuard, AdminGuard)
  listAdmin() {
    return this.commentsService.listForAdmin().then((data) => ({ data }));
  }

  @Post('admin/comments/:commentId/hide')
  @UseGuards(AuthGuard, AdminGuard, CsrfGuard)
  hide(@Param('commentId') commentId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.hide(commentId, user.id).then((data) => ({ data }));
  }

  @Post('admin/comments/:commentId/delete')
  @UseGuards(AuthGuard, AdminGuard, CsrfGuard)
  deleteAdmin(@Param('commentId') commentId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.remove(commentId, user.id).then((data) => ({ data }));
  }
}
