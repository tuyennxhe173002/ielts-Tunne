import { Body, Controller, Delete, Get, Param, Patch, Post, Redirect, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetsService } from './assets.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminAssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('lessons/:lessonId/assets')
  @UseGuards(CsrfGuard)
  create(@Param('lessonId') lessonId: string, @Body() dto: CreateAssetDto) {
    return this.assetsService.create(lessonId, dto).then((data) => ({ data }));
  }

  @Patch('assets/:assetId')
  @UseGuards(CsrfGuard)
  update(@Param('assetId') assetId: string, @Body() dto: UpdateAssetDto) {
    return this.assetsService.update(assetId, dto).then((data) => ({ data }));
  }

  @Delete('assets/:assetId')
  @UseGuards(CsrfGuard)
  remove(@Param('assetId') assetId: string) {
    return this.assetsService.remove(assetId).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/bunny-video')
  @UseGuards(CsrfGuard)
  createBunnyVideo(@Param('lessonId') lessonId: string) {
    return this.assetsService.createBunnyVideoAsset(lessonId).then((data) => ({ data }));
  }

  @Get('media')
  listAdminMedia() {
    return this.assetsService.listAdminMedia().then((data) => ({ data }));
  }

  @Post('assets/:assetId/bunny-upload')
  @UseGuards(CsrfGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadBunnyVideo(@Param('assetId') assetId: string, @UploadedFile() file: { buffer: Buffer; originalname: string; size: number }) {
    return this.assetsService.uploadBunnyVideo(assetId, file).then((data) => ({ data }));
  }
}

@Controller()
export class StudentAssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('lessons/:lessonId/assets/:assetId/access-url')
  @UseGuards(AuthGuard, ApprovedUserGuard)
  issueAccessUrl(@Param('lessonId') lessonId: string, @Param('assetId') assetId: string, @CurrentUser() user: AuthUser) {
    return this.assetsService.issueAssetAccessUrl(lessonId, assetId, user.id).then((data) => ({ data }));
  }

  @Post('lessons/:lessonId/playback-token')
  @UseGuards(AuthGuard, ApprovedUserGuard)
  issuePlayback(@Param('lessonId') lessonId: string, @CurrentUser() user: AuthUser) {
    return this.assetsService.issuePlaybackUrl(lessonId, user.id).then((data) => ({ data }));
  }

  @Get('assets/access/:token')
  @Redirect()
  async resolveAccess(@Param('token') token: string) {
    const result = await this.assetsService.resolveAssetAccess(token);
    return { url: result.targetUrl, statusCode: 302 };
  }

  @Post('webhooks/bunny/stream')
  async bunnyWebhook(@Req() request: Request & { rawBody?: Buffer }) {
    return { data: await this.assetsService.handleBunnyWebhook(request.rawBody || Buffer.from(JSON.stringify(request.body || {})), request.headers) };
  }
}
