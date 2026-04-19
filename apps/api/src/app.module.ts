import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health/health.module';
import { AuthModule } from './modules/iam/auth/auth.module';
import { UsersModule } from './modules/iam/users/users.module';
import { RolesModule } from './modules/iam/roles/roles.module';
import { SessionsModule } from './modules/iam/sessions/sessions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ApprovalsModule } from './modules/operations/approvals/approvals.module';
import { NotificationsModule } from './modules/operations/notifications/notifications.module';
import { AuditLogsModule } from './modules/operations/audit-logs/audit-logs.module';
import { CoursesModule } from './modules/lms/courses/courses.module';
import { SectionsModule } from './modules/lms/sections/sections.module';
import { LessonsModule } from './modules/lms/lessons/lessons.module';
import { ResourcesModule } from './modules/lms/resources/resources.module';
import { EnrollmentsModule } from './modules/lms/enrollments/enrollments.module';
import { ProgressModule } from './modules/lms/progress/progress.module';
import { CommentsModule } from './modules/lms/comments/comments.module';
import { CategoriesModule } from './modules/lms/categories/categories.module';
import { DevicesModule } from './modules/devices/devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    AnalyticsModule,
    UsersModule,
    RolesModule,
    ApprovalsModule,
    SessionsModule,
    DevicesModule,
    CategoriesModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    ResourcesModule,
    EnrollmentsModule,
    ProgressModule,
    CommentsModule,
    NotificationsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
