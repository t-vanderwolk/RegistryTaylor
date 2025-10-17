exports.seed = async (knex) => {
  const userId = 'user_demo';

  const modules = await knex('academy_modules').select('id', 'slug', 'title');
  const moduleBySlug = new Map(modules.map((module) => [module.slug || module.title, module]));

  const registrySeed = [
    {
      moduleSlug: 'nursery-vision-foundations',
      category: 'Nursery',
      product_name: 'Heirloom Canopy Crib',
      brand: 'Maison Bébé',
      product_url: 'https://www.macrobaby.com/products/heirloom-canopy-crib',
      mentor_tag: '@taylor',
    },
    {
      moduleSlug: 'nursery-vision-foundations',
      category: 'Postpartum',
      product_name: 'Plush Glider & Ottoman',
      brand: 'Sunday Morning',
      product_url: 'https://www.macrobaby.com/products/plush-glider-ottoman-set',
      mentor_tag: '@elise',
    },
    {
      moduleSlug: 'nursery-vision-foundations',
      category: 'Gear',
      product_name: 'Feather-Light Travel Stroller',
      brand: 'Feather & Co.',
      product_url: 'https://www.macrobaby.com/products/feather-light-travel-stroller',
      mentor_tag: null,
    },
  ].flatMap((item) => {
    const moduleRecord = moduleBySlug.get(item.moduleSlug) || moduleBySlug.get(item.moduleSlug?.replace(/-/g, ' '));
    if (!moduleRecord) return [];
    return [
      {
        user_id: userId,
        module_id: moduleRecord.id,
        category: item.category,
        product_name: item.product_name,
        brand: item.brand,
        product_url: item.product_url,
        mentor_tag: item.mentor_tag,
      },
    ];
  });

  await knex('registry_items').del();
  if (registrySeed.length) {
    await knex('registry_items').insert(registrySeed);
  }

  const communityPosts = [
    {
      module_slug: 'nursery-vision-foundations',
      user_id: 'user_demo',
      content:
        'Has anyone layered linen + bouclé in the nursery? Wondering if it still feels breathable in the Arizona heat.',
      media_url: null,
      mentor_reply:
        'Pair a linen window treatment with a small bouclé accent pillow — the balance keeps it airy while adding softness.',
    },
    {
      module_slug: 'nursery-vision-foundations',
      user_id: 'mentor_taylor',
      content:
        'Try anchoring your palette with a mineral tone — eucalyptus or dune — then add blush accents through textiles.',
      media_url: 'https://www.pinterest.com/pin/neutral-nursery-mockup/',
      mentor_reply: null,
    },
  ];

  await knex('community_replies').del();
  await knex('community_posts').del();

  const insertedPosts = [];
  for (const post of communityPosts) {
    const [inserted] = await knex('community_posts')
      .insert({
        user_id: post.user_id,
        module_slug: post.module_slug,
        content: post.content,
        media_url: post.media_url,
        mentor_reply: post.mentor_reply,
      })
      .returning('*');
    if (inserted) {
      insertedPosts.push(inserted);
    }
  }

  const primaryPost = insertedPosts[0];
  if (primaryPost) {
    await knex('community_replies').insert([
      {
        post_id: primaryPost.id,
        user_id: 'mentor_elise',
        content: 'Layer a gauzy cotton curtain over linen for softness without trapping heat.',
      },
      {
        post_id: primaryPost.id,
        user_id: userId,
        content: 'Thank you! Love the idea of keeping the bigger pieces breathable.',
      },
    ]);
  }
};
