/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertUser({ email, role, name }) {
  const passwordHash = await bcrypt.hash('Karma', 10);
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      passwordHash,
    },
    create: {
      email,
      role,
      name,
      passwordHash,
    },
  });
}

async function seedUsers() {
  const [member, mentor, admin] = await Promise.all([
    upsertUser({ email: 'member@me.com', role: UserRole.MEMBER, name: 'Taylor Member' }),
    upsertUser({ email: 'mentor@me.com', role: UserRole.MENTOR, name: 'Avery Mentor' }),
    upsertUser({ email: 'admin@me.com', role: UserRole.ADMIN, name: 'Jordan Admin' }),
  ]);

  return { member, mentor, admin };
}

async function seedInvites({ admin, mentor }) {
  const now = new Date();
  await prisma.invite.upsert({
    where: { code: 'TMB-IA72' },
    update: {},
    create: {
      code: 'TMB-IA72',
      email: 'member@me.com',
      name: 'Taylor Member',
      role: UserRole.MEMBER,
      createdById: mentor.id,
      acceptedById: admin.id,
      acceptedAt: now,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'TMB-ME21' },
    update: {},
    create: {
      code: 'TMB-ME21',
      email: 'mentor@me.com',
      name: 'Avery Mentor',
      role: UserRole.MENTOR,
      createdById: admin.id,
      acceptedById: mentor.id,
      acceptedAt: now,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'TMB-AD11' },
    update: {},
    create: {
      code: 'TMB-AD11',
      email: 'admin@me.com',
      name: 'Jordan Admin',
      role: UserRole.ADMIN,
      createdById: admin.id,
      acceptedAt: now,
      acceptedById: admin.id,
    },
  });
}

async function seedAcademyModules() {
  const modules = [
    {
      slug: 'nursery-atmosphere',
      title: 'Nursery Atmosphere Atelier',
      subtitle: 'Craft a calming sanctuary',
      journey: 'Nursery',
      estimatedMinutes: 35,
      heroImage: 'https://images.unsplash.com/photo-1520186994231-6ea0019dce5b?auto=format&fit=crop&w=1200&q=80',
      content: {
        explore: 'Discover the sensory design blueprint.',
        lecture: 'Video walkthrough with Taylor.',
        journalPrompt: 'How do you want the nursery to feel at 2 AM?',
        apply: ['List sensory cues', 'Add lighting plan to registry', 'Share inspo with mentor'],
      },
    },
    {
      slug: 'gear-confidence',
      title: 'Gear Confidence Lab',
      subtitle: 'Navigate strollers, seats, and more',
      journey: 'Gear',
      estimatedMinutes: 28,
      heroImage: 'https://images.unsplash.com/photo-1616594039964-639bf67f770f?auto=format&fit=crop&w=1200&q=80',
      content: {
        explore: 'Break down the stroller matrix.',
        lecture: 'Mentor round-table on everyday gear.',
        journalPrompt: 'Describe your ideal travel day with baby.',
        apply: ['Compare top three combos', 'Save MacroBaby links', 'Schedule concierge chat'],
      },
    },
    {
      slug: 'fourth-trimester-care',
      title: 'Fourth Trimester Rituals',
      subtitle: 'Sustain postpartum support',
      journey: 'Postpartum',
      estimatedMinutes: 24,
      heroImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      content: {
        explore: 'Define rituals for recovery.',
        lecture: 'Doula-led breathing and grounding session.',
        journalPrompt: 'What support do you need each morning?',
        apply: ['Assemble care cart', 'Line up nourishment plan', 'Invite mentor to accountability'],
      },
    },
  ];

  await Promise.all(
    modules.map((module) =>
      prisma.academyModule.upsert({
        where: { slug: module.slug },
        update: {
          title: module.title,
          subtitle: module.subtitle,
          journey: module.journey,
          estimatedMinutes: module.estimatedMinutes,
          heroImage: module.heroImage,
          content: module.content,
        },
        create: module,
      })
    )
  );
}

async function seedRegistryItems() {
  const items = [
    {
      id: 'item-nursery-glider',
      name: 'Lalo Kallie Glider',
      brand: 'Lalo',
      price: 1195,
      category: 'Nursery Atmosphere',
      imageUrl: 'https://images.unsplash.com/photo-1616628182507-196d5f62f662?auto=format&fit=crop&w=800&q=80',
      retailer: 'MacroBaby',
      url: 'https://www.macrobaby.com/products/lalo-kallie-glider',
      notes: 'Support midnight feeds with an ultra-calm glide and stain-resistant fabric.',
    },
    {
      id: 'item-nuna-trvl',
      name: 'Nuna TRVL LX Travel System',
      brand: 'Nuna',
      price: 899,
      category: 'Gear Confidence',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      retailer: 'MacroBaby',
      url: 'https://www.macrobaby.com/products/nuna-trvl-lx-travel-system',
      notes: 'Featherweight stroller + PIPA car seat pairing for effortless city movement.',
    },
    {
      id: 'item-hatch-rest',
      name: 'Hatch Rest+ Night Light',
      brand: 'Hatch',
      price: 89,
      category: 'Nursery Atmosphere',
      imageUrl: 'https://images.unsplash.com/photo-1616627816303-9611a3043cac?auto=format&fit=crop&w=800&q=80',
      retailer: 'MacroBaby',
      url: 'https://www.macrobaby.com/products/hatch-rest-plus-night-light',
      notes: 'Customizable glow and sound playlists keep bedtime serene for the whole family.',
    },
  ];

  await Promise.all(
    items.map((item) =>
      prisma.registryItem.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      })
    )
  );
}

async function seedCommunity({ mentor }) {
  await prisma.communityPost.createMany({
    data: [
      {
        id: 'post-nursery-design',
        authorId: mentor.id,
        title: 'Nursery mood board swap',
        body: 'Share your color story, and I will spotlight a member mood board Friday.',
        tags: ['nursery', 'design'],
        isAnnouncement: false,
      },
      {
        id: 'announcement-concierge',
        authorId: mentor.id,
        title: 'Concierge office hours',
        body: 'Join us Tuesday at 11 AM ET for open Q&A with the concierge team.',
        tags: ['concierge'],
        isAnnouncement: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.event.createMany({
    data: [
      {
        id: 'event-salon',
        title: 'Mentor salon · Week 18',
        description: 'Live concierge Q&A with nursery stylist Mia & registry strategist Jordan.',
        startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        location: 'Virtual · Gather Studio',
        createdById: mentor.id,
      },
      {
        id: 'event-design-lab',
        title: 'Design lab · Custom nursery palette',
        description: 'Swap palettes, shop links, and meet our featured member mood board.',
        startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        location: 'Virtual · Design Studio',
        createdById: mentor.id,
      },
    ],
    skipDuplicates: true,
  });
}

async function seedWorkbookEntries({ member }) {
  await prisma.workbookEntry.upsert({
    where: {
      memberId_moduleSlug: {
        memberId: member.id,
        moduleSlug: 'nursery-vision',
      },
    },
    update: {},
    create: {
      memberId: member.id,
      moduleSlug: 'nursery-vision',
      shared: false,
      content: {
        text: 'Our ideal nursery feels calm and natural.',
      },
    },
  });
}

async function main() {
  const { member, mentor, admin } = await seedUsers();
  await seedInvites({ admin, mentor });
  await seedAcademyModules();
  await seedRegistryItems();
  await seedCommunity({ mentor });
  await seedWorkbookEntries({ member });

  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Designing a Calming Nursery',
        slug: 'designing-a-calming-nursery',
        excerpt: 'Tips to create a peaceful, cozy nursery environment.',
        content:
          'Soft hues, natural textures, and intentional minimalism form the foundation of a nurturing nursery.',
        author: 'Taylor-Made Baby Co.',
        imageUrl: '/images/nursery-calm.jpg',
      },
      {
        title: 'Choosing the Right Stroller for Your Lifestyle',
        slug: 'choosing-the-right-stroller',
        excerpt: 'Urban, suburban, or travel-friendly? Here’s how to decide.',
        content:
          'From lightweight frames to modular travel systems, each family’s routine defines their perfect match.',
        author: 'Taylor-Made Baby Co.',
        imageUrl: '/images/stroller-guide.jpg',
      },
      {
        title: 'Registry Must-Haves for New Parents',
        slug: 'registry-must-haves',
        excerpt: 'Our curated picks that balance beauty, function, and safety.',
        content:
          'From nursery essentials to postpartum care, these items anchor your registry in practicality and calm luxury.',
        author: 'Taylor-Made Baby Co.',
        imageUrl: '/images/registry-essentials.jpg',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.invite.upsert({
    where: { code: 'DEMO-INVITE-001' },
    update: {},
    create: {
      code: 'DEMO-INVITE-001',
      email: 'demo@taylormadebaby.co',
      role: UserRole.MEMBER,
    },
  });

  await prisma.profile.upsert({
    where: { userId: member.id },
    update: {},
    create: {
      userId: member.id,
      preferredName: 'Taylor',
      pronouns: 'she/her',
      timezone: 'America/New_York',
      mentorId: mentor.id,
      conciergePriority: 'Registry planning',
    },
  });

  await prisma.questionnaire.upsert({
    where: { userId: member.id },
    update: {
      journeys: ['Nursery atmosphere', 'Gear confidence'],
      contactPreference: 'Email + dashboard',
      availability: 'Evenings',
    },
    create: {
      userId: member.id,
      journeys: ['Nursery atmosphere', 'Gear confidence'],
      contactPreference: 'Email + dashboard',
      availability: 'Evenings',
    },
  });

  console.info('✅ Seed data ready for Taylor-Made backend.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
