import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'suspended'])
  status!: 'pending' | 'approved' | 'rejected' | 'suspended';

  @IsOptional()
  @IsString()
  reason?: string;
}
