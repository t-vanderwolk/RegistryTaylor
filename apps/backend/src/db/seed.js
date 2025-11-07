import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();



const BASE_USERS = [
  { email: 'member@me.com', role: 'MEMBER' },
  { email: 'mentor@me.com', role: 'MENTOR' },
  { email: 'admin@me.com', role: 'ADMIN' },
];

async function upsertBaseUsers() {
  for (const { email, role } of BASE_USERS) {
    const passwordHash = await bcrypt.hash('Karma', 10);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role },
      create: { email, role, passwordHash },
    });
    console.log(`✅ Ensured ${role.toLowerCase()} user (${email}) exists.`);
  }
}

async function main() {
  await upsertBaseUsers();
}

main()
  .then(() => {
    console.log('🌱 Base users seeding complete.');
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
