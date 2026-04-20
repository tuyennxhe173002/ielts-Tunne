import { Module } from '@nestjs/common';
import { CourseDaysController } from './course-days.controller';
import { CourseDaysService } from './course-days.service';

@Module({
  controllers: [CourseDaysController],
  providers: [CourseDaysService],
  exports: [CourseDaysService],
})
export class CourseDaysModule {}
