import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskly.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@taskly.com',
      name: 'Super Admin',
      passwordHash: password,
      role: 'ADMIN'
    }
  });
  console.log('Admin user successfully created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
