import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Prisma } from '@prisma/client';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(lessonId: string, dto: CreateAssetDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const position = dto.position ?? ((await this.prisma.lessonAsset.count({ where: { lessonId } })) + 1);
    return this.prisma.lessonAsset.create({
      data: {
        ...dto,
        lessonId,
        position,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async update(assetId: string, dto: UpdateAssetDto) {
    const asset = await this.prisma.lessonAsset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    return this.prisma.lessonAsset.update({
      where: { id: assetId },
      data: {
        ...dto,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async remove(assetId: string) {
    const asset = await this.prisma.lessonAsset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    return this.prisma.lessonAsset.delete({ where: { id: assetId } });
  }

  listAdminMedia() {
    return this.prisma.lessonAsset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        lesson: {
          include: {
            course: { select: { title: true, slug: true } },
          },
        },
      },
    });
  }

  async issueAssetAccessUrl(lessonId: string, assetId: string, userId: string) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    const asset = await this.prisma.lessonAsset.findFirst({ where: { id: assetId, lessonId } });
    if (!asset) throw new NotFoundException('Asset not found');

    const expiresInSeconds = 60 * 5;
    const token = await this.jwtService.signAsync(
      { kind: 'asset', aid: asset.id, lid: lessonId, sub: userId },
      { secret: process.env.ASSET_URL_SECRET || process.env.JWT_ACCESS_SECRET, expiresIn: `${expiresInSeconds}s` },
    );

    return {
      assetId: asset.id,
      accessUrl: `${process.env.ASSET_ACCESS_BASE_URL || 'http://localhost:4000'}/api/v1/assets/access/${token}`,
      expiresInSeconds,
    };
  }

  async issuePlaybackUrl(lessonId: string, userId: string) {
    const lesson = await this.lessonsService.detailForStudent(lessonId, userId);
    const videoAsset = lesson.assets.find((asset) => asset.assetType === 'video');
    if (!videoAsset) throw new NotFoundException('Video asset not found');

    if (videoAsset.provider === 'bunny_stream') {
      const playbackUrl = this.buildBunnyPlaybackUrl(videoAsset);
      if (playbackUrl) {
        return {
          provider: 'bunny_stream',
          playbackUrl,
          expiresInSeconds: 300,
        };
      }
    }

    const fallback = await this.issueAssetAccessUrl(lessonId, videoAsset.id, userId);
    return {
      provider: videoAsset.provider,
      playbackUrl: fallback.accessUrl,
      expiresInSeconds: fallback.expiresInSeconds,
    };
  }

  async createBunnyVideoAsset(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID || '';
    const apiKey = process.env.BUNNY_STREAM_API_KEY || '';
    if (!libraryId || !apiKey || apiKey === 'replace-me') throw new NotFoundException('Bunny Stream is not configured');

    const createResponse = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: lesson.title }),
    });

    if (!createResponse.ok) throw new NotFoundException('Unable to create Bunny video');
    const created = await createResponse.json() as { guid?: string; videoLibraryId?: number | string };
    const videoId = created.guid || '';
    if (!videoId) throw new NotFoundException('Bunny response missing video id');

    const asset = await this.prisma.lessonAsset.create({
      data: {
        lessonId,
        assetType: 'video',
        provider: 'bunny_stream',
        displayName: `${lesson.title} video`,
        metadataJson: {
          videoId,
          libraryId,
          uploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      asset,
      bunny: {
        videoId,
        libraryId,
        uploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      },
    };
  }

  async uploadBunnyVideo(assetId: string, file: { buffer: Buffer; originalname: string; size: number }) {
    const asset = await this.prisma.lessonAsset.findUnique({ where: { id: assetId } });
    if (!asset || asset.provider !== 'bunny_stream') throw new NotFoundException('Bunny video asset not found');

    const meta = (asset.metadataJson || {}) as Record<string, unknown>;
    const libraryId = typeof meta.libraryId === 'string' ? meta.libraryId : process.env.BUNNY_STREAM_LIBRARY_ID || '';
    const videoId = typeof meta.videoId === 'string' ? meta.videoId : '';
    const apiKey = process.env.BUNNY_STREAM_API_KEY || '';
    if (!libraryId || !videoId || !apiKey || apiKey === 'replace-me') throw new NotFoundException('Bunny upload is not configured');

    const uploadResponse = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      method: 'PUT',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: file.buffer,
    });

    if (!uploadResponse.ok) throw new UnauthorizedException('Bunny upload failed');

    const nextMeta = {
      ...meta,
      originalFileName: file.originalname,
      uploadedAt: new Date().toISOString(),
      uploadStatus: 'uploaded',
      uploadSizeBytes: file.size,
    };

    const updated = await this.prisma.lessonAsset.update({
      where: { id: assetId },
      data: { metadataJson: nextMeta as Prisma.InputJsonValue },
    });

    return { asset: updated };
  }

  async handleBunnyWebhook(rawBody: Buffer, headers: Record<string, string | string[] | undefined>) {
    const signature = `${headers['x-bunnystream-signature'] || ''}`;
    const version = `${headers['x-bunnystream-signature-version'] || ''}`;
    const algorithm = `${headers['x-bunnystream-signature-algorithm'] || ''}`;
    const secret = process.env.BUNNY_STREAM_READONLY_KEY || '';
    if (!this.validateBunnyWebhook(rawBody, signature, version, algorithm, secret)) {
      throw new UnauthorizedException('Invalid Bunny webhook signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8')) as { VideoGuid?: string; Status?: number; VideoLibraryId?: number };
    const videoId = payload.VideoGuid || '';
    const asset = await this.prisma.lessonAsset.findFirst({
      where: {
        provider: 'bunny_stream',
      },
    });
    if (!asset) return { ok: true, matched: false };

    const meta = (asset.metadataJson || {}) as Record<string, unknown>;
    if (meta.videoId !== videoId) {
      const matchingAsset = await this.findBunnyAssetByVideoId(videoId);
      if (!matchingAsset) return { ok: true, matched: false };
      return this.updateBunnyAssetFromWebhook(matchingAsset, payload);
    }
    return this.updateBunnyAssetFromWebhook(asset, payload);
  }

  async resolveAssetAccess(token: string) {
    const payload = await this.jwtService.verifyAsync<{ aid: string; lid: string; sub: string }>(token, {
      secret: process.env.ASSET_URL_SECRET || process.env.JWT_ACCESS_SECRET,
    });
    const asset = await this.prisma.lessonAsset.findFirst({ where: { id: payload.aid, lessonId: payload.lid } });
    if (!asset) throw new NotFoundException('Asset not found');
    const targetUrl = this.resolveAssetTargetUrl(asset);
    if (!targetUrl) throw new NotFoundException('Asset URL not configured');
    return { targetUrl };
  }

  private resolveAssetTargetUrl(asset: { externalUrl: string | null; storageKey: string | null; provider: string; metadataJson: unknown }) {
    if (asset.externalUrl) return asset.externalUrl;
    if (asset.provider === 'bunny_stream') return this.buildBunnyPlaybackUrl(asset as never);
    if (asset.storageKey && process.env.ASSET_PUBLIC_BASE_URL) return `${process.env.ASSET_PUBLIC_BASE_URL.replace(/\/$/, '')}/${asset.storageKey.replace(/^\//, '')}`;
    return '';
  }

  private buildBunnyPlaybackUrl(asset: { externalUrl: string | null; metadataJson: unknown }) {
    if (asset.externalUrl) return asset.externalUrl;
    const meta = (asset.metadataJson || {}) as Record<string, unknown>;
    const videoId = typeof meta.videoId === 'string' ? meta.videoId : '';
    const libraryId = typeof meta.libraryId === 'string' ? meta.libraryId : process.env.BUNNY_STREAM_LIBRARY_ID || '';
    const embedHost = process.env.BUNNY_STREAM_EMBED_HOST || 'player.mediadelivery.net';
    if (!videoId || !libraryId) return '';

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signingKey = process.env.BUNNY_STREAM_SIGNING_KEY || '';
    const baseUrl = `https://${embedHost}/embed/${libraryId}/${videoId}`;
    if (!signingKey || signingKey === 'replace-me') return baseUrl;

    const token = createHash('sha256').update(`${signingKey}${videoId}${expires}`).digest('hex');
    return `${baseUrl}?token=${token}&expires=${expires}`;
  }

  private validateBunnyWebhook(rawBody: Buffer, signature: string, version: string, algorithm: string, secret: string) {
    if (!secret || !signature || version !== 'v1' || algorithm !== 'hmac-sha256') return false;
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    if (expected.length !== signature.length) return false;
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
  }

  private async findBunnyAssetByVideoId(videoId: string) {
    const assets = await this.prisma.lessonAsset.findMany({ where: { provider: 'bunny_stream' } });
    return assets.find((asset) => {
      const meta = (asset.metadataJson || {}) as Record<string, unknown>;
      return meta.videoId === videoId;
    }) || null;
  }

  private async updateBunnyAssetFromWebhook(asset: { id: string; metadataJson: unknown }, payload: { VideoGuid?: string; Status?: number; VideoLibraryId?: number }) {
    const meta = (asset.metadataJson || {}) as Record<string, unknown>;
    const nextMeta = {
      ...meta,
      videoId: payload.VideoGuid || meta.videoId,
      libraryId: payload.VideoLibraryId ? String(payload.VideoLibraryId) : meta.libraryId,
      bunnyStatus: payload.Status ?? meta.bunnyStatus,
      bunnyStatusLabel: this.mapBunnyStatus(payload.Status),
      lastWebhookAt: new Date().toISOString(),
    };
    await this.prisma.lessonAsset.update({ where: { id: asset.id }, data: { metadataJson: nextMeta as Prisma.InputJsonValue } });
    return { ok: true, matched: true };
  }

  private mapBunnyStatus(status?: number) {
    const labels: Record<number, string> = {
      0: 'queued',
      1: 'processing',
      2: 'encoding',
      3: 'finished',
      4: 'resolution_finished',
      5: 'failed',
      6: 'presigned_upload_started',
      7: 'presigned_upload_finished',
      8: 'presigned_upload_failed',
      9: 'captions_generated',
      10: 'title_or_description_generated',
    };
    return typeof status === 'number' ? labels[status] || `unknown_${status}` : 'unknown';
  }
}
