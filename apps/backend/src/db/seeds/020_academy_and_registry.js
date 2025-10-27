exports.seed = async (knex) => {
  await knex('community_events').del();
  await knex('registry_suggestions').del();
  await knex('academy_modules').del();

  const modules = [
    {
      slug: 'nursery-vision-foundations',
      title: 'Nursery Vision & Foundations',
      subtitle: 'Design a calm, functional sanctuary',
      category: 'nursery',
      is_core: true,
      sort_order: 1,
      estimated_minutes: 18,
      registry_focus: 'Nursery',
      overview:
        'Shape your nursery to balance calm beauty with practical flow. This module covers palette planning, layout, and the sensory cues that create a serene experience.',
      lecture_content:
        '### Palette & Lighting\nCurate a palette rooted in soft neutrals or tonal pastels. Layer lighting with a dimmable main source, directional task lighting, and a low-glow lamp for night feeds.\n\n### Layout Fundamentals\nMap “care zones”: rest (crib), change (dresser + essentials), and comfort (rocker). Keep pathways open and tether cables.\n\n### Styling Touchpoints\nIntroduce layered textiles, framed keepsakes, and tactile baskets. Anchor the room with a rug that grounds the palette.',
      journal_prompt:
        'Describe how you want the nursery to feel at 3am when everyone is sleepy. What colors, scents, or rituals support that mood?',
      apply_checklist: [
        { id: 'palette', label: 'Finalize palette + lighting plan', completed: false },
        { id: 'layout', label: 'Confirm crib + chair placement', completed: false },
        { id: 'styling', label: 'Outline styling accents to source', completed: false },
      ],
    },
    {
      slug: 'sleep-space-essentials',
      title: 'Sleep Space Essentials',
      subtitle: 'Establish a restful rhythm for baby and parents',
      category: 'gear',
      is_core: true,
      sort_order: 2,
      estimated_minutes: 22,
      registry_focus: 'Sleep',
      overview:
        'Select sleep solutions that adapt as baby grows. We cover bassinets, monitors, and sound layers that encourage consistency and calm.',
      lecture_content:
        '### Safe Sleep Foundations\nFollow ABCs: Alone, on their Back, in a Crib/bassinet. Choose breathable materials and keep the sleep surface clear.\n\n### Gear That Supports Routines\nCompare bassinets with mesh walls, smart monitors, and responsive sound. Focus on tools that simplify, not overwhelm.\n\n### Nighttime Logistics\nSet up a “within arm’s reach” caddy with burp cloths, swaddles, and hydration for parents.',
      journal_prompt:
        'What comforts help you settle at night? How can you translate them into your baby’s winding-down routine?',
      apply_checklist: [
        { id: 'bassinet', label: 'Select bassinet + sheets', completed: false },
        { id: 'monitor', label: 'Choose monitoring approach', completed: false },
        { id: 'sound', label: 'Decide on sound machine strategy', completed: false },
      ],
    },
    {
      slug: 'fourth-trimester-care',
      title: 'Fourth Trimester Care',
      subtitle: 'Create a nurturing recovery and support plan',
      category: 'postpartum',
      is_core: true,
      sort_order: 3,
      estimated_minutes: 24,
      registry_focus: 'Postpartum',
      overview:
        'Anticipate the first 12 weeks with gentle rituals, recovery stations, and support touchpoints for the entire family.',
      lecture_content:
        '### Recovery Stations\nStock bedside baskets with peri-care essentials, hydration, and nourishing snacks.\n\n### Support Circle\nMap helpers for meals, overnights, or sibling care. Align expectations and gratitude gestures ahead of time.\n\n### Emotional Check-ins\nSchedule weekly reflections with your mentor or support partner to adjust routines and rest goals.',
      journal_prompt:
        'Who is part of your fourth-trimester support circle? What do you want each person to help you protect or celebrate?',
      apply_checklist: [
        { id: 'stations', label: 'Assemble recovery + feeding stations', completed: false },
        { id: 'support', label: 'Confirm support schedule + roles', completed: false },
        { id: 'rituals', label: 'Outline weekly rest and reflection rituals', completed: false },
      ],
    },
  ];

  const insertedModules = await knex('academy_modules').insert(modules).returning(['id', 'slug']);
  const moduleBySlug = insertedModules.reduce((acc, module) => {
    acc[module.slug] = module.id;
    return acc;
  }, {});

  const suggestions = [
    {
      product_id: 'MB-NURSERY-MOSES',
      title: 'Lalo Crescent Bassinet',
      brand: 'Lalo',
      category: 'Nursery',
      image_url: 'https://images.taylormadebaby.co/products/lalo-crescent-bassinet.jpg',
      affiliate_url: 'https://macrobaby.com/lalo-crescent-bassinet?aff=4496818',
      price_cents: 34900,
      module_id: moduleBySlug['nursery-vision-foundations'],
      metadata: {
        colorways: ['Oat', 'Mist', 'Slate'],
        lead_time_days: 14,
      },
    },
    {
      product_id: 'MB-SLEEP-HATCH',
      title: 'Hatch Rest+ 2nd Gen',
      brand: 'Hatch',
      category: 'Sleep',
      image_url: 'https://images.taylormadebaby.co/products/hatch-rest-plus.jpg',
      affiliate_url: 'https://macrobaby.com/hatch-rest-plus?aff=4496818',
      price_cents: 8999,
      module_id: moduleBySlug['sleep-space-essentials'],
      metadata: {
        includes_monitor: false,
      },
    },
    {
      product_id: 'MB-POSTPARTUM-SET',
      title: 'Fourth Trimester Recovery Set',
      brand: 'Frida Mom',
      category: 'Postpartum',
      image_url: 'https://images.taylormadebaby.co/products/frida-mom-recovery.jpg',
      affiliate_url: 'https://macrobaby.com/frida-mom-recovery-set?aff=4496818',
      price_cents: 11999,
      module_id: moduleBySlug['fourth-trimester-care'],
      metadata: {
        bundle: ['Peri bottle', 'Upside Down Foam', 'Cooling pads'],
      },
    },
    {
      product_id: 'MB-TRAVEL-SLUMBERPOD',
      title: 'SlumberPod Portable Sleep Canopy',
      brand: 'SlumberPod',
      category: 'Travel',
      image_url: 'https://images.taylormadebaby.co/products/slumberpod.jpg',
      affiliate_url: 'https://macrobaby.com/slumberpod?aff=4496818',
      price_cents: 18499,
      module_id: null,
      metadata: {
        ideal_for: 'travel',
      },
    },
  ];

  if (suggestions.length) {
    await knex('registry_suggestions').insert(
      suggestions.map((suggestion) => ({
        ...suggestion,
        metadata: suggestion.metadata || {},
      }))
    );
  }

  const now = new Date();
  const events = [
    {
      title: 'Nursery Styling Salon',
      description: 'Collaborative styling session to review color palettes, lighting, and keepsake placement.',
      event_type: 'salon',
      starts_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      ends_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      location: 'Virtual · Taylor-Made Studio',
      virtual: true,
      featured: true,
    },
    {
      title: 'Mentor Office Hours: Sleep Shapes',
      description: 'Live Q&A on building sustainable sleep routines and integrating sound layers.',
      event_type: 'office_hours',
      starts_at: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      ends_at: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      location: 'Virtual · Taylor-Made Studio',
      virtual: true,
      featured: false,
    },
    {
      title: 'Fourth Trimester Garden Party',
      description: 'Celebrate recent arrivals, share recovery rituals, and connect with fellow members.',
      event_type: 'celebration',
      starts_at: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      ends_at: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Scottsdale Studio',
      virtual: false,
      featured: false,
    },
  ];

  if (events.length) {
    await knex('community_events').insert(
      events.map((event) => ({
        ...event,
        metadata: event.metadata || {},
      }))
    );
  }
};
