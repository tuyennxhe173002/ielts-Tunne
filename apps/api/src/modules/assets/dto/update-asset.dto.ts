import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  displayName?: string;

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
