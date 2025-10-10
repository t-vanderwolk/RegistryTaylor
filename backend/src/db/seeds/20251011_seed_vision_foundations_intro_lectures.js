exports.seed = async (knex) => {
  const modules = [
    {
      title: 'Nursery Vision & Style Finder',
      section: 'Vision & Foundations',
      order_index: 1,
      visible_to: 'all',
      introduction: `Welcome to the foundation of your nursery journey -- the space where aesthetics and emotion meet.
Before selecting furniture or paint, take a deep breath and imagine how you want this room to feel. The
nursery isn't just decor -- it's your baby's first environment of trust and your emotional anchor
throughout early parenthood. Studies in environmental psychology show that visually harmonious
rooms lower parental stress hormones and promote infant calm by association. In this module, we
explore how to define your personal style and connect it to the emotional tone you want to cultivate.
When you align your aesthetic with your family's rhythm, the nursery becomes an extension of your
heart -- not just a room.`,
      lecture: `Every nursery tells a story. The goal isn't perfection -- it's alignment: between beauty, function, and
feeling. We begin with the five core Taylor-Made style archetypes, each designed around emotional
experience:
1. Modern - Clarity and Light: Minimal ornamentation, open layouts, and functional design. These rooms reduce sensory clutter and invite breathing space. Pair natural wood with matte finishes, and add contrast through soft textiles.
2. Classic - Comfort and Heritage: Graceful lines, symmetry, and timeless furniture convey security. Add warmth with creams, beiges, and touches of antique detail.
3. Whimsical - Story and Imagination: Gentle patterns, pastels, and creative themes inspire curiosity. Used wisely, whimsy supports early visual tracking and storytelling.
4. Minimalist - Stillness and Function: Empty space is intentional. It allows light, movement, and breath. A minimalist nursery feels peaceful because every item has purpose.
5. Luxe - Texture and Refinement: Luxe design is defined by touch, not excess. Layer boucle, linen, and metallic accents sparingly to evoke understated elegance.
"Design is the visual form of emotion." -- Taylor Vanderwolk
Through this exploration, parents uncover their emotional blueprint. When you know how you want the nursery to feel, every design choice -- from layout to lighting -- flows intuitively.`,
      content: {
        explore: 'Predictable, uncluttered spaces lower stress...',
        reflect: ['What elements feel peaceful?'],
        apply: ['Simplify one area'],
        journal_prompt:
          'When I picture myself in the finished nursery, I hope it makes me feel ______.',
      },
    },
    {
      title: 'Color Psychology & Emotional Influence',
      section: 'Vision & Foundations',
      order_index: 2,
      visible_to: 'all',
      introduction: `Color is emotion made visible. It's one of the first sensory cues a baby perceives and one of the
strongest influences on mood. Infants begin to see color distinctions around four months. By six
months, they start forming emotional associations with those tones. Color isn't superficial -- it's
neurobiological. A soft, balanced palette can soothe both baby and parent, while jarring or saturated
hues can overstimulate. This module blends science and artistry to help you use color intentionally --
creating a visual rhythm that nurtures calm, connection, and rest.`,
      lecture: `Think of color as an invisible guide to emotion. Each hue speaks differently to the nervous system.
Neutrals (ivory, greige, oat) ground and center the room. They act as visual rest points for the eye and
help expand space. Pastels (blush, sage, sky blue) gently engage curiosity without overwhelm. Earth
Tones (clay, terracotta, taupe) mimic nature's stability and foster warmth. Cool Tones (mist, eucalyptus,
seafoam) reduce stress and support sleep. Warm Accents (sand, gold, peach) spark happiness and
comfort. The 60-30-10 principle creates harmony:
- 60% dominant base (walls)
- 30% supportive tone (furniture or rug)
- 10% accent (art, pillows, textiles)
Lighting transforms color. Morning light cools tones and energizes; evening light warms and signals
rest. Warm-white bulbs (2700K-3000K) support melatonin production and infant circadian rhythm.
Avoid fluorescent or bright blue light near bedtime -- it triggers wakefulness.
"Color, light, and rhythm form the emotional climate of a home." -- Dr. Eva Heller`,
      content: {
        explore: 'Color activates the limbic system...',
        reflect: ['Which hues calm me?'],
        apply: ['Pick 3 base hues'],
        journal_prompt:
          'As I plan the nursery, the color that calms me most is ______.',
      },
    },
    {
      title: 'Material & Texture Palettes',
      section: 'Vision & Foundations',
      order_index: 3,
      visible_to: 'all',
      introduction: `Long before babies see detail, they feel it. Texture is their first experience of design -- the tactile
language of comfort and trust. This module focuses on how material choices influence emotion,
development, and even environmental health. By layering natural and tactile elements, you create a
nursery that doesn't just look safe -- it feels safe.`,
      lecture: `Texture gives a nursery its emotional depth. Each surface carries an unspoken cue about warmth,
security, and rhythm. Wood grounds the space and connects to nature. Choose light oak, ash, or birch
to reflect softness. Linen & Cotton are breathable, natural fibers that regulate temperature and absorb
excess light. Rattan & Wicker introduce pattern and dimension. Bouclé & Sherpa soothe and add plush
comfort. Velvet & Brushed Knit provide luxury and depth when used sparingly. Choose materials
certified OEKO-TEX or GREENGUARD Gold to ensure non-toxic finishes. Avoid synthetic glues,
vinyl, and chemical treatments that release VOCs.
"Texture is the lullaby of design -- it teaches comfort through repetition."
Balance one structured texture (wood, metal) with two soft ones (fabric, knit). Your goal is not
maximalism but rhythmic variation -- an environment where touch invites peace.`,
      content: {
        explore: 'Touch is the first sense...',
        reflect: ['Which textures soothe me?'],
        apply: ['Layer wood + linen + bouclé'],
        journal_prompt:
          'When I touch soft materials like ______, I feel prepared to nurture.',
      },
    },
    {
      title: 'Creating a Moodboard',
      section: 'Vision & Foundations',
      order_index: 4,
      visible_to: 'all',
      introduction: `Before you can bring a nursery to life, you must see it -- not just in your mind, but in form and flow. A
moodboard bridges imagination and reality, capturing emotion in visual harmony. This exercise helps
you clarify style and prevent design fatigue. It's where heart meets process.`,
      lecture: `A well-curated moodboard organizes inspiration into intention. It's your design story told in color,
texture, and imagery.
Step 1: Define the Emotion -- calm, joy, wonder, or elegance.
Step 2: Select Core Imagery -- collect photos that evoke your chosen feeling.
Step 3: Choose a Palette -- limit to four core colors and three textures.
Step 4: Compose Intentionally -- one dominant hue, one mid-tone, one accent.
Step 5: Refine & Reflect -- remove visual noise until the board feels peaceful.
Digital tools (Canva, Milanote) allow flexibility and mentor review. Physical boards activate tactile
awareness.
"A moodboard is not decoration; it's the architecture of emotion."
Your completed board becomes a roadmap -- guiding every purchase and ensuring harmony between
vision and emotion.`,
      content: {
        explore: 'Moodboards translate feeling to form...',
        reflect: ['Which visuals repeat the same emotion?'],
        apply: ['Collect 6-8 cohesive references'],
        journal_prompt:
          'The three words that capture how I want our home to feel are ______.',
      },
    },
    {
      title: 'Budgeting with Aesthetic Consistency',
      section: 'Vision & Foundations',
      order_index: 5,
      visible_to: 'all',
      introduction: `Luxury is not about cost -- it's about cohesion. True sophistication comes from thoughtful curation and
restraint. This module reframes budgeting as a design strength, teaching elegance and harmony within
any price range.`,
      lecture: `Every design has two currencies: money and intention. Where intention is strong, less money can still
create extraordinary results.
Start with value hierarchy:
1. Invest -- Crib, glider, dresser: long-term use, daily touchpoints.
2. Moderate -- Lighting, rugs, shelving: medium impact.
3. Save -- Decorative accents, textiles, and seasonal details.
Consistency creates perceived luxury. Keep finishes cohesive: one wood tone, one metal accent, one
fabric story. When tones align, the space reads unified -- not expensive, but elevated.
The 70/30 principle ensures balance -- 70% function, 30% styling. Allocate budget for one item that
sparks joy daily.
"Luxury is not abundance -- it's precision." By focusing on alignment rather than acquisition, you
achieve serenity and sophistication that endure.`,
      content: {
        explore: 'Luxury is mindfulness...',
        reflect: ['Which purchases bring comfort?'],
        apply: ['Rank by impact'],
        journal_prompt:
          "Before baby arrives, I'll choose one special piece that symbolizes ______.",
      },
    },
  ];

  for (const moduleData of modules) {
    const existing = await knex('academy_modules').where({ title: moduleData.title }).first();

    if (existing) {
      await knex('academy_modules')
        .where({ id: existing.id })
        .update({
          section: moduleData.section,
          order_index: moduleData.order_index,
          visible_to: moduleData.visible_to,
          introduction: moduleData.introduction,
          lecture: moduleData.lecture,
          content: moduleData.content,
          version: (existing.version || 1) + 1,
          updated_at: knex.fn.now(),
        });
    } else {
      await knex('academy_modules').insert({
        ...moduleData,
        version: 1,
      });
    }
  }
};
