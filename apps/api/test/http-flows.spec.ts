/// <reference types="jest" />

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { CoursesController, StudentCoursesController, StudentDashboardController } from '../src/modules/courses/courses.controller';
import { CoursesService } from '../src/modules/courses/courses.service';
import { StudentEnrollmentsController } from '../src/modules/enrollments/enrollments.controller';
import { EnrollmentsService } from '../src/modules/enrollments/enrollments.service';
import { CommentsController } from '../src/modules/comments/comments.controller';
import { CommentsService } from '../src/modules/comments/comments.service';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { ApprovedUserGuard } from '../src/common/guards/approved-user.guard';
import { CsrfGuard } from '../src/common/guards/csrf.guard';

describe('HTTP flows', () => {
  let app: INestApplication;

  const authService = {
    register: jest.fn().mockResolvedValue({ userId: 'u1', status: 'pending' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token', user: { status: 'approved' } }),
    me: jest.fn().mockReturnValue({ id: 'u1', email: 'student@example.com', role: 'student', status: 'approved', fullName: 'Student', sessionId: 's1' }),
    refresh: jest.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
    logout: jest.fn().mockResolvedValue({ ok: true }),
  };

  const coursesService = {
    listPublic: jest.fn().mockResolvedValue([{ slug: 'ielts-foundation' }]),
    detailPublic: jest.fn().mockResolvedValue({ slug: 'ielts-foundation', title: 'IELTS Foundation', sections: [] }),
    getStudentCourse: jest.fn().mockResolvedValue({ slug: 'ielts-foundation', title: 'IELTS Foundation', sections: [] }),
    getDashboard: jest.fn().mockResolvedValue({ totalCourses: 1, completedLessons: 2, continueLearning: null, recentProgress: [] }),
  };

  const enrollmentsService = {
    listStudentCourses: jest.fn().mockResolvedValue([{ id: 'e1', status: 'active', course: { id: 'c1', title: 'IELTS Foundation', slug: 'ielts-foundation' } }]),
  };

  const commentsService = {
    listForLesson: jest.fn().mockResolvedValue([]),
    createRoot: jest.fn().mockResolvedValue({ id: 'c1', body: 'hello' }),
    reply: jest.fn().mockResolvedValue({ id: 'r1', body: 'reply' }),
    updateOwn: jest.fn().mockResolvedValue({ id: 'c1', body: 'edited' }),
    deleteOwn: jest.fn().mockResolvedValue({ id: 'c1', status: 'deleted' }),
    listForAdmin: jest.fn().mockResolvedValue([]),
    hide: jest.fn().mockResolvedValue({ id: 'c1', status: 'hidden' }),
    remove: jest.fn().mockResolvedValue({ id: 'c1', status: 'deleted' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController, CoursesController, StudentCoursesController, StudentDashboardController, StudentEnrollmentsController, CommentsController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: CoursesService, useValue: coursesService },
        { provide: EnrollmentsService, useValue: enrollmentsService },
        { provide: CommentsService, useValue: commentsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: (ctx: any) => { const req = ctx.switchToHttp().getRequest(); req.user = { id: 'u1', email: 'student@example.com', role: 'student', status: 'approved', sessionId: 's1', fullName: 'Student' }; return true; } })
      .overrideGuard(ApprovedUserGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CsrfGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register endpoint returns pending user', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'student@example.com', password: 'Password123!', fullName: 'Student' })
      .expect(201)
      .expect(({ body }: { body: { data: { status: string } } }) => {
        expect(body.data.status).toBe('pending');
      });
  });

  it('student courses endpoint returns enrolled courses', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/me/courses')
      .expect(200)
      .expect(({ body }: { body: { data: unknown[] } }) => {
        expect(body.data).toHaveLength(1);
      });
  });

  it('student lesson comments create endpoint works', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/lessons/lesson-1/comments')
      .send({ body: 'Question' })
      .expect(201)
      .expect(({ body }: { body: { data: { id: string } } }) => {
        expect(body.data.id).toBe('c1');
      });
  });

  it('dashboard endpoint returns summary payload', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/me/dashboard')
      .expect(200)
      .expect(({ body }: { body: { data: { totalCourses: number } } }) => {
        expect(body.data.totalCourses).toBe(1);
      });
  });
});
