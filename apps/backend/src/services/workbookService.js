const prisma = require('../db/prisma');

async function getEntriesByMember(memberId) {
  return prisma.workbookEntry.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getEntryByMemberAndModule(memberId, moduleSlug) {
  return prisma.workbookEntry.findUnique({
    where: { memberId_moduleSlug: { memberId, moduleSlug } },
  });
}

async function upsertWorkbookEntry(memberId, moduleSlug, content, shared = false) {
  const entry = await prisma.workbookEntry.upsert({
    where: { memberId_moduleSlug: { memberId, moduleSlug } },
    update: {
      content,
      shared,
    },
    create: {
      memberId,
      moduleSlug,
      content,
      shared,
    },
  });

  const moduleRecord = await prisma.academyModule.findUnique({
    where: { slug: moduleSlug },
    select: { id: true },
  });

  if (moduleRecord) {
    const now = new Date();
    const existingProgress = await prisma.academyProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: memberId,
          moduleId: moduleRecord.id,
        },
      },
    });

    const workbookPercent = 100;
    const newPercent = existingProgress ? Math.max(existingProgress.percent, workbookPercent) : workbookPercent;

    if (existingProgress) {
      await prisma.academyProgress.update({
        where: { id: existingProgress.id },
        data: {
          journalUpdatedAt: now,
          percent: newPercent,
          completed: true,
          completedAt: existingProgress.completedAt ?? now,
        },
      });
    } else {
      await prisma.academyProgress.create({
        data: {
          userId: memberId,
          moduleId: moduleRecord.id,
          percent: newPercent,
          completed: true,
          completedAt: now,
          journalUpdatedAt: now,
        },
      });
    }
  }

  return entry;
}

async function toggleShare(id, shared) {
  return prisma.workbookEntry.update({
    where: { id },
    data: { shared },
  });
}

async function getEntryById(id) {
  return prisma.workbookEntry.findUnique({
    where: { id },
  });
}

module.exports = {
  getEntriesByMember,
  getEntryByMemberAndModule,
  upsertWorkbookEntry,
  toggleShare,
  getEntryById,
};
