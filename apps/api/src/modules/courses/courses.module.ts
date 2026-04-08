import { Module } from '@nestjs/common';
import { StudentCoursesController } from './courses.controller';
import { AdminCoursesController } from './admin-courses.controller';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [EnrollmentsModule],
  controllers: [CoursesController, StudentCoursesController, AdminCoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
