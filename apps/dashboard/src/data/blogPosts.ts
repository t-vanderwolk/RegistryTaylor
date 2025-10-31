export type BlogPostContentBlock = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  heroAlt: string;
  body: BlogPostContentBlock[];
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "registry-color-story",
    title: "Designing a Registry Color Story that Feels Effortless",
    excerpt:
      "A signature palette keeps every registry gift and nursery detail cohesive. Here is how our concierge team guides the process.",
    author: "Taylor Concierge Team",
    publishedAt: "2025-03-02T10:00:00.000Z",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1466690672306-5f92132f7248?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Neutral nursery with blush accents and woven textures.",
    body: [
      {
        paragraphs: [
          "Before we add a single product to your registry, we begin with color. A grounded palette roots the experience and prevents gifting fatigue for friends and family. We choose one anchor tone, one supporting neutral, and a metallic or natural material to hold everything together.",
          "Inside the Taylor dashboard, you will find color story prompts alongside module reflections. Those questions—think lifestyle cues, favorite textiles, and heirlooms—inform the palette we create for you. It means every gift card, stroller accessory, and cozy blanket arrives camera-ready.",
        ],
      },
      {
        heading: "Layer textures intentionally",
        paragraphs: [
          "Color tells part of the story; texture adds the finishing touch. We pair matte finishes with subtle shine, plush textiles with woven details, and always sprinkle in something handcrafted. The palette acts as a filter, letting us say a gracious no to the pieces that do not align.",
          "Share any existing inspirations with your mentor. Even a single photo or Pinterest board is enough for us to craft a registry color story that feels uniquely yours.",
        ],
      },
    ],
  },
  {
    slug: "mentor-salons-preview",
    title: "Inside a Mentor Salon: What to Expect Each Week",
    excerpt:
      "Mentor salons keep your preparation calm, communal, and personal. Here is the rhythm members experience every week.",
    author: "Amelia Hart · Lead Mentor",
    publishedAt: "2025-02-18T15:30:00.000Z",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Gathering of parents around a coffee table with notebooks.",
    body: [
      {
        paragraphs: [
          "Mentor salons are the heartbeat of Taylor-Made Baby Co. Each week we gather on a private video salon or in our West Coast studio to align on the modules you are completing. Sessions open with a calming ritual, then we dive into three curated talking points shaped by your progress.",
          "Members arrive with questions, wins, or simply a desire to listen. Because your mentor already reviews your dashboard notes, the conversation never starts at zero. We celebrate wins, troubleshoot gear questions, and offer gentle nudges to keep your registry moving.",
        ],
      },
      {
        heading: "A concierge recap after every salon",
        paragraphs: [
          "Following the salon, concierge shares a personalized recap inside your dashboard journal. Expect linked resources, action items, and a preview of next week’s module unlock. The ritual ensures you always know the next right step with no late-night guesswork.",
        ],
      },
    ],
  },
  {
    slug: "postpartum-sanctuary",
    title: "Creating a Postpartum Sanctuary Room by Room",
    excerpt:
      "Postpartum comfort is design and logistics working in harmony. We map each room so support flows as smoothly as visitors do.",
    author: "Taylor Concierge Team",
    publishedAt: "2025-01-29T09:15:00.000Z",
    readTime: "6 min read",
    heroImage:
      "https://images.unsplash.com/photo-1527628173875-3c7bfd28ad81?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Sunlit bedroom with plush textiles and flowers.",
    body: [
      {
        paragraphs: [
          "Your postpartum sanctuary extends beyond the nursery. We map the primary bedroom, main living space, and kitchen so each one supports rest and recovery. Consider where you will feed, hydrate, and center yourself throughout the day. Once we know that flow, we curate storage inserts, snack bins, and fragrance moments that keep the space serene.",
        ],
      },
      {
        heading: "Little luxuries that change everything",
        paragraphs: [
          "A carafe of ginger-infused water at your bedside, slippers waiting by the nursing chair, music set to a playlist we build for you—these are the concerted details that make postpartum calm. Every concierge plan includes a sanctuary checklist broken into 15-minute refresh tasks so support partners can step in with confidence.",
        ],
      },
    ],
  },
  {
    slug: "nursery-lighting-guide",
    title: "Lighting Layers for the Dreamiest Nursery Evenings",
    excerpt:
      "Ambient, task, and accent lighting work together to shape the mood. We break down the trio and the fixtures we love right now.",
    author: "Jules Emory · Nursery Stylist",
    publishedAt: "2025-01-10T11:45:00.000Z",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Softly lit nursery corner with reading chair.",
    body: [
      {
        paragraphs: [
          "We style nurseries with three lighting layers. A dimmable pendant or flush mount sets the tone for daytime play, a sconce or swing-arm lamp supports reading rituals, and a petite accent light offers the soft glow you need for overnight feeds. When every fixture is on a smart plug, you can cue lighting scenes right from the Taylor dashboard.",
        ],
      },
      {
        heading: "Our current fixture shortlist",
        paragraphs: [
          "We love pairing linen drum pendants with plaster sconces and petite alabaster night lights. Want a more modern look? Choose a flush mount with frosted glass and add a brass articulating lamp for texture. During concierge calls we review your floor plan and drop fixture suggestions that match the rest of your home.",
        ],
      },
    ],
  },
  {
    slug: "registry-manners",
    title: "Registry Manners: Making Guests Feel Delighted",
    excerpt:
      "A thoughtful registry invitation keeps gifting joyful for everyone involved. Use these concierge-approved etiquette notes.",
    author: "Taylor Concierge Team",
    publishedAt: "2024-12-18T14:05:00.000Z",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Gift wrapping station with blush ribbons.",
    body: [
      {
        paragraphs: [
          "We recommend sharing your registry in tiers. Start with an intentional text or email to closest family featuring a heartfelt note and the link. A few days later, add the link to your shower invitation and signature. Finally, set your dashboard to automatically thank guests as gifts ship. Small touches like these keep the experience elevated.",
        ],
      },
      {
        heading: "Always lead with gratitude",
        paragraphs: [
          "Use language that acknowledges the support system surrounding you. Mention how the registry keeps gifting coordinated and how excited you are to celebrate together. We include sample language inside the Taylor journal so you never have to draft from scratch.",
        ],
      },
    ],
  },
  {
    slug: "mentor-doula-partnership",
    title: "How Mentors and Doulas Co-Create Support",
    excerpt:
      "Your concierge mentor and doula share notes behind the scenes. Here is what that collaboration looks like week to week.",
    author: "Chanel Rivers · Lead Mentor",
    publishedAt: "2024-11-30T17:20:00.000Z",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1544776193-352d25ca81c3?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Doula and parent reviewing notes together.",
    body: [
      {
        paragraphs: [
          "The mentor-doula partnership is a hallmark of Taylor-Made Baby Co. Each Monday, mentors share a concise dashboard note summarizing your academy progress and registry updates. Doulas respond with care considerations so everyone stays aligned without peppering you with duplicate questions.",
        ],
      },
      {
        heading: "One shared playbook",
        paragraphs: [
          "Within the dashboard we log preferences, sensitivities, and birth plan notes. Your team treats that as the playbook, ensuring every suggestion honors your vision. It is concierge-level coordination that keeps your preparation serene.",
        ],
      },
    ],
  },
  {
    slug: "seasonal-bath-rituals",
    title: "Seasonal Bath Rituals for Baby and You",
    excerpt:
      "Our mentors adore a bath ritual that pampers both parent and baby. Rotate these seasonal touches into your routine.",
    author: "Taylor Concierge Team",
    publishedAt: "2024-11-02T08:40:00.000Z",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Parent holding baby near a warm bath.",
    body: [
      {
        paragraphs: [
          "Set the scene with a dimmed lamp, a streaming playlist, and linens warmed in the dryer. In autumn we love herbal sachets steeped in the bath; in spring it is all about citrus and magnolia. For parents, we add a quick facial steam or a hydrating mask so you both emerge grounded.",
        ],
      },
      {
        heading: "Keep supplies within reach",
        paragraphs: [
          "Use a cane basket or acrylic cart to hold bath-time essentials. Inside we place two hooded towels, a lidded jar of cotton rounds, and a small bottle of body oil. Seasonal swaps take minutes when everything lives in one curated spot.",
        ],
      },
    ],
  },
  {
    slug: "memory-keeping-rituals",
    title: "Memory Keeping Rituals You Can Actually Maintain",
    excerpt:
      "Capturing memories should feel joyful, not like homework. We share the rituals members stick with month after month.",
    author: "Taylor Concierge Team",
    publishedAt: "2024-10-12T12:25:00.000Z",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "Parent writing notes in a journal with baby photos.",
    body: [
      {
        paragraphs: [
          "We love rituals that fit into real life. Keep a Polaroid camera on the kitchen shelf, snap one candid a week, and slide it into the Taylor journal pockets. Pair the photo with three-sentence reflections you can write while waiting for coffee to brew. It is enough to build a keepsake without overwhelming your calendar.",
        ],
      },
      {
        heading: "Anchor the ritual to existing habits",
        paragraphs: [
          "Maybe you light a candle every Sunday night and jot down the week’s highlight. Or perhaps mentors prompt you inside the dashboard messenger. When the ritual hooks onto something already in motion, it becomes beautifully sustainable.",
        ],
      },
    ],
  },
];

function sortPostsDescending(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPosts(): BlogPost[] {
  return sortPostsDescending(BLOG_POSTS);
}

export type BlogPostSummary = Omit<BlogPost, "body">;

export function getBlogPostSummaries(): BlogPostSummary[] {
  return sortPostsDescending(BLOG_POSTS).map(({ body: _unusedBody, ...summary }) => summary);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
