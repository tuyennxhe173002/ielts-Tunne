import { IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateCourseDayItemDto {
  @IsOptional()
  @IsIn(['video', 'document', 'audio', 'assignment', 'note', 'mixed'])
  contentType?: 'video' | 'document' | 'audio' | 'assignment' | 'note' | 'mixed';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  lessonId?: string | null;

  @IsOptional()
  @IsUUID()
  lessonAssetId?: string | null;

  @IsOptional()
  @IsString()
  noteContent?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
}
