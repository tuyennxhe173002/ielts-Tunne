import { PrismaClient, RoleCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({ where: { code: RoleCode.admin }, update: {}, create: { code: RoleCode.admin, name: 'Admin' } });
  await prisma.role.upsert({ where: { code: RoleCode.student }, update: {}, create: { code: RoleCode.student, name: 'Student' } });

  const categories = [
    ['ielts', 'IELTS'],
    ['toeic', 'TOEIC'],
    ['japanese', 'Japanese'],
    ['korean', 'Korean'],
  ];

  for (const [slug, name] of categories) {
    await prisma.courseCategory.upsert({ where: { slug }, update: {}, create: { slug, name } });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.admin } });
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { status: 'approved', primaryRoleId: adminRole.id },
      create: {
        email: adminEmail,
        status: 'approved',
        primaryRoleId: adminRole.id,
        profile: { create: { fullName: 'Platform Admin' } },
        credentials: { create: { provider: 'password', passwordHash } },
      },
      include: { profile: true },
    });

    const ielts = await prisma.courseCategory.findUniqueOrThrow({ where: { slug: 'ielts' } });
    await prisma.course.upsert({
      where: { slug: 'ielts-foundation' },
      update: { status: 'published', visibility: 'public', updatedByUserId: admin.id },
      create: {
        slug: 'ielts-foundation',
        title: 'IELTS Foundation',
        shortDescription: 'Khóa nền tảng IELTS cho học viên mới bắt đầu.',
        longDescription: 'Khóa học mẫu được tạo từ seed để admin có thể thử approvals và enrollments.',
        categoryId: ielts.id,
        status: 'published',
        visibility: 'public',
        createdByUserId: admin.id,
        publishedAt: new Date(),
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
