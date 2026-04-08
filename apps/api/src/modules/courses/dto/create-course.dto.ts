import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  slug!: string;

  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsIn(['ielts', 'toeic', 'japanese', 'korean'])
  categorySlug!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
