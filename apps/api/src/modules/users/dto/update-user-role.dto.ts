import { IsIn, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsIn(['admin', 'student', 'teacher', 'student_manager'])
  role!: 'admin' | 'student' | 'teacher' | 'student_manager';
}
