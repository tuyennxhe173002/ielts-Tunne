import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { RolesModule } from './roles/roles.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { SessionsModule } from './sessions/sessions.module';
import { DevicesModule } from './devices/devices.module';
import { SectionsModule } from './sections/sections.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssetsModule } from './assets/assets.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ApprovalsModule,
    SessionsModule,
    DevicesModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    AssetsModule,
    EnrollmentsModule,
    ProgressModule,
    CommentsModule,
    NotificationsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
