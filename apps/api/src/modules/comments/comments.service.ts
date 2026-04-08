import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService,
  ) {}

  async listForLesson(lessonId: string, userId: string) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    const comments = await this.prisma.lessonComment.findMany({
      where: { lessonId, status: 'visible' },
      include: { author: { include: { profile: true, primaryRole: true } } },
      orderBy: { createdAt: 'asc' },
    });

    const roots = comments.filter((comment) => !comment.parentId);
    return roots.map((comment) => ({
      ...comment,
      replies: comments.filter((reply) => reply.parentId === comment.id),
    }));
  }

  async createRoot(lessonId: string, userId: string, body: string) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    return this.prisma.lessonComment.create({
      data: { lessonId, userId, body },
      include: { author: { include: { profile: true, primaryRole: true } } },
    });
  }

  async reply(lessonId: string, parentId: string, userId: string, body: string) {
    await this.lessonsService.detailForStudent(lessonId, userId);
    const parent = await this.prisma.lessonComment.findFirst({ where: { id: parentId, lessonId, status: 'visible' } });
    if (!parent) throw new NotFoundException('Parent comment not found');
    if (parent.parentId) throw new ForbiddenException('Nested replies deeper than 1 level are not allowed');
    return this.prisma.lessonComment.create({
      data: { lessonId, parentId, userId, body },
      include: { author: { include: { profile: true, primaryRole: true } } },
    });
  }

  async updateOwn(commentId: string, userId: string, body: string) {
    const comment = await this.prisma.lessonComment.findUnique({ where: { id: commentId } });
    if (!comment || comment.deletedAt) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot edit another user comment');
    return this.prisma.lessonComment.update({ where: { id: commentId }, data: { body, editedAt: new Date() } });
  }

  async deleteOwn(commentId: string, userId: string) {
    const comment = await this.prisma.lessonComment.findUnique({ where: { id: commentId } });
    if (!comment || comment.deletedAt) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot delete another user comment');
    return this.prisma.lessonComment.update({ where: { id: commentId }, data: { status: 'deleted', deletedAt: new Date() } });
  }

  listForAdmin() {
    return this.prisma.lessonComment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lesson: { select: { id: true, title: true, course: { select: { title: true } } } },
        author: { include: { profile: true, primaryRole: true } },
      },
      take: 200,
    });
  }

  async hide(commentId: string, adminUserId: string) {
    const comment = await this.prisma.lessonComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.prisma.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'comment.hidden', entityType: 'lesson_comment', entityId: commentId } });
    return this.prisma.lessonComment.update({ where: { id: commentId }, data: { status: 'hidden' } });
  }

  async remove(commentId: string, adminUserId: string) {
    const comment = await this.prisma.lessonComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.prisma.auditLog.create({ data: { actorUserId: adminUserId, actionType: 'comment.deleted', entityType: 'lesson_comment', entityId: commentId } });
    return this.prisma.lessonComment.update({ where: { id: commentId }, data: { status: 'deleted', deletedAt: new Date() } });
  }
}
