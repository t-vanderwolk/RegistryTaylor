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
    slug: "vision-and-foundations",
    title: "Vision & Foundations",
    category: "Nursery",
    summary:
      "Every nursery begins with intention. This module helps parents translate emotions and lifestyle into a tangible nursery plan-balancing style, safety, and function.",
    lecture:
      "Designing a nursery isn't about perfection-it's about presence. The earliest moments with your baby happen in this space, and every texture, sound, and light level plays a subtle role in how both of you feel. From the rhythm of nighttime feeds to morning stretches, this room is a microcosm of calm, connection, and care.\n\nWe begin with your sensory goals: Do you want the nursery to feel bright and energizing, or cocoon-like and tranquil? Research in environmental psychology shows that visual simplicity and soft light help reduce overstimulation for infants while supporting parent restfulness. Even your choice of color temperature (warm 2700K light over cool daylight bulbs) can shift the tone of late-night caregiving.\n\nFinally, we connect aesthetics to function. Safety rails, furniture spacing, and easy-reach zones prevent fatigue and create flow. When intention guides layout, the result is a sanctuary that adapts with your growing family-less a Pinterest project, more a living story.",
    workbookPrompt:
      "As you picture welcoming your baby home, what three feelings do you want their first environment to reflect?",
    order: 1,
    content: {
      meta: {
        subtitle: "Transform intentions into a serene space for baby and caregiver",
        journey: "Nursery",
        category: "Nursery",
        registryFocus: "Nursery Essentials",
        estimatedMinutes: 35,
        accentColor: "#EAC9D1",
        heroImage: "/images/academy/nursery-vision.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight:
        "Every nursery begins with intention. This module helps parents translate emotions and lifestyle into a tangible nursery plan-balancing style, safety, and function.",
      lecture:
        "Designing a nursery isn't about perfection-it's about presence. The earliest moments with your baby happen in this space, and every texture, sound, and light level plays a subtle role in how both of you feel. From the rhythm of nighttime feeds to morning stretches, this room is a microcosm of calm, connection, and care.\n\nWe begin with your sensory goals: Do you want the nursery to feel bright and energizing, or cocoon-like and tranquil? Research in environmental psychology shows that visual simplicity and soft light help reduce overstimulation for infants while supporting parent restfulness. Even your choice of color temperature (warm 2700K light over cool daylight bulbs) can shift the tone of late-night caregiving.\n\nFinally, we connect aesthetics to function. Safety rails, furniture spacing, and easy-reach zones prevent fatigue and create flow. When intention guides layout, the result is a sanctuary that adapts with your growing family-less a Pinterest project, more a living story.",
      journalPrompt:
        "As you picture welcoming your baby home, what three feelings do you want their first environment to reflect?",
      apply: [
        "Pin three inspiration rooms to your Pinterest Moodboard.",
        "Add a sound machine, humidifier, and monitor to your registry via the Dynamic Registry.",
        "Complete your Vision Board section and share with your mentor for review.",
      ],
      workbook: [
        {
          id: "vision-and-foundations-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Pin three inspiration rooms to your Pinterest Moodboard.",
            "Add a sound machine, humidifier, and monitor to your registry via the Dynamic Registry.",
            "Complete your Vision Board section and share with your mentor for review.",
          ],
        },
        {
          id: "vision-and-foundations-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "As you picture welcoming your baby home, what three feelings do you want their first environment to reflect?",
        },
        {
          id: "vision-and-foundations-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
        },
      ],
    },
  },
  {
    slug: "atmosphere-and-safety",
    title: "Atmosphere & Safety",
    category: "Nursery",
    summary: "Beyond aesthetics-understanding how furniture supports caregiving.",
    lecture:
      "Every piece of nursery furniture tells a story about your daily rhythm. The crib becomes the stage for rest, the dresser doubles as a changing station, and the chair anchors your feedings. Selecting these items through the lens of ergonomics and comfort prevents physical strain and emotional burnout. The more intuitive the flow, the more mental energy you preserve for connection.\n\nParent ergonomics are a design priority-your back, wrists, and posture matter as much as aesthetics. Opt for a changing setup where everything is within arm's reach. The average parent performs nearly 3,000 diaper changes in the first year; shaving seconds and steps from that routine adds up to real relief.\n\nFinally, think beyond the newborn stage. Modular furniture that converts as baby grows saves space and money. A dresser that transforms into a desk or a crib that becomes a toddler bed keeps your investment meaningful. Function is style when it grows with you.",
    workbookPrompt:
      "Which nursery item do you imagine yourself using most in those first few weeks-and what moments do you picture happening there?",
    order: 2,
    content: {
      meta: {
        subtitle: "Design with ergonomics and rhythm in mind",
        journey: "Nursery",
        category: "Nursery",
        registryFocus: "Furniture & Setup",
        estimatedMinutes: 30,
        accentColor: "#C8A1B4",
        heroImage: "/images/academy/nursery-vision.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight: "Beyond aesthetics-understanding how furniture supports caregiving.",
      lecture:
        "Every piece of nursery furniture tells a story about your daily rhythm. The crib becomes the stage for rest, the dresser doubles as a changing station, and the chair anchors your feedings. Selecting these items through the lens of ergonomics and comfort prevents physical strain and emotional burnout. The more intuitive the flow, the more mental energy you preserve for connection.\n\nParent ergonomics are a design priority-your back, wrists, and posture matter as much as aesthetics. Opt for a changing setup where everything is within arm's reach. The average parent performs nearly 3,000 diaper changes in the first year; shaving seconds and steps from that routine adds up to real relief.\n\nFinally, think beyond the newborn stage. Modular furniture that converts as baby grows saves space and money. A dresser that transforms into a desk or a crib that becomes a toddler bed keeps your investment meaningful. Function is style when it grows with you.",
      journalPrompt:
        "Which nursery item do you imagine yourself using most in those first few weeks-and what moments do you picture happening there?",
      apply: [
        "Sketch or upload a photo of your room layout.",
        "Add crib and glider options from MacroBaby feed.",
        "Check your mentor's ergonomics checklist.",
      ],
      workbook: [
        {
          id: "atmosphere-and-safety-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Sketch or upload a photo of your room layout.",
            "Add crib and glider options from MacroBaby feed.",
            "Check your mentor's ergonomics checklist.",
          ],
        },
        {
          id: "atmosphere-and-safety-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "Which nursery item do you imagine yourself using most in those first few weeks-and what moments do you picture happening there?",
        },
        {
          id: "atmosphere-and-safety-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
        },
      ],
    },
  },
  {
    slug: "stroller-and-car-seat-essentials",
    title: "Stroller & Car Seat Essentials",
    category: "Gear",
    summary:
      "Mobility equals freedom. In this masterclass, we demystify stroller categories so families can shop with confidence.",
    lecture:
      "Covers travel systems, lightweight, jogging, and modular frames-highlighting fold mechanisms, terrain ratings, and car-seat compatibility. Parents learn how to evaluate size, storage, and ease of use, with a focus on real lifestyle alignment.\n\nWe'll unpack the differences between travel and everyday use, showing how small decisions-like wheel material or canopy length-can dramatically change daily convenience. Safety features like five-point harnesses, brake locks, and stability ratings are explained simply and visually.\n\nErgonomics, storage, and folding demos round out the experience, with mentor insights and MacroBaby affiliate products linked for immediate registry integration.",
    workbookPrompt:
      "Where do you imagine strolling with your baby for the first time-around your neighborhood, a favorite park, or a family trip?",
    order: 3,
    content: {
      meta: {
        subtitle: "Match the perfect stroller to your family's rhythm",
        journey: "Gear",
        category: "Gear",
        registryFocus: "Gear Foundations",
        estimatedMinutes: 28,
        accentColor: "#C8A1B4",
        heroImage: "/images/academy/gear-stroller.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight:
        "Mobility equals freedom. In this masterclass, we demystify stroller categories so families can shop with confidence.",
      lecture:
        "Covers travel systems, lightweight, jogging, and modular frames-highlighting fold mechanisms, terrain ratings, and car-seat compatibility. Parents learn how to evaluate size, storage, and ease of use, with a focus on real lifestyle alignment.\n\nWe'll unpack the differences between travel and everyday use, showing how small decisions-like wheel material or canopy length-can dramatically change daily convenience. Safety features like five-point harnesses, brake locks, and stability ratings are explained simply and visually.\n\nErgonomics, storage, and folding demos round out the experience, with mentor insights and MacroBaby affiliate products linked for immediate registry integration.",
      journalPrompt:
        "Where do you imagine strolling with your baby for the first time-around your neighborhood, a favorite park, or a family trip?",
      apply: [
        "Complete the Lifestyle Fit Quiz inside the module.",
        "Add your top stroller pick from MacroBaby Affiliate Feed (ID 4496818) to your registry.",
        "Schedule a mentor review for car-seat compatibility.",
      ],
      workbook: [
        {
          id: "stroller-and-car-seat-essentials-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Complete the Lifestyle Fit Quiz inside the module.",
            "Add your top stroller pick from MacroBaby Affiliate Feed (ID 4496818) to your registry.",
            "Schedule a mentor review for car-seat compatibility.",
          ],
        },
        {
          id: "stroller-and-car-seat-essentials-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "Where do you imagine strolling with your baby for the first time-around your neighborhood, a favorite park, or a family trip?",
        },
        {
          id: "stroller-and-car-seat-essentials-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
        },
      ],
    },
  },
  {
    slug: "feeding-and-seating",
    title: "Feeding & Seating",
    category: "Gear",
    summary:
      "Guide partners, siblings, and support teams through the emotional shifts of welcoming a new baby.",
    lecture:
      "Postpartum is a family recalibration. We explore communication touchpoints, delegation scripts, and boundary language that keeps caregivers aligned. Build a rhythm for check-ins, plan decompression time for each adult, and create rituals that help siblings feel seen.\n\nWe also walk through postpartum mood changes-how to spot them, how to seek help, and how to normalize asking for support before crisis.\n\nYour team's emotional fluency is the strongest asset you can cultivate in the fourth trimester.",
    workbookPrompt:
      "What conversations or rituals could you start now to help everyone in your home feel supported during the first month?",
    order: 4,
    content: {
      meta: {
        subtitle: "Build confidence in your family's feeding rhythm-whatever it looks like",
        journey: "Gear",
        category: "Gear",
        registryFocus: "Feeding Essentials",
        estimatedMinutes: 32,
        accentColor: "#C8A1B4",
        heroImage: "/images/academy/postpartum-feeding.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight: "Feeding is a relationship, not a task.",
      lecture:
        "Covers breastfeeding positions, pump setup, formula preparation, storage safety, and emotional health during feeding transitions.\n\nWe explore latch troubleshooting, diet considerations for lactation, and compassionate support for mixed or exclusive formula feeding.\n\nThe tone emphasizes choice and confidence: a fed baby and a calm parent are equally vital measures of success.",
      journalPrompt:
        "How would you like feeding time to feel in your home-peaceful, supported, flexible, or routine?",
      apply: [
        "Add nursing and pumping accessories to your registry.",
        "Save a lactation consultant contact.",
        "Write a personal affirmation for feeding days.",
      ],
      workbook: [
        {
          id: "feeding-and-seating-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Add nursing and pumping accessories to your registry.",
            "Save a lactation consultant contact.",
            "Write a personal affirmation for feeding days.",
          ],
        },
        {
          id: "feeding-and-seating-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "How would you like feeding time to feel in your home-peaceful, supported, flexible, or routine?",
        },
        {
          id: "feeding-and-seating-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
        },
      ],
    },
  },
  {
    slug: "healing-and-recovery",
    title: "Healing & Recovery",
    category: "Postpartum",
    summary: "Recovery is not a return to the old self-it's an evolution.",
    lecture:
      "This lecture guides parents through physical recovery, body image changes, sleep deprivation cycles, and gentle movement. It introduces the 'Realistic Pre-Baby Body Map' exercise to promote awareness and self-compassion.\n\nWe discuss nutrition, hydration, and emotional wellness during healing. Gentle rebuilding practices like pelvic floor awareness and breathwork restore confidence in your body's resilience.\n\nAbove all, recovery is permission to slow down. Healing is progress, not perfection.",
    workbookPrompt:
      "What are three things you can set up now to make your first week home feel restful and supported?",
    order: 5,
    content: {
      meta: {
        subtitle: "Honor your body's healing timeline with nurturing rituals",
        journey: "Postpartum",
        category: "Postpartum",
        registryFocus: "Fourth Trimester Support",
        estimatedMinutes: 26,
        accentColor: "#FFFAF8",
        heroImage: "/images/academy/postpartum-rest.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight: "Recovery is not a return to the old self-it's an evolution.",
      lecture:
        "This lecture guides parents through physical recovery, body image changes, sleep deprivation cycles, and gentle movement. It introduces the 'Realistic Pre-Baby Body Map' exercise to promote awareness and self-compassion.\n\nWe discuss nutrition, hydration, and emotional wellness during healing. Gentle rebuilding practices like pelvic floor awareness and breathwork restore confidence in your body's resilience.\n\nAbove all, recovery is permission to slow down. Healing is progress, not perfection.",
      journalPrompt:
        "What are three things you can set up now to make your first week home feel restful and supported?",
      apply: [
        "Add postpartum recovery essentials (robe, peri-bottle, support pillow) to registry.",
        "Save your Rest Routine checklist.",
        "Review mentor video 'Healing at Home.'",
      ],
      workbook: [
        {
          id: "healing-and-recovery-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Add postpartum recovery essentials (robe, peri-bottle, support pillow) to registry.",
            "Save your Rest Routine checklist.",
            "Review mentor video 'Healing at Home.'",
          ],
        },
        {
          id: "healing-and-recovery-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "What are three things you can set up now to make your first week home feel restful and supported?",
        },
        {
          id: "healing-and-recovery-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
        },
      ],
    },
  },
  {
    slug: "family-adjustment",
    title: "Family Adjustment",
    category: "Postpartum",
    summary: "Feeding is a relationship, not a task.",
    lecture:
      "Covers breastfeeding positions, pump setup, formula preparation, storage safety, and emotional health during feeding transitions.\n\nWe explore latch troubleshooting, diet considerations for lactation, and compassionate support for mixed or exclusive formula feeding.\n\nThe tone emphasizes choice and confidence: a fed baby and a calm parent are equally vital measures of success.",
    workbookPrompt:
      "How would you like feeding time to feel in your home-peaceful, supported, flexible, or routine?",
    order: 6,
    content: {
      meta: {
        subtitle: "Create shared rhythms for the fourth trimester",
        journey: "Postpartum",
        category: "Postpartum",
        registryFocus: "Support Network",
        estimatedMinutes: 28,
        accentColor: "#FFFAF8",
        heroImage: "/images/academy/postpartum-rest.jpg",
        background: "#FFFAF8",
        border: "#E8E3E1",
        text: "#3E2F35",
      },
      insight:
        "Support is a shared language—when everyone feels seen, your home stays grounded.",
      lecture:
        "Postpartum is a family recalibration. We explore communication touchpoints, delegation scripts, and boundary language that keeps caregivers aligned. Build a rhythm for check-ins, plan decompression time for each adult, and create rituals that help siblings feel seen.\n\nWe also walk through postpartum mood changes-how to spot them, how to seek help, and how to normalize asking for support before crisis.\n\nYour team's emotional fluency is the strongest asset you can cultivate in the fourth trimester.",
      journalPrompt:
        "What conversations or rituals could you start now to help everyone in your home feel supported during the first month?",
      apply: [
        "Schedule a weekly partner check-in and outline topics in advance.",
        "Draft your support call list with mentors, family, and professionals.",
        "Plan a sibling or grandparent welcome ritual for baby's first week home.",
      ],
      workbook: [
        {
          id: "family-adjustment-apply",
          type: "checklist",
          title: "Apply this week",
          items: [
            "Outline a weekly family alignment ritual (or partner pause).",
            "List three people you can reach out to for hands-on support.",
            "Choose one shared tradition to begin in baby's first month.",
          ],
        },
        {
          id: "family-adjustment-reflection",
          type: "reflection",
          title: "Reflection",
          prompt:
            "What conversations or rituals could you start now to help everyone in your home feel supported during the first month?",
        },
        {
          id: "family-adjustment-submit",
          type: "submit",
          title: "Save workbook",
          ctaLabel: "Save workbook",
          ctaDescription: "Save your workbook so your mentor can tailor next steps.",
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
        category: module.category,
        summary: module.summary,
        lecture: module.lecture,
        workbookPrompt: module.workbookPrompt,
        order: module.order,
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
