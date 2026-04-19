/// <reference types="jest" />

import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';
import { EnrollmentsService } from '../src/modules/enrollments/enrollments.service';
import { LessonsService } from '../src/modules/lessons/lessons.service';
import { CommentsService } from '../src/modules/comments/comments.service';

describe('Core flows', () => {
  describe('AuthService', () => {
    it('registers a pending student', async () => {
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'u1',
            email: 'student@example.com',
            status: 'pending',
            profile: { fullName: 'Student' },
            primaryRole: { code: 'student' },
          }),
        },
        role: {
          findUnique: jest.fn().mockResolvedValue({ id: 'r-student', code: 'student' }),
        },
      } as any;

      const service = new AuthService(prisma, {} as JwtService);
      const result = await service.register({ email: 'student@example.com', password: 'Password123!', fullName: 'Student' });

      expect(result.status).toBe('pending');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('rejects duplicate email registration', async () => {
      const prisma = {
        user: { findUnique: jest.fn().mockResolvedValue({ id: 'u1' }) },
        role: { findUnique: jest.fn() },
      } as any;
      const service = new AuthService(prisma, {} as JwtService);

      await expect(service.register({ email: 'student@example.com', password: 'Password123!', fullName: 'Student' })).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('EnrollmentsService', () => {
    it('throws when active enrollment does not exist', async () => {
      const prisma = {
        enrollment: { findFirst: jest.fn().mockResolvedValue(null) },
      } as any;
      const service = new EnrollmentsService(prisma, { create: jest.fn() } as any);
      await expect(service.assertEnrollment('u1', 'c1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('LessonsService', () => {
    it('blocks access when parent course is not published', async () => {
      const prisma = {
        lesson: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'l1',
            status: 'published',
            courseId: 'c1',
            course: { id: 'c1', slug: 'course', title: 'Course', status: 'draft', visibility: 'public' },
            section: { id: 's1', title: 'Section', status: 'published' },
            assets: [],
          }),
        },
      } as any;
      const enrollmentsService = { assertEnrollment: jest.fn() } as any;
      const service = new LessonsService(prisma, enrollmentsService);

      await expect(service.detailForStudent('l1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('CommentsService', () => {
    it('blocks edit on another user comment', async () => {
      const prisma = {
        lessonComment: {
          findUnique: jest.fn().mockResolvedValue({ id: 'c1', userId: 'u2', deletedAt: null, lessonId: 'l1' }),
        },
      } as any;
      const lessonsService = { detailForStudent: jest.fn() } as any;
      const service = new CommentsService(prisma, lessonsService);

      await expect(service.updateOwn('c1', 'u1', 'edited')).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('re-checks lesson access on delete own comment', async () => {
      const prisma = {
        lessonComment: {
          findUnique: jest.fn().mockResolvedValue({ id: 'c1', userId: 'u1', deletedAt: null, lessonId: 'l1' }),
          update: jest.fn().mockResolvedValue({ id: 'c1', status: 'deleted' }),
        },
      } as any;
      const lessonsService = { detailForStudent: jest.fn().mockRejectedValue(new UnauthorizedException()) } as any;
      const service = new CommentsService(prisma, lessonsService);

      await expect(service.deleteOwn('c1', 'u1')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
