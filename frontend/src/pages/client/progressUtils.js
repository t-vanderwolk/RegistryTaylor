export const TOTAL_PROJECT_PHASES = 12;

export const computeTimeline = (profile) => {
  const dueDateString = profile?.due_date || null;
  if (!dueDateString) {
    return { progressPercent: 0, stageLabel: "Set due date", weeksRemaining: null, daysElapsed: 0 };
  }

  const dueDate = new Date(dueDateString);
  if (Number.isNaN(dueDate.getTime())) {
    return { progressPercent: 0, stageLabel: "Set due date", weeksRemaining: null, daysElapsed: 0 };
  }

  const today = new Date();
  const totalGestationDays = 280;
  const diffMs = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const daysElapsed = Math.min(totalGestationDays, Math.max(0, totalGestationDays - daysRemaining));
  const progressPercent = Math.min(100, Math.round((daysElapsed / totalGestationDays) * 100));
  const weeksRemaining = Math.round(daysRemaining / 7);

  let stageLabel = "First trimester";
  if (daysElapsed >= 26 * 7) stageLabel = "Third trimester";
  else if (daysElapsed >= 13 * 7) stageLabel = "Second trimester";
  if (diffMs <= 0) stageLabel = "Baby arrived";

  return { progressPercent, stageLabel, weeksRemaining, daysElapsed };
};

export const buildMilestones = (profile) => {
  const mentor = profile?.mentor_preference || "Taylor";
  const nurseryReady = Boolean(profile?.nursery_theme);
  const registryLive = Boolean(profile?.registry_url);

  return [
    {
      id: "intake",
      title: "Concierge Intake",
      detail: "Discovery call, NDA, and lifestyle questionnaire received.",
      done: Boolean(profile?.family_intro),
    },
    {
      id: "registry",
      title: "Registry Blueprint",
      detail: `Curated list shared with ${mentor} for approvals.`,
      done: registryLive,
    },
    {
      id: "nursery",
      title: "Nursery Styling",
      detail: nurseryReady
        ? "Palette locked and sourcing underway."
        : "Share inspiration so Taylor can finalize palette and sourcing.",
      done: nurseryReady,
    },
    {
      id: "celebration",
      title: "Celebration Planning",
      detail: profile?.celebration_vision
        ? "Event brief drafted—awaiting vendor confirmations."
        : "Add celebration notes in Messages to kick off vendor outreach.",
      done: Boolean(profile?.celebration_vision),
    },
  ];
};

export const buildFocusItems = (milestones) => {
  const outstanding = milestones.filter((item) => !item.done);

  if (!outstanding.length) {
    return [
      {
        id: "celebrate",
        title: "Everything is polished",
        description: "Take a moment to celebrate—your concierge team is now managing finishing touches.",
        cta: "Send Taylor a thank-you",
        link: "../messages",
      },
    ];
  }

  return outstanding.map((item) => ({
    id: `${item.id}-focus`,
    title: item.title,
    description: item.detail,
    cta: "Share update",
    link: "../messages",
  }));
};

export const recentWinPlaceholders = [
  "Registry refresh finalized",
  "Nursery install booked",
  "Shower guest list approved",
];
