const MODULE_SLUG = 'nursery-vision-foundations';

const BASE_PAYLOAD = {
  moduleSlug: MODULE_SLUG,
  moduleTitle: 'Nursery Vision & Foundations',
  journey: 'Nursery',
  slides: [
    {
      id: 1,
      type: 'overview',
      title: 'Explore: Vision & Foundations',
      content:
        'Before a single wall color or crib is chosen, every nursery begins with emotion — a quiet intention that shapes how you and your baby will feel each day. This first series helps you connect your aesthetic taste to your emotional rhythm. Design becomes not just what you see, but how you feel inside the space.',
    },
    {
      id: 2,
      type: 'lecture',
      title: '🌿 Module 1: Nursery Vision & Style Finder — Where Aesthetics Meet Emotion',
      content:
        'Every nursery tells a story. The goal isn’t perfection — it’s alignment between beauty, function, and feeling.\nWhen you begin designing your baby’s space, pause before you purchase anything and ask:\n\n“What emotion do I want this room to hold?”\n\nThe nursery becomes the emotional backdrop of early parenthood — your anchor during late-night feedings, your sanctuary in transition, and your child’s earliest sensory world. Studies in environmental psychology show that harmonious visual design lowers cortisol and supports infant calm.',
    },
    {
      id: 3,
      type: 'lecture',
      title: '🌿 Module 1: Nursery Vision & Style Finder — Taylor-Made Style Archetypes',
      content:
        'We start with five core Taylor-Made Style Archetypes:\n1. **Modern – Clarity & Light** — Minimal ornamentation, open layout, natural light. These rooms reduce sensory clutter and invite stillness.\n2. **Classic – Comfort & Heritage** — Graceful symmetry, soft curves, timeless furniture. They communicate warmth, tradition, and security.\n3. **Whimsical – Story & Imagination** — Playful motifs, gentle patterns, pastel color stories. Encourages early curiosity and joy.\n4. **Minimalist – Stillness & Function** — Space to breathe; every object intentional. Simplifies care routines and creates mental spaciousness.\n5. **Luxe – Texture & Refinement** — Subtle glamour through touch: bouclé, brushed brass, matte finishes, layered neutrals.',
    },
    {
      id: 4,
      type: 'lecture',
      title: '🌿 Module 1: Nursery Vision & Style Finder — Design is Emotion',
      content:
        'Design is the visual form of emotion. When the room mirrors your emotional rhythm — calm, joyful, elegant, grounded — it nurtures both you and your baby. Alignment, not abundance, is the secret to serenity.',
    },
    {
      id: 5,
      type: 'lecture',
      title: '🎨 Module 2: Color Psychology & Emotional Influence — Designing Through Emotion',
      content:
        'Color is emotion made visible. It shapes how a space feels long before we consciously interpret it.\nFor babies, color becomes one of the earliest forms of environmental language; for parents, it subtly modulates mood, energy, and bonding.',
    },
    {
      id: 6,
      type: 'lecture',
      title: '🎨 Module 2: Color Psychology & Emotional Influence — Color Language',
      content:
        'Each hue communicates differently to the nervous system:\n• **Neutrals ( ivory, oat, greige )** ground and expand a space, acting as visual rest points.\n• **Pastels ( sage, blush, sky )** engage curiosity softly without overstimulation.\n• **Earth tones ( terracotta, sand, clay )** mimic nature’s steadiness and warmth.\n• **Cool tones ( seafoam, eucalyptus )** quiet the mind and promote rest.\n• **Warm accents ( peach, pale gold )** infuse happiness and comfort.',
    },
    {
      id: 7,
      type: 'lecture',
      title: '🎨 Module 2: Color Psychology & Emotional Influence — 60-30-10 Harmony',
      content:
        'Apply the 60-30-10 principle for harmony:\n• 60 % base (walls)\n• 30 % secondary (furniture / rug)\n• 10 % accent (art / textiles)',
    },
    {
      id: 8,
      type: 'lecture',
      title: '🎨 Module 2: Color Psychology & Emotional Influence — Light Completes Color',
      content:
        'Lighting completes the palette. Morning daylight energizes cooler tones; evening light warms and cues rest. Use warm-white bulbs (2700–3000 K) to support melatonin and infant circadian rhythm. Avoid harsh blue or fluorescent lighting near bedtime.',
    },
    {
      id: 9,
      type: 'lecture',
      title: '🎨 Module 2: Color Psychology & Emotional Influence — Serenity Through Intention',
      content:
        'Color, light, and rhythm create the emotional climate of your home — and by designing intentionally, you can make serenity visible.',
    },
    {
      id: 10,
      type: 'lecture',
      title: '🌾 Module 3: Material & Texture Palettes — Sensory Harmony Through Touch & Tone',
      content:
        'Before babies focus their eyes, they experience the world through touch. The textures you choose literally teach comfort and safety. Texture transforms a beautiful nursery into a nurturing one.',
    },
    {
      id: 11,
      type: 'lecture',
      title: '🌾 Module 3: Material & Texture Palettes — Ground the Space with Nature',
      content:
        'Ground the space with nature:\n• Wood connects the environment to organic calm; choose light oak, birch, or ash.\n• Linen & Cotton breathe, regulate temperature, and soften light.\n• Rattan & Wicker bring pattern and gentle dimension.',
    },
    {
      id: 12,
      type: 'lecture',
      title: '🌾 Module 3: Material & Texture Palettes — Layer Softness Mindfully',
      content:
        'Layer softness mindfully:\n• Bouclé & Sherpa invite coziness for gliders and rugs.\n• Velvet & Brushed Knit introduce depth and tactile luxury when used sparingly.',
    },
    {
      id: 13,
      type: 'lecture',
      title: '🌾 Module 3: Material & Texture Palettes — Balance, Safety, and Emotional Ease',
      content:
        'Balance is the key — one structured texture (wood / metal) to two soft textures (fabric / knit). The rhythm of repetition is what feels peaceful.\n\nAlways prioritize safety: choose OEKO-TEX or GREENGUARD Gold certified materials to ensure low-VOC finishes and avoid chemical off-gassing. Healthy air equals emotional ease.\n\nTexture is the lullaby of design — the unspoken reassurance that the world is soft, safe, and predictable.',
    },
    {
      id: 14,
      type: 'lecture',
      title: '🖼️ Module 4: Creating a Moodboard — From Vision to Visualization',
      content:
        'A moodboard bridges imagination and reality. It captures emotion through visuals, guiding every design decision before you invest. Without a moodboard, it’s easy to chase trends instead of cohesion.\n\nStart with emotion, not products. Ask: “What feeling do I want to live inside?” Calm? Joyful? Elegant? Playful?',
    },
    {
      id: 15,
      type: 'lecture',
      title: '🖼️ Module 4: Creating a Moodboard — Curate with Intentional Constraints',
      content:
        'Then collect imagery that evokes that emotion — textures, color swatches, furniture silhouettes, lighting inspiration. Limit to four core colors and three main textures. Less is more; constraint clarifies vision.',
    },
    {
      id: 16,
      type: 'lecture',
      title: '🖼️ Module 4: Creating a Moodboard — Compose and Communicate',
      content:
        'Compose your board with the rule of balance — one dominant hue, one supporting mid-tone, one accent color. Arrange visuals until the board feels calm to your eyes; that’s your signal you’ve found alignment.\n\nYou can build digitally (Canva, Milanote, Pinterest) for flexibility, or create a tactile corkboard with samples for sensory grounding.\n\nA moodboard is not decoration; it’s direction. It becomes your design compass and communicates clearly with mentors or designers reviewing your plan.',
    },
    {
      id: 17,
      type: 'lecture',
      title: '💎 Module 5: Budgeting While Maintaining Aesthetic Consistency — Luxury Through Intention, Not Excess',
      content:
        'Luxury in design is about cohesion, not cost. True sophistication arises when every element feels deliberate. Budgeting is the art of intention — channeling resources toward what truly enhances daily life.',
    },
    {
      id: 18,
      type: 'lecture',
      title: '💎 Module 5: Budgeting While Maintaining Aesthetic Consistency — Investment Tiers',
      content:
        'Think of design in three investment tiers:\n1. **Invest:** Crib, glider, dresser — foundational pieces used daily and long-term.\n2. **Moderate:** Lighting, rugs, shelves — medium-impact visuals that add tone and function.\n3. **Save:** Decorative accents, textiles, and seasonal elements — easily refreshed later.',
    },
    {
      id: 19,
      type: 'lecture',
      title: '💎 Module 5: Budgeting While Maintaining Aesthetic Consistency — Consistency Creates Luxury',
      content:
        'Consistency creates perceived luxury. Choose one wood tone, one metal accent, and one fabric story; this unity elevates any price range.\n\nApply the **70-30 principle** — 70% functional foundations, 30% styling. Practical comfort is the base for aesthetic joy.\n\nAllow room for a single “joy piece” — one item that makes you smile every day. That’s emotional ROI.\n\nLuxury is precision, not abundance. A room aligned in purpose and tone radiates calm far beyond its cost.',
    },
    {
      id: 20,
      type: 'journal',
      title: 'Journal Prompt: Translating Vision Into Emotion',
      content:
        'Describe the feeling you want to live inside when you walk into your baby’s room. What three words summarize your emotional goal? Calm, joyful, grounded, inspired — whatever aligns with your rhythm becomes your design north star.',
    },
    {
      id: 21,
      type: 'apply',
      title: 'Apply: From Vision to Foundation',
      content:
        "1. Identify your Style Archetype (Modern, Classic, Whimsical, Minimalist, or Luxe).\n2. Choose a base color family and secondary accent from your emotional palette.\n3. Collect 3–5 images or material samples for your moodboard.\n4. Note one ‘joy piece’ to anchor your design.\n5. Save your selections to your Academy profile for mentor review and registry sync.",
    },
  ],
};

exports.seed = async (knex) => {
  await knex.transaction(async (trx) => {
    const moduleContent = {
      journey: BASE_PAYLOAD.journey,
      slide_count: BASE_PAYLOAD.slides.length,
      summary: BASE_PAYLOAD.slides[0]?.content || '',
    };

    const existingModule = await trx('academy_modules')
      .where({ slug: BASE_PAYLOAD.moduleSlug })
      .first();

    if (existingModule) {
      await trx('academy_modules')
        .where({ id: existingModule.id })
        .update({
          title: BASE_PAYLOAD.moduleTitle,
          section: 'Vision & Foundations',
          order_index: existingModule.order_index ?? 1,
          visible_to: existingModule.visible_to || 'all',
          introduction: BASE_PAYLOAD.slides[0]?.content || existingModule.introduction,
          lecture: BASE_PAYLOAD.slides[1]?.content || existingModule.lecture,
          content: moduleContent,
          version: (existingModule.version || 1) + 1,
          updated_at: trx.fn.now(),
        });
    } else {
      await trx('academy_modules').insert({
        slug: BASE_PAYLOAD.moduleSlug,
        title: BASE_PAYLOAD.moduleTitle,
        section: 'Vision & Foundations',
        order_index: 1,
        visible_to: 'all',
        introduction: BASE_PAYLOAD.slides[0]?.content || null,
        lecture: BASE_PAYLOAD.slides[1]?.content || null,
        content: moduleContent,
        version: 1,
      });
    }

    for (const slide of BASE_PAYLOAD.slides) {
      await trx('academy_module_slides')
        .insert({
          module_slug: BASE_PAYLOAD.moduleSlug,
          module_title: BASE_PAYLOAD.moduleTitle,
          journey: BASE_PAYLOAD.journey,
          slide_number: slide.id,
          slide_type: slide.type,
          title: slide.title,
          content: slide.content,
        })
        .onConflict(['module_slug', 'slide_number'])
        .merge({
          module_title: BASE_PAYLOAD.moduleTitle,
          journey: BASE_PAYLOAD.journey,
          slide_type: slide.type,
          title: slide.title,
          content: slide.content,
          updated_at: trx.fn.now(),
        });
    }
  });
};
