import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const modules = [
  {
    title: "Vision & Foundations",
    slug: "vision-and-foundations",
    category: "Nursery",
    summary:
      "Every nursery begins with intention. This module helps parents translate emotions and lifestyle into a tangible nursery plan-balancing style, safety, and function.",
    lecture:
      "Designing a nursery isn't about perfection-it's about presence. The earliest moments with your baby happen in this space, and every texture, sound, and light level plays a subtle role in how both of you feel. From the rhythm of nighttime feeds to morning stretches, this room is a microcosm of calm, connection, and care.\n\nWe begin with your sensory goals: Do you want the nursery to feel bright and energizing, or cocoon-like and tranquil? Research in environmental psychology shows that visual simplicity and soft light help reduce overstimulation for infants while supporting parent restfulness. Even your choice of color temperature (warm 2700K light over cool daylight bulbs) can shift the tone of late-night caregiving.\n\nFinally, we connect aesthetics to function. Safety rails, furniture spacing, and easy-reach zones prevent fatigue and create flow. When intention guides layout, the result is a sanctuary that adapts with your growing family-less a Pinterest project, more a living story.",
    workbookPrompt:
      "As you picture welcoming your baby home, what three feelings do you want their first environment to reflect?",
    order: 1,
  },
  {
    title: "Atmosphere & Safety",
    slug: "atmosphere-and-safety",
    category: "Nursery",
    summary: "Beyond aesthetics-understanding how furniture supports caregiving.",
    lecture:
      "Every piece of nursery furniture tells a story about your daily rhythm. The crib becomes the stage for rest, the dresser doubles as a changing station, and the chair anchors your feedings. Selecting these items through the lens of ergonomics and comfort prevents physical strain and emotional burnout. The more intuitive the flow, the more mental energy you preserve for connection.\n\nParent ergonomics are a design priority-your back, wrists, and posture matter as much as aesthetics. Opt for a changing setup where everything is within arm's reach. The average parent performs nearly 3,000 diaper changes in the first year; shaving seconds and steps from that routine adds up to real relief.\n\nFinally, think beyond the newborn stage. Modular furniture that converts as baby grows saves space and money. A dresser that transforms into a desk or a crib that becomes a toddler bed keeps your investment meaningful. Function is style when it grows with you.",
    workbookPrompt:
      "Which safety upgrades or atmosphere shifts would immediately bring more ease into your nightly routine?",
    order: 2,
  },
  {
    title: "Stroller & Car Seat Essentials",
    slug: "stroller-and-car-seat-essentials",
    category: "Gear",
    summary:
      "Mobility equals freedom. Compare stroller builds and car-seat safety essentials so your first ride feels effortless and secure.",
    lecture:
      "Covers travel systems, lightweight, jogging, and modular frames-highlighting fold mechanisms, terrain ratings, and car-seat compatibility. Parents learn how to evaluate size, storage, and ease of use, with a focus on real lifestyle alignment.\n\nWe'll unpack the differences between travel and everyday use, showing how small decisions-like wheel material or canopy length-can dramatically change daily convenience. Safety features like five-point harnesses, brake locks, and stability ratings are explained simply and visually.\n\nWe then shift into NHTSA-backed car-seat guidance: understanding seat types, expiration rules, and installation best practices. Demonstrations highlight common errors and easy prevention steps, so you feel confident strapping in for the first drive home. By the end, you'll know how to test a correct install, avoid counterfeit listings, and advocate for safety with any caregiver or rideshare.",
    workbookPrompt:
      "Where do you imagine taking your first stroll as a family, and what gear support would make that outing feel effortless?",
    order: 3,
  },
  {
    title: "Feeding & Seating",
    slug: "feeding-and-seating",
    category: "Gear",
    summary: "Feeding is a relationship, not a task.",
    lecture:
      "Covers breastfeeding positions, pump setup, formula preparation, storage safety, and emotional health during feeding transitions.\n\nWe explore latch troubleshooting, diet considerations for lactation, and compassionate support for mixed or exclusive formula feeding.\n\nThe tone emphasizes choice and confidence: a fed baby and a calm parent are equally vital measures of success.",
    workbookPrompt:
      "How would you like feeding time to feel in your home-peaceful, supported, flexible, or routine?",
    order: 4,
  },
  {
    title: "Healing & Recovery",
    slug: "healing-and-recovery",
    category: "Postpartum",
    summary: "Recovery is not a return to the old self-it's an evolution.",
    lecture:
      "This lecture guides parents through physical recovery, body image changes, sleep deprivation cycles, and gentle movement. It introduces the 'Realistic Pre-Baby Body Map' exercise to promote awareness and self-compassion.\n\nWe discuss nutrition, hydration, and emotional wellness during healing. Gentle rebuilding practices like pelvic floor awareness and breathwork restore confidence in your body's resilience.\n\nAbove all, recovery is permission to slow down. Healing is progress, not perfection.",
    workbookPrompt:
      "List three rituals or supports you can line up now that would make your first week home feel restorative.",
    order: 5,
  },
  {
    title: "Family Adjustment",
    slug: "family-adjustment",
    category: "Postpartum",
    summary:
      "Guide partners, siblings, and support teams through the emotional shifts of welcoming a new baby.",
    lecture:
      "Postpartum is a family recalibration. We explore communication touchpoints, delegation scripts, and boundary language that keeps caregivers aligned. Build a rhythm for check-ins, plan decompression time for each adult, and create rituals that help siblings feel seen.\n\nWe also walk through postpartum mood changes-how to spot them, how to seek help, and how to normalize asking for support before crisis.\n\nYour team's emotional fluency is the strongest asset you can cultivate in the fourth trimester.",
    workbookPrompt:
      "What conversations or rituals could you start now to help everyone in your home feel supported during the first month?",
    order: 6,
  },
];

async function main() {
  for (const module of modules) {
    await prisma.academyModule.upsert({
      where: { slug: module.slug },
      update: { ...module },
      create: { ...module },
    });
  }
}

main()
  .catch((error) => {
    console.error("Failed to seed academy modules", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
