import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
import { allModules } from '../../../data/allModules.js';

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

const normalizeModule = (module, index) => ({
  slug: module.slug,
  title: module.title,
  category: module.journey ?? module.category ?? null,
  summary: module.subtitle ?? module.content?.explore ?? null,
  lecture: module.content?.lecture ?? null,
  workbookPrompt: module.content?.journalPrompt ?? null,
  order: index + 1,
  content: module,
});

async function seedAcademyModules() {
  if (!Array.isArray(allModules) || allModules.length === 0) {
    console.warn('⚠️ No academy modules found to seed.');
    return;
  }

  const normalized = allModules.map((module, index) => normalizeModule(module, index));
  await prisma.academyModule.createMany({
    data: normalized,
    skipDuplicates: true,
  });
  console.log('🌸 Academy modules seeded');
}

async function main() {
  await upsertBaseUsers();
  await seedAcademyModules();
}

main()
  .then(() => {
    console.log('🌱 Base users + academy seeding complete.');
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
