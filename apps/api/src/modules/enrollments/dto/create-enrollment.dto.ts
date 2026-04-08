import { IsOptional, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  courseId!: string;

  @IsOptional()
  expiresAt?: string;
}
