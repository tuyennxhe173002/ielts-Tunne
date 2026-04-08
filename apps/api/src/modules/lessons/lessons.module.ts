import { Module } from '@nestjs/common';
import { StudentLessonsController } from './lessons.controller';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [EnrollmentsModule],
  controllers: [LessonsController, StudentLessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
