const db = require('../connection');

const DEMO_POSTS = [
  {
    title: 'Designing a Calming Nursery Sanctuary',
    slug: 'designing-a-calming-nursery-sanctuary',
    excerpt:
      'Create a sensory-balanced nursery that signals calm for midnight feeds and sunny morning cuddles.',
    content:
      'Great nurseries feel like a soft exhale. Begin with a neutral palette—think warm ivories, soft blush, and grounding charcoal accents. Layer in touchable textures such as boucle gliders, light linen drapery, and a plush wool rug. Lighting matters most: add dimmable sconces, a salt lamp for night feeds, and blackout panels so baby adjusts gently. Finally, curate baby-care zones—changing, feeding, play—and keep surfaces clutter-free with concealed storage baskets. A calm environment supports confident parent energy.',
    author: 'Mia Collins · Nursery Stylist',
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1100&q=80',
    created_at: new Date('2024-03-08T10:00:00Z'),
  },
  {
    title: 'Top 5 Stroller Tips from Concierge Mentors',
    slug: 'top-5-stroller-tips',
    excerpt:
      'Mentor-approved pointers for finding a stroller that fits your lifestyle, storage, and travel rhythm.',
    content:
      'The right stroller is an everyday sidekick. 1) Test drive in-store with one hand—smooth steering saves sore wrists. 2) Confirm trunk and entryway measurements to avoid daily wrestling. 3) Choose a weight that matches your terrain; city dwellers love lighter frames, while suburban adventures benefit from all-terrain wheels. 4) Register MacroBaby accessories through Taylor so gifts sync automatically. 5) Schedule a follow-up fitting after baby arrives—we adjust straps and seat angles as your little one grows.',
    author: 'Jordan Price · Registry Strategist',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=80',
    created_at: new Date('2024-04-15T14:30:00Z'),
  },
  {
    title: 'Preparing for Postpartum Wellness',
    slug: 'preparing-for-postpartum-wellness',
    excerpt:
      'Thoughtful rituals and support systems to protect your energy in the fourth trimester.',
    content:
      'Postpartum wellness thrives with intentional rituals. Begin with nourishment—batch cook broths, hydrating teas, and iron-rich snacks. Assemble a bedside recovery basket with peri bottle, herbal sprays, and soft layers. Schedule mentor check-ins during weeks 2, 4, and 6 to talk sleep, feeding, and mindset. Finally, plan daily micro-rests: a walk with sunlight, guided breathing, or a five-minute journal prompt in your Taylor dashboard. Your future self will thank you.',
    author: 'Lola Mercado · Postpartum Doula',
    image_url: 'https://images.unsplash.com/photo-1546017953-2254de68d24c?auto=format&fit=crop&w=1100&q=80',
    created_at: new Date('2024-05-20T09:15:00Z'),
  },
];

async function seedBlogPosts() {
  for (const post of DEMO_POSTS) {
    const existing = await db('blog_posts').where({ slug: post.slug }).first();
    if (existing) {
      await db('blog_posts').where({ slug: post.slug }).update({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        image_url: post.image_url,
        created_at: post.created_at,
      });
    } else {
      await db('blog_posts').insert(post);
    }
  }
}

module.exports = seedBlogPosts;
