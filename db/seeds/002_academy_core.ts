import { Knex } from "knex";

type LectureSlideInteractive = {
  prompt: string;
  options: string[];
};

type LectureSlideDetail = {
  educational: string;
  interactive: LectureSlideInteractive;
  takeaway: string;
};

type LectureSlide = {
  text: string;
  detail?: LectureSlideDetail;
};

type ModuleSeed = {
  module: {
    track_slug: string;
    code: string;
    title: string;
    subtitle: string;
    order_idx: number;
    est_minutes: number;
    cover_icon: string;
  };
  content: {
    explore: string;
    lecture: { slides: LectureSlide[] };
    journal_prompt: string;
    apply: { items: Array<{ id: string; text: string }> };
  };
};

const DEFAULT_INTERACTIVE: LectureSlideInteractive = {
  prompt: "How ready do you feel to apply this insight?",
  options: ["Already practicing", "Trying this next", "Need mentor guidance"],
};

const createDetail = (
  educational: string,
  overrides: Partial<LectureSlideDetail> = {}
): LectureSlideDetail => {
  const prompt = overrides.interactive?.prompt ?? DEFAULT_INTERACTIVE.prompt;
  const options = overrides.interactive?.options ?? DEFAULT_INTERACTIVE.options;
  return {
    educational,
    interactive: {
      prompt,
      options: [...options],
    },
    takeaway:
      overrides.takeaway ??
      "Give yourself a moment to note how this insight will shape your next decision.",
  };
};

const moduleSeeds: ModuleSeed[] = [
  {
    module: {
      track_slug: "vision-foundations",
      code: "nursery-vision-style",
      title: "Nursery Vision & Style Finder",
      subtitle: "Where Aesthetics Meet Emotion",
      order_idx: 1,
      est_minutes: 35,
      cover_icon: "sparkles",
    },
    content: {
      explore:
        "Define the emotional and aesthetic foundation of your baby's space — where beauty meets emotion and function.",
      lecture: {
        slides: [
          {
            text: "Every nursery tells a story — align design with feeling, not perfection.",
            detail: createDetail("Instead of chasing trends, start with how you want the space to make you and your baby feel. Authentic emotion creates timeless design."),
          },
          {
            text: "Ask: 'What emotion do I want this room to hold?' before choosing decor.",
            detail: createDetail("Design rooted in emotion helps every object feel intentional. Choose calming cues such as gentle curves, natural fabrics, or muted tones."),
          },
          {
            text: "Harmonious design lowers cortisol and supports calm bonding.",
            detail: createDetail("Studies show visual harmony can lower stress hormones, helping both parent and baby feel more at ease during daily routines."),
          },
          {
            text: "Five style archetypes: Modern, Classic, Whimsical, Minimalist, Luxe.",
            detail: createDetail("Identify your core archetype, then layer personality through textures and accents so your nursery feels cohesive and unique."),
          },
          {
            text: "Design is the visual form of emotion — create alignment, not abundance.",
            detail: createDetail("When every element supports the same emotional tone, even simple spaces feel complete and luxurious."),
          },
        ],
      },
      journal_prompt: "What emotions or memories do I want this space to evoke each day?",
      apply: {
        items: [
          { id: "1", text: "Choose your primary style archetype." },
          { id: "2", text: "List three feeling words that describe your ideal nursery." },
          {
            id: "3",
            text: "Pin or collect 10 inspiration images that reflect those feelings.",
          },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "vision-foundations",
      code: "color-psychology",
      title: "Color Psychology & Emotional Influence",
      subtitle: "Designing Through Emotion",
      order_idx: 2,
      est_minutes: 30,
      cover_icon: "palette",
    },
    content: {
      explore:
        "Color is emotion made visible — it shapes atmosphere, energy, and calm in every space.",
      lecture: {
        slides: [
          {
            text: "Each hue communicates differently to the nervous system.",
            detail: createDetail("Soft neutrals relax the body; greens restore balance; blush tones evoke warmth and nurture."),
          },
          {
            text: "Neutrals ground and expand; pastels soothe; earth tones bring warmth.",
            detail: createDetail("Layer neutrals for timeless serenity, or use gentle color pops to highlight zones without overstimulation."),
          },
          {
            text: "Apply the 60-30-10 harmony rule for balance.",
            detail: createDetail("Use 60% dominant color, 30% secondary, and 10% accent for visual ease."),
          },
          {
            text: "Lighting completes the palette — use warm-white bulbs (2700–3000 K).",
            detail: createDetail("Color temperature shifts mood—warmer tones mimic sunset and trigger melatonin naturally."),
          },
          {
            text: "Avoid blue-tone lighting near bedtime to protect melatonin rhythms.",
            detail: createDetail("Blue light delays sleep cues; replace with amber or soft pink night illumination."),
          },
        ],
      },
      journal_prompt: "Which colors make me feel most calm and grounded?",
      apply: {
        items: [
          { id: "1", text: "Pick three core colors for your nursery palette." },
          { id: "2", text: "Test paint swatches in morning and evening light." },
          { id: "3", text: "Select bulb temperatures between 2700–3000 K." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "vision-foundations",
      code: "material-texture",
      title: "Material & Texture Palettes",
      subtitle: "Sensory Harmony Through Touch & Tone",
      order_idx: 3,
      est_minutes: 32,
      cover_icon: "layers",
    },
    content: {
      explore:
        "Before babies focus their eyes, they learn the world through touch — texture teaches comfort and safety.",
      lecture: {
        slides: [
          {
            text: "Ground the space with nature: light wood tones, linen, rattan.",
            detail: createDetail("Organic materials regulate temperature and bring a sensory calm that synthetic finishes can’t replicate."),
          },
          {
            text: "Layer two soft textures for every structured one.",
            detail: createDetail("Pair woven baskets with plush textiles for depth without clutter."),
          },
          {
            text: "Bouclé and Sherpa invite coziness; velvet adds depth when minimal.",
            detail: createDetail("Mixing matte and plush surfaces helps the nursery feel both inviting and sophisticated."),
          },
          {
            text: "Always choose OEKO-TEX or GREENGUARD Gold certified materials.",
            detail: createDetail("These certifications ensure low emissions and safer breathing environments."),
          },
          {
            text: "Healthy air equals emotional ease — avoid harsh off-gassing products.",
            detail: createDetail("Ventilate new furniture and skip heavily scented cleaners during setup."),
          },
        ],
      },
      journal_prompt: "Which textures make me feel cozy and nurtured?",
      apply: {
        items: [
          { id: "1", text: "Choose three primary textures for furniture and textiles." },
          { id: "2", text: "Verify materials have low-VOC or GREENGUARD certification." },
          {
            id: "3",
            text: "Order fabric or finish samples before purchasing.",
          },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "vision-foundations",
      code: "creating-moodboard",
      title: "Creating a Moodboard",
      subtitle: "From Vision to Visualization",
      order_idx: 4,
      est_minutes: 28,
      cover_icon: "moodboard",
    },
    content: {
      explore:
        "A moodboard bridges imagination and reality — it visualizes emotion before you invest.",
      lecture: {
        slides: [
          {
            text: "Start with emotion, not products — define how you want the space to feel.",
            detail: createDetail("When you lead with mood, the right products emerge naturally instead of forcing cohesion later."),
          },
          {
            text: "Collect imagery of colors, textures, and light that reflect that emotion.",
            detail: createDetail("Pull inspiration from nature, art, or travel memories — anything that sparks calm joy."),
          },
          {
            text: "Limit to four colors and three textures for clarity.",
            detail: createDetail("Restraint makes the board readable and helps maintain consistency during shopping."),
          },
          {
            text: "Use digital tools like Canva, Milanote, or Pinterest for flexibility.",
            detail: createDetail("These tools let you rearrange easily until the overall feeling feels balanced."),
          },
          {
            text: "When your board feels calm to your eyes, you’ve found alignment.",
            detail: createDetail("Your body’s response to the visual test confirms emotional resonance."),
          },
        ],
      },
      journal_prompt: "How do I want this room to feel when I walk in each morning?",
      apply: {
        items: [
          { id: "1", text: "Build a moodboard digitally or on corkboard." },
          { id: "2", text: "Refine to 4 colors and 3 textures." },
          { id: "3", text: "Share your board with a mentor or partner." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "vision-foundations",
      code: "budgeting-aesthetic",
      title: "Budgeting with Aesthetic Consistency",
      subtitle: "Luxury Through Intention, Not Excess",
      order_idx: 5,
      est_minutes: 34,
      cover_icon: "coins",
    },
    content: {
      explore:
        "Luxury is about cohesion, not cost — true elegance comes from intention and simplicity.",
      lecture: {
        slides: [
          {
            text: "Divide purchases into three tiers: Invest, Moderate, Save.",
            detail: createDetail("Prioritize longevity for high-touch items and let accessories flex with trends."),
          },
          {
            text: "Invest in high-use foundations (crib, glider, dresser).",
            detail: createDetail("Comfort and durability in these core pieces enhance daily wellness."),
          },
          {
            text: "Keep one wood tone, one metal accent, one main fabric story.",
            detail: createDetail("Consistency across finishes visually unifies the room and feels premium."),
          },
          {
            text: "Apply the 70-30 rule — 70% function, 30% styling.",
            detail: createDetail("Form follows function, ensuring beauty supports real-life use."),
          },
          {
            text: "Select one joy-spark piece that makes you smile daily.",
            detail: createDetail("Emotional connection turns décor into meaning, not clutter."),
          },
        ],
      },
      journal_prompt: "Which items truly enhance our daily comfort or connection?",
      apply: {
        items: [
          { id: "1", text: "List top 3 items to invest in long-term." },
          { id: "2", text: "Group decorative pieces into a save tier." },
          { id: "3", text: "Identify your single 'joy piece' for emotional ROI." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "sleep-space",
      code: "sleep-space-setup",
      title: "Choosing Sleep Space",
      subtitle: "Safe Layouts & Transition Planning",
      order_idx: 1,
      est_minutes: 28,
      cover_icon: "moon",
    },
    content: {
      explore:
        "Safe sleep begins with thoughtful space planning — every layout choice supports peace of mind.",
      lecture: {
        slides: [
          {
            text: "Follow AAP safe-sleep guidelines: firm mattress, fitted sheet, no extras.",
            detail: createDetail("Remove pillows, bumpers, and plush items — simplicity equals safety."),
          },
          {
            text: "Keep baby in parents’ room for first six months, separate surface.",
            detail: createDetail("Proximity supports bonding while reducing SIDS risk."),
          },
          {
            text: "Maintain 3 ft clearance around crib for airflow and reach.",
            detail: createDetail("This allows safe movement and prevents overheating from nearby walls."),
          },
          {
            text: "Position crib away from cords, vents, and windows.",
            detail: createDetail("These hazards can create drafts or entanglement risks."),
          },
          {
            text: "Check JPMA or ASTM certifications on all sleep gear.",
            detail: createDetail("Look for official seals ensuring tested structural integrity."),
          },
          {
            text: "Plan transitions: bassinet → crib → toddler bed.",
            detail: createDetail("Mapping milestones helps you buy once and use longer."),
          },
        ],
      },
      journal_prompt: "What helps me feel my baby sleeps safely and peacefully?",
      apply: {
        items: [
          { id: "1", text: "Sketch your nursery layout with safe zones." },
          { id: "2", text: "Confirm crib placement avoids hazards." },
          { id: "3", text: "List 3 must-have safety features." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "sleep-space",
      code: "nursery-furniture-toys",
      title: "Nursery Furniture & Toys",
      subtitle: "Longevity, Function & Developmental Fit",
      order_idx: 2,
      est_minutes: 26,
      cover_icon: "boxes",
    },
    content: {
      explore:
        "Choose furniture and play elements that balance function, safety, and early development.",
      lecture: {
        slides: [
          {
            text: "Opt for multi-use pieces: dresser + changer, convertible crib.",
            detail: createDetail("Convertible designs stretch investment over multiple stages."),
          },
          {
            text: "Favor GREENGUARD Gold or low-VOC finishes.",
            detail: createDetail("Protect indoor air from unnecessary chemical exposure."),
          },
          {
            text: "Use tip-restraint kits on tall furniture.",
            detail: createDetail("Anchoring prevents tipping accidents as mobility increases."),
          },
          {
            text: "Select toys that engage texture, contrast, and sound — not excess.",
            detail: createDetail("Minimal toy sets encourage focus and imaginative play."),
          },
          {
            text: "Rotate toys weekly to reduce clutter and overstimulation.",
            detail: createDetail("Novelty boosts curiosity without constant new purchases."),
          },
          {
            text: "Pair open shelving for beauty with bins for practicality.",
            detail: createDetail("Visible display items should match your palette for calm visuals."),
          },
        ],
      },
      journal_prompt: "Which furniture feels essential to our rhythm, and what can wait?",
      apply: {
        items: [
          { id: "1", text: "Secure heavy items to wall studs." },
          { id: "2", text: "Create a rotation bin for playtime." },
          { id: "3", text: "Check each furniture item for safety compliance." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "sleep-space",
      code: "sleep-training-routines",
      title: "Sleep Training & Adjustment",
      subtitle: "Gentle Routines & Environment Cues",
      order_idx: 3,
      est_minutes: 27,
      cover_icon: "zzz",
    },
    content: {
      explore:
        "Gentle rhythms, not rigid schedules, help your baby learn to rest and feel secure.",
      lecture: {
        slides: [
          {
            text: "Differentiate day and night cues with light and tone.",
            detail: createDetail("Bright daytime exposure sets circadian rhythm early."),
          },
          {
            text: "Keep bedtime routines predictable and short.",
            detail: createDetail("Repetition signals safety; simplicity keeps it sustainable."),
          },
          {
            text: "Avoid habits requiring constant parental help.",
            detail: createDetail("Introduce gradual independence through gentle response methods."),
          },
          {
            text: "Use consistent response patterns for reassurance.",
            detail: createDetail("Predictable reactions teach trust and confidence."),
          },
          {
            text: "Track age-appropriate wake windows.",
            detail: createDetail("Overtired babies fight sleep; match awake time to developmental stage."),
          },
          {
            text: "Stay flexible during regressions and milestones.",
            detail: createDetail("Growth spurts and travel may reset progress — that’s normal."),
          },
        ],
      },
      journal_prompt: "Which nightly ritual could calm both me and my baby?",
      apply: {
        items: [
          { id: "1", text: "Write a simple four-step bedtime routine." },
          { id: "2", text: "Dim lights 30 min before sleep." },
          { id: "3", text: "Keep a 3-day log of wake/rest times." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "sleep-space",
      code: "sound-light-safety",
      title: "Sound Machine & Lighting Safety",
      subtitle: "Supporting Restful Nights & Circadian Health",
      order_idx: 4,
      est_minutes: 24,
      cover_icon: "lightbulb",
    },
    content: {
      explore:
        "Light and sound shape early circadian cues — design them for rest, not stimulation.",
      lecture: {
        slides: [
          {
            text: "Keep sound machines 6–8 ft from crib under 50 dB.",
            detail: createDetail("Measure with an app; volume above 50 dB can impact hearing."),
          },
          {
            text: "Use red or amber night-lights instead of blue tones.",
            detail: createDetail("Red light preserves melatonin production and signals rest."),
          },
          {
            text: "Position cords and outlets safely out of reach.",
            detail: createDetail("Use cord covers and furniture anchors for added safety."),
          },
          {
            text: "Prefer filtered daylight for naps over total darkness.",
            detail: createDetail("Natural light helps maintain realistic day-night orientation."),
          },
          {
            text: "Use dimmers for gradual bedtime transitions.",
            detail: createDetail("Soft fading light gently prepares the body for rest."),
          },
          {
            text: "Confirm UL listing on all electronic gear.",
            detail: createDetail("Certified electronics reduce risk of fire or electrical issues."),
          },
        ],
      },
      journal_prompt: "How do I want the nursery to feel at night versus during the day?",
      apply: {
        items: [
          { id: "1", text: "Test sound level using a decibel app." },
          { id: "2", text: "Replace bulbs with 2700 K warm LEDs." },
          { id: "3", text: "Conceal cords safely." },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "sleep-space",
      code: "calm-care-routine",
      title: "Creating a Calm Care Routine",
      subtitle: "Wellness Station & Nighttime Reassurance",
      order_idx: 5,
      est_minutes: 23,
      cover_icon: "heart",
    },
    content: {
      explore:
        "Turn daily caregiving into ritual — organization and mindfulness bring peace to every task.",
      lecture: {
        slides: [
          {
            text: "Create separate zones: diapering, feeding, wellness.",
            detail: createDetail("Dedicated zones reduce mental load and make tasks automatic."),
          },
          {
            text: "Keep essentials within arm’s reach for safety.",
            detail: createDetail("No step away moments — setup ensures full attention on baby."),
          },
          {
            text: "Add soft music or dim light to cue calm transitions.",
            detail: createDetail("Consistent sensory signals help baby associate calm with care."),
          },
          {
            text: "Maintain predictable placement for key items.",
            detail: createDetail("Muscle memory creates speed and confidence during late nights."),
          },
          {
            text: "Prepare a nighttime basket with wipes and spare clothes.",
            detail: createDetail("Less movement equals faster recovery to sleep."),
          },
          {
            text: "Pair care actions with slow breathing to stay centered.",
            detail: createDetail("Regulating your breath regulates baby’s heartbeat and calm."),
          },
        ],
      },
      journal_prompt: "Which caregiving moments feel most chaotic, and how can I soften them?",
      apply: {
        items: [
          { id: "1", text: "Set up a night-care basket." },
          {
            id: "2",
            text: "Add one sensory cue (scent, light, or music).",
          },
          {
            id: "3",
            text: "Take one slow breath before each diaper change for a week.",
          },
        ],
      },
    },
  },
  {
    module: {
      track_slug: "atmosphere-organization",
      code: "comfort-care-stations",
      title: "Comfort & Care Stations",
      subtitle: "Atmosphere & Organization",
      order_idx: 1,
      est_minutes: 25,
      cover_icon: "hand-heart",
    },
    content: {
      explore:
        "A functional nursery flows like a quiet routine — each station anticipates comfort and wellness.",
      lecture: {
        slides: [
          {
            text: "Design diaper, feeding, and wellness areas for intuitive movement.",
            detail: createDetail("Map how you’ll move between zones so everything stays within calm reach."),
          },
          {
            text: "Use baskets or labeled drawers for clear organization.",
            detail: createDetail("Labels free up mental energy — you’ll always know where essentials live."),
          },
          {
            text: "Include gentle lighting near care zones for nighttime ease.",
            detail: createDetail("Layer dimmable lamps or sconces to avoid harsh overhead glare during night feeds."),
          },
          {
            text: "Keep a thermometer, nasal aspirator, and first-aid basics in one place.",
            detail: createDetail("Centralized wellness tools mean less searching when baby needs calm support."),
          },
          {
            text: "Balance accessibility with aesthetic calm — hide clutter, not function.",
            detail: createDetail("Closed storage keeps visuals serene while essentials remain close at hand."),
          },
          {
            text: "Restock supplies before bedtime to reduce stress.",
            detail: createDetail("A five-minute nightly reset prevents midnight disruptions and keeps routines smooth."),
          },
        ],
      },
      journal_prompt: "What systems can make care tasks feel graceful instead of rushed?",
      apply: {
        items: [
          { id: "1", text: "Map your care zones on paper or a digital layout." },
          { id: "2", text: "Create one labeled bin for each care category." },
          {
            id: "3",
            text: "Set a weekly five-minute reset to restock supplies.",
          },
        ],
      },
    },
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("community_comments").del();
  await knex("community_posts").del();
  await knex("user_progress").del();
  await knex("module_content").del();
  await knex("modules").del();
  await knex("tracks").del();
  await knex("journeys").del();

  const [journey] = await knex("journeys")
    .insert({
      slug: "nursery",
      title: "Nursery Design",
      order_idx: 1,
    })
    .returning(["id"]);

  const trackSeeds = [
    {
      journey_id: journey.id,
      slug: "vision-foundations",
      title: "Vision & Foundations",
      order_idx: 1,
    },
    {
      journey_id: journey.id,
      slug: "sleep-space",
      title: "Sleep & Space",
      order_idx: 2,
    },
    {
      journey_id: journey.id,
      slug: "atmosphere-organization",
      title: "Atmosphere & Organization",
      order_idx: 3,
    },
  ];

  const insertedTracks = await knex("tracks")
    .insert(trackSeeds)
    .returning(["id", "slug"]);

  const trackIdBySlug = new Map(insertedTracks.map((track) => [track.slug, track.id]));

  const modulesToInsert = moduleSeeds.map((seed, index) => {
    const trackId = trackIdBySlug.get(seed.module.track_slug);
    if (!trackId) {
      throw new Error(`Missing track id for slug ${seed.module.track_slug}`);
    }
    return {
      track_id: trackId,
      code: seed.module.code,
      title: seed.module.title,
      subtitle: seed.module.subtitle,
      order_idx: seed.module.order_idx ?? index + 1,
      est_minutes: seed.module.est_minutes,
      cover_icon: seed.module.cover_icon,
    };
  });

  const insertedModules = await knex("modules")
    .insert(modulesToInsert)
    .returning(["id", "code"]);

  const moduleIdByCode = new Map(insertedModules.map((module) => [module.code, module.id]));

  await knex("module_content").insert(
    moduleSeeds.map((seed) => {
      const moduleId = moduleIdByCode.get(seed.module.code);
      if (!moduleId) {
        throw new Error(`Missing module id for code ${seed.module.code}`);
      }
      return {
        module_id: moduleId,
        explore: seed.content.explore,
        lecture: seed.content.lecture,
        journal_prompt: seed.content.journal_prompt,
        apply: seed.content.apply,
      };
    })
  );

  const adminUser = await knex("users").where({ email: "Admin@me.com" }).first();

  if (adminUser) {
    const [post] = await knex("community_posts")
      .insert({
        user_id: adminUser.id,
        category: "Nursery",
        title: "Welcome to Taylor-Made Community",
        content:
          "Share a win from your design process or ask for feedback—your mentor concierge is here for you.",
        is_anonymous: false,
      })
      .returning("*");

    await knex("community_comments").insert({
      post_id: post.id,
      user_id: adminUser.id,
      content: "Use this thread to introduce yourself and tell us about your vision!",
    });
  }
}
