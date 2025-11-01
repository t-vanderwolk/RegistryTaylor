// 🌱 Taylor-Made Baby Co. — Unified MVP Seeder
const { PrismaClient, UserRole, RegistrySource } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Starting Taylor-Made Baby Co. MVP Seed...');

  // 1️⃣ USERS
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@me.com' },
      update: {},
      create: {
        id: 'admin-id',
        email: 'admin@me.com',
        name: 'Admin User',
        password: 'Karma',
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.upsert({
      where: { email: 'mentor@me.com' },
      update: {},
      create: {
        id: 'mentor-id',
        email: 'mentor@me.com',
        name: 'Mentor User',
        password: 'Karma',
        role: UserRole.MENTOR,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@me.com' },
      update: {},
      create: {
        id: 'member-id',
        email: 'user@me.com',
        name: 'Member User',
        password: 'Karma',
        role: UserRole.MEMBER,
      },
    }),
  ]);

  const [admin, mentor, member] = users;
  console.log('👤 Users created:', users.map(u => u.email));

  // 2️⃣ PROFILES
  await prisma.profile.upsert({
    where: { userId: member.id },
    update: {},
    create: {
      userId: member.id,
      dueDate: new Date('2025-12-25'),
      city: 'Scottsdale',
      state: 'AZ',
      lifestyle: 'Balanced',
      preferences: 'Modern neutral nursery, sustainable gear',
    },
  });
  console.log('💅 Profile added for member.');

  // 3️⃣ QUESTIONNAIRE
  await prisma.questionnaire.upsert({
    where: { userId: member.id },
    update: {},
    create: {
      userId: member.id,
      babyStage: 'Expecting',
      registryStatus: 'Building',
      priorities: 'Gear education, nursery setup, postpartum planning',
      conciergePriority: 'Registry planning',
    },
  });
  console.log('📝 Questionnaire seeded.');

  // 4️⃣ REGISTRY ITEMS
  await prisma.registryItem.createMany({
    data: [
      {
        id: 'registry-silver-cross-reef',
        userId: member.id,
        name: 'Silver Cross Reef Stroller',
        brand: 'Silver Cross',
        category: 'Gear',
        retailer: 'Silver Cross',
        price: 1099.99,
        imageUrl:
          'https://images.unsplash.com/photo-1617220934141-9846fd8dfeaf?auto=format&fit=crop&w=1024&q=80',
        url: 'https://silvercrossus.com/?ref=4762',
        notes: 'Convertible travel system with sustainable fabrics.',
        source: RegistrySource.INDEPENDENT,
      },
      {
        id: 'registry-hatch-rest',
        userId: member.id,
        name: 'Hatch Rest+ Night Light',
        brand: 'Hatch',
        category: 'Nursery',
        retailer: 'MacroBaby',
        price: 89,
        imageUrl:
          'https://images.unsplash.com/photo-1616627816303-9611a3043cac?auto=format&fit=crop&w=1024&q=80',
        url:
          'https://www.macrobaby.com/products/hatch-rest-plus-night-light?_j=4496818',
        notes: 'Customizable glow and sound playlists for bedtime.',
        source: RegistrySource.STATIC,
      },
    ],
    skipDuplicates: true,
  });
  console.log('🛍️ Registry items seeded.');

  // 5️⃣ ACADEMY MODULES
  const academyModules = [
    {
      id: 'academy-nursery',
      title: 'Nursery Vision & Foundations',
      description: 'Designing your dream nursery with function and flow.',
      category: 'Nursery',
      order: 1,
    },
    {
      id: 'academy-gear',
      title: 'Gear & Safety Essentials',
      description:
        'Learn about strollers, car seats, and baby gear for your lifestyle.',
      category: 'Gear',
      order: 2,
    },
    {
      id: 'academy-postpartum',
      title: 'Postpartum Wellness & Recovery',
      description: 'Holistic support for new parents—body, mind, and home.',
      category: 'Postpartum',
      order: 3,
    },
  ];

  await prisma.academyModule.createMany({
    data: academyModules,
    skipDuplicates: true,
  });
  console.log('🎓 Academy modules added.');

  // 6️⃣ BLOG POSTS
  await prisma.blogPost.createMany({
    data: [
      {
        id: 'blog-sleep-space',
        title: 'Setting Up a Safe Sleep Space',
        slug: 'safe-sleep-space',
        content:
          'Learn the essentials of safe sleep for your baby — from firm mattresses to temperature control.',
        author: 'Taylor Vanderwolk',
      },
      {
        id: 'blog-stroller-journey',
        title: 'Finding the Perfect Stroller',
        slug: 'finding-perfect-stroller',
        content:
          'How to choose a stroller that fits your lifestyle, budget, and future growth needs.',
        author: 'Taylor Vanderwolk',
      },
    ],
    skipDuplicates: true,
  });
  console.log('📰 Blog posts inserted.');

  // 7️⃣ ACADEMY PROGRESS (Demo Data)
  await prisma.academyProgress.createMany({
    data: [
      {
        id: 'progress-nursery',
        userId: member.id,
        moduleId: 'academy-nursery',
        completed: true,
        percent: 100,
      },
      {
        id: 'progress-gear',
        userId: member.id,
        moduleId: 'academy-gear',
        completed: false,
        percent: 40,
      },
    ],
    skipDuplicates: true,
  });
  console.log('📈 Academy progress demo added.');

  console.log('🌟 Taylor-Made Baby Co. seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });