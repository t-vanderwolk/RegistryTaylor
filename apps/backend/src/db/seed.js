import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import prisma from './prismaClient.js';

const USERS = [
  {
    email: 'admin@me.com',
    role: 'ADMIN',
    profile: {
      conciergePriority: 1,
      notes: 'Taylor-Made administrator account.',
    },
  },
  {
    email: 'mentor@me.com',
    role: 'MENTOR',
    profile: {
      conciergePriority: 2,
      notes: 'Lead concierge mentor for onboarding members.',
    },
  },
  {
    email: 'member@me.com',
    role: 'MEMBER',
    profile: {
      conciergePriority: 3,
      notes: 'Pilot member seeded via Prisma script.',
    },
    questionnaire: {
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      availability: 'Weeknights after 6pm ET',
      birthLocation: 'Mount Sinai West',
      supportNeeds:
        'Looking for registry guidance, mentor matching, and postpartum planning.',
      preferences: {
        birthPlan: 'Unmedicated birth with doula support',
        nurseryStyle: 'Warm neutrals with natural materials',
      },
    },
  },
];

const ACADEMY_MODULES = [
  {
    slug: 'welcome',
    title: 'Welcome to the Academy',
    summary: 'Start here to explore your Taylor-Made Baby Co. journey.',
    content: {
      sections: [
        {
          heading: 'Orientation',
          body: 'Meet your concierge team and learn how to navigate the portal.',
        },
        {
          heading: 'Next Steps',
          body: 'Schedule your kickoff call and complete the onboarding questionnaire.',
        },
      ],
    },
  },
  {
    slug: 'nursery',
    title: 'Preparing Your Nursery',
    summary: 'Guided checklists and curated product suggestions.',
    content: {
      sections: [
        {
          heading: 'Layout Planning',
          body: 'Create safe sleep zones, diaper stations, and cozy nursing nooks.',
        },
        {
          heading: 'Curated Essentials',
          body: 'Concierge-approved gear and decor for every nursery style.',
        },
      ],
    },
  },
];

const REGISTRY_ITEMS = [
  {
    name: 'Doona Infant Car Seat & Stroller',
    brand: 'Doona',
    category: 'Travel',
    price: '550.00',
    url: 'https://example.com/products/doona',
    source: 'myregistry',
    notes: 'Seamless travel system perfect for city families.',
  },
  {
    name: 'Snoo Smart Sleeper Bassinet',
    brand: 'Happiest Baby',
    category: 'Sleep',
    price: '1695.00',
    url: 'https://example.com/products/snoo',
    source: 'babylist',
    notes: 'Smart bassinet that automatically soothes newborns.',
  },
];

async function resetSchema() {
  await prisma.eventRsvp.deleteMany();
  await prisma.event.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.registryNote.deleteMany();
  await prisma.registryItem.deleteMany();
  await prisma.registryCatalogItem.deleteMany();
  await prisma.academyProgress.deleteMany();
  await prisma.workbookEntry.deleteMany();
  await prisma.academyModule.deleteMany();
  await prisma.questionnaire.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Karma', 10);

  for (const user of USERS) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        role: user.role,
      },
      create: {
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });

    await prisma.profile.upsert({
      where: { userId: upsertedUser.id },
      update: {
        conciergePriority: user.profile.conciergePriority,
        notes: user.profile.notes,
      },
      create: {
        userId: upsertedUser.id,
        conciergePriority: user.profile.conciergePriority,
        notes: user.profile.notes,
      },
    });

    if (user.questionnaire) {
      await prisma.questionnaire.upsert({
        where: { userId: upsertedUser.id },
        update: user.questionnaire,
        create: {
          userId: upsertedUser.id,
          ...user.questionnaire,
        },
      });
    }
  }

  // Link member profile to mentor user after upserts
  const mentor = await prisma.user.findUnique({
    where: { email: 'mentor@me.com' },
    select: { id: true },
  });
  const member = await prisma.user.findUnique({
    where: { email: 'member@me.com' },
    select: { id: true },
  });

  if (mentor && member) {
    await prisma.profile.updateMany({
      where: { userId: member.id },
      data: { mentorId: mentor.id },
    });
  }
}

async function seedAcademy() {
  for (const module of ACADEMY_MODULES) {
    await prisma.academyModule.upsert({
      where: { slug: module.slug },
      update: {
        title: module.title,
        summary: module.summary,
        content: module.content,
      },
      create: module,
    });
  }

  const member = await prisma.user.findUnique({
    where: { email: 'member@me.com' },
    select: { id: true },
  });

  const modules = await prisma.academyModule.findMany({
    select: { id: true, slug: true },
  });

  if (member) {
    for (const module of modules) {
      await prisma.academyProgress.upsert({
        where: {
          userId_moduleId: {
            userId: member.id,
            moduleId: module.id,
          },
        },
        update: { percent: module.slug === 'welcome' ? 80 : 20 },
        create: {
          userId: member.id,
          moduleId: module.id,
          percent: module.slug === 'welcome' ? 80 : 20,
        },
      });
    }
  }
}

async function seedRegistry() {
  const member = await prisma.user.findUnique({
    where: { email: 'member@me.com' },
    select: { id: true },
  });

  if (!member) {
    return;
  }

  for (const item of REGISTRY_ITEMS) {
    const externalId = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const price = item.price ? new Prisma.Decimal(item.price) : null;

    await prisma.registryCatalogItem.upsert({
      where: { id: externalId },
      update: {
        externalId,
        title: item.name,
        brand: item.brand ?? null,
        retailer: item.brand ?? null,
        category: item.category ?? null,
        price,
        url: item.url ?? null,
        affiliateUrl: item.url ?? null,
        source: item.source,
      },
      create: {
        id: externalId,
        externalId,
        title: item.name,
        brand: item.brand ?? null,
        retailer: item.brand ?? null,
        category: item.category ?? null,
        price,
        url: item.url ?? null,
        affiliateUrl: item.url ?? null,
        source: item.source,
      },
    });

    await prisma.registryItem.upsert({
      where: {
        externalId_userId: {
          externalId,
          userId: member.id,
        },
      },
      update: {
        name: item.name,
        brand: item.brand ?? null,
        category: item.category ?? null,
        price,
        url: item.url ?? null,
        retailer: item.brand ?? null,
        notes: item.notes ?? null,
        source: item.source,
        affiliateUrl: item.url ?? null,
        affiliateId: externalId,
        importedFrom: item.url ?? null,
        imageUrl: null,
      },
      create: {
        userId: member.id,
        name: item.name,
        brand: item.brand ?? null,
        category: item.category ?? null,
        price,
        url: item.url ?? null,
        retailer: item.brand ?? null,
        notes: item.notes ?? null,
        source: item.source,
        affiliateUrl: item.url ?? null,
        affiliateId: externalId,
        externalId,
        importedFrom: item.url ?? null,
        imageUrl: null,
      },
    });
  }
}

async function seedContent() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@me.com' },
    select: { id: true },
  });
  const mentor = await prisma.user.findUnique({
    where: { email: 'mentor@me.com' },
    select: { id: true },
  });

  if (mentor) {
    const welcomePost = await prisma.communityPost.findFirst({
      where: { title: 'Welcome to Taylor-Made Baby Co.' },
    });

    if (welcomePost) {
      await prisma.communityPost.update({
        where: { id: welcomePost.id },
        data: {
          authorId: mentor.id,
          body: 'Introduce yourself below and let us know how we can support you this trimester.',
          tags: ['welcome', 'mentorship'],
        },
      });
    } else {
      await prisma.communityPost.create({
        data: {
          authorId: mentor.id,
          title: 'Welcome to Taylor-Made Baby Co.',
          body: 'Introduce yourself below and let us know how we can support you this trimester.',
          tags: ['welcome', 'mentorship'],
        },
      });
    }
  }

  if (admin) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: 'Monthly Concierge Q&A' },
    });

    const event = existingEvent
      ? await prisma.event.update({
          where: { id: existingEvent.id },
          data: {
            createdById: admin.id,
            startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 60 * 60 * 1000),
            location: 'Virtual (Zoom)',
          },
        })
      : await prisma.event.create({
          data: {
            createdById: admin.id,
            title: 'Monthly Concierge Q&A',
            description:
              'Live session covering trimester planning, registry strategy, and member wins.',
            startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 60 * 60 * 1000),
            location: 'Virtual (Zoom)',
          },
        });

    const member = await prisma.user.findUnique({
      where: { email: 'member@me.com' },
      select: { id: true },
    });

    if (member) {
      await prisma.eventRsvp.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: member.id,
          },
        },
        update: { status: 'GOING' },
        create: {
          eventId: event.id,
          userId: member.id,
          status: 'GOING',
        },
      });
    }
  }

  await prisma.blogPost.upsert({
    where: { slug: 'supporting-modern-parents' },
    update: {
      title: 'Supporting Modern Parents with Concierge Care',
      excerpt:
        'How personalized concierge programs help families feel prepared for every milestone.',
      body: 'Full article content coming soon. Subscribe for updates.',
    },
    create: {
      slug: 'supporting-modern-parents',
      title: 'Supporting Modern Parents with Concierge Care',
      excerpt:
        'How personalized concierge programs help families feel prepared for every milestone.',
      body: 'Full article content coming soon. Subscribe for updates.',
    },
  });
}

async function main() {
  console.log('🌸 Starting Taylor-Made Baby Co. seed...');

  await resetSchema();
  await seedUsers();
  await seedAcademy();
  await seedRegistry();
  await seedContent();

  console.log('✅ Seed complete');
}

main().catch((error) => {
  console.error('❌ Seed failed', error);
  process.exit(1);
});
