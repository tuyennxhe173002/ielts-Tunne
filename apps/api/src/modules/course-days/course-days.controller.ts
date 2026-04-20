import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CourseDaysService } from './course-days.service';
import { CreateCourseDayDto } from './dto/create-course-day.dto';
import { UpdateCourseDayDto } from './dto/update-course-day.dto';
import { CreateCourseDayItemDto } from './dto/create-course-day-item.dto';
import { UpdateCourseDayItemDto } from './dto/update-course-day-item.dto';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class CourseDaysController {
  constructor(private readonly courseDaysService: CourseDaysService) {}

  @Post('courses/:courseId/days')
  @UseGuards(CsrfGuard)
  createDay(@Param('courseId') courseId: string, @Body() dto: CreateCourseDayDto) {
    return this.courseDaysService.createDay(courseId, dto).then((data) => ({ data }));
  }

  @Patch('course-days/:dayId')
  @UseGuards(CsrfGuard)
  updateDay(@Param('dayId') dayId: string, @Body() dto: UpdateCourseDayDto) {
    return this.courseDaysService.updateDay(dayId, dto).then((data) => ({ data }));
  }

  @Delete('course-days/:dayId')
  @UseGuards(CsrfGuard)
  deleteDay(@Param('dayId') dayId: string) {
    return this.courseDaysService.deleteDay(dayId).then((data) => ({ data }));
  }

  @Post('course-days/:dayId/items')
  @UseGuards(CsrfGuard)
  createDayItem(@Param('dayId') dayId: string, @Body() dto: CreateCourseDayItemDto) {
    return this.courseDaysService.createDayItem(dayId, dto).then((data) => ({ data }));
  }

  @Patch('course-day-items/:itemId')
  @UseGuards(CsrfGuard)
  updateDayItem(@Param('itemId') itemId: string, @Body() dto: UpdateCourseDayItemDto) {
    return this.courseDaysService.updateDayItem(itemId, dto).then((data) => ({ data }));
  }

  @Delete('course-day-items/:itemId')
  @UseGuards(CsrfGuard)
  deleteDayItem(@Param('itemId') itemId: string) {
    return this.courseDaysService.deleteDayItem(itemId).then((data) => ({ data }));
  }
}
