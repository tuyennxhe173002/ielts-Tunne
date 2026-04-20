import { IsIn, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateCourseDayItemDto {
  @IsIn(['video', 'document', 'audio', 'assignment', 'note', 'mixed'])
  contentType!: 'video' | 'document' | 'audio' | 'assignment' | 'note' | 'mixed';

  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @IsOptional()
  @IsUUID()
  lessonAssetId?: string;

  @IsOptional()
  @IsString()
  noteContent?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;
}
