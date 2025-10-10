exports.seed = async (knex) => {
  const modules = [
    {
      title: 'Nursery Vision & Style Finder',
      section: 'Module 1',
      order_index: 1,
      content: {
        explore: 'Predictable, uncluttered spaces lower stress for both parent and infant...',
        reflect: [
          'What parts of my home feel peaceful?',
          'Which textures feel chaotic?',
        ],
        apply: [
          'Simplify one nursery area',
          'Replace clutter with one grounding item',
        ],
        journal_prompt:
          'When I picture myself in the finished nursery, I hope it makes me feel ______ and helps me prepare for ______.',
      },
    },
    {
      title: 'Color Psychology & Emotional Influence',
      section: 'Module 2',
      order_index: 2,
      content: {
        explore: 'Color activates the limbic system...',
        reflect: [
          'Which hues calm me?',
          'Which tones overstimulate?',
        ],
        apply: [
          'Pick 3 calming hues',
          'Test them under different light',
        ],
        journal_prompt:
          'As I plan the nursery, the color that brings me calm and confidence is ______ because ______.',
      },
    },
    {
      title: 'Material & Texture Palettes',
      section: 'Module 3',
      order_index: 3,
      content: {
        explore: 'Touch is the first sense to develop...',
        reflect: [
          'Which textures soothe me?',
          'Which feel synthetic?',
        ],
        apply: [
          'Layer wood + linen + bouclé',
          'Keep plush near feeding zones',
        ],
        journal_prompt:
          'When I touch soft materials like ______, it helps me imagine creating a nurturing space for baby.',
      },
    },
    {
      title: 'Creating a Moodboard',
      section: 'Module 4',
      order_index: 4,
      content: {
        explore: 'Moodboards turn intuition into visual clarity...',
        reflect: [
          'Which images repeat the same emotion?',
          'What feels out of harmony?',
        ],
        apply: [
          'Pin 6 cohesive images',
          'Label each with your anchor emotion',
        ],
        journal_prompt:
          'The three words that capture how I want our home to feel are ______, ______, and ______.',
      },
    },
    {
      title: 'Budgeting with Aesthetic Consistency',
      section: 'Module 5',
      order_index: 5,
      content: {
        explore: 'Luxury is mindfulness, not expense...',
        reflect: [
          'Which purchases bring lasting comfort?',
          'Where can I simplify?',
        ],
        apply: [
          'Rank purchases by emotional impact',
          'Apply the 70/30 rule (function/style)',
        ],
        journal_prompt:
          'Before baby arrives, I’ll choose one special piece that symbolizes ______ — a reminder of the love we’re preparing to welcome.',
      },
    },
  ];

  for (const [index, module] of modules.entries()) {
    const existing = await knex('academy_modules').where({ title: module.title }).first();
    if (existing) {
      await knex('academy_modules')
        .where({ id: existing.id })
        .update({
          section: module.section,
          order_index: module.order_index ?? index + 1,
          content: module.content,
          visible_to: existing.visible_to || 'all',
          version: (existing.version || 1) + 1,
          updated_at: knex.fn.now(),
        });
    } else {
      await knex('academy_modules').insert({
        title: module.title,
        section: module.section,
        order_index: module.order_index ?? index + 1,
        content: module.content,
        visible_to: 'all',
        version: 1,
      });
    }
  }
};
