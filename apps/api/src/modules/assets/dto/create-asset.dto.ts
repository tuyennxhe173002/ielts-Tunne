import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateAssetDto {
  @IsIn(['video', 'pdf', 'doc', 'slide', 'audio', 'image', 'link'])
  assetType!: 'video' | 'pdf' | 'doc' | 'slide' | 'audio' | 'image' | 'link';

  @IsIn(['bunny_stream', 'r2', 's3', 'external'])
  provider!: 'bunny_stream' | 'r2' | 's3' | 'external';

  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsOptional()
  @IsString()
  storageKey?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @IsOptional()
  @IsBoolean()
  isDownloadable?: boolean;

  @IsOptional()
  metadataJson?: Record<string, unknown>;
}
