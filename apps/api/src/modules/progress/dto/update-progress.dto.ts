import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsIn(['not_started', 'in_progress', 'completed'])
  status?: 'not_started' | 'in_progress' | 'completed';

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lastPositionSeconds?: number;
}
