import { Knex } from "knex";

type ApplyItem = {
  id: string;
  text: string;
};

type ModuleContentSeed = {
  explore: string;
  lectureBullets: string[];
  journalPrompt: string;
  applyItems: ApplyItem[];
};

type ModuleSeed = {
  code: string;
  title: string;
  subtitle: string;
  orderIdx: number;
  estMinutes: number;
  coverIcon: string;
  content: ModuleContentSeed;
};

type TrackSeed = {
  slug: string;
  title: string;
  orderIdx: number;
  modules: ModuleSeed[];
};

type JourneySeed = {
  slug: string;
  title: string;
  orderIdx: number;
  tracks: TrackSeed[];
};

const academyData: JourneySeed[] = [
  {
    slug: "nursery",
    title: "Nursery Design",
    orderIdx: 1,
    tracks: [
      {
        slug: "vision-foundations",
        title: "Vision & Foundations",
        orderIdx: 1,
        modules: [
          {
            code: "nursery-vision-style",
            title: "Nursery Vision & Style Finder",
            subtitle: "Where Aesthetics Meet Emotion",
            orderIdx: 1,
            estMinutes: 35,
            coverIcon: "sparkles",
            content: {
              explore:
                "Every nursery tells a story. The goal isn’t perfection—it’s alignment between beauty, function, and feeling. The nursery becomes your anchor during transition and your baby’s earliest sensory world.",
              lectureBullets: [
                "Design begins with emotion—ask: “What do I want this room to make us feel?”",
                "Harmonious design lowers cortisol and supports calm for parent and baby.",
                "Five Taylor-Made Style Archetypes guide visual tone and function.",
                "Modern – Clarity & Light: open layout, minimal ornamentation, natural light.",
                "Classic – Comfort & Heritage: symmetry, soft curves, timeless furniture.",
                "Whimsical – Story & Imagination: playful motifs and gentle pastel color stories.",
                "Minimalist – Stillness & Function: intentional simplicity creates mental spaciousness.",
                "Luxe – Texture & Refinement: subtle glamour through bouclé, brass, layered neutrals.",
                "Alignment, not abundance, is the secret to serenity.",
              ],
              journalPrompt: "Before baby arrives, how do I want this room to feel?",
              applyItems: [
                { id: "item-1", text: "Choose your nursery archetype (Modern, Classic, Whimsical, Minimalist, or Luxe)" },
                { id: "item-2", text: "List three words that describe your ideal emotional tone" },
                { id: "item-3", text: "Pin ten inspiration images that reflect those words" },
              ],
            },
          },
          {
            code: "color-psychology",
            title: "Color Psychology & Emotional Influence",
            subtitle: "Designing Through Emotion",
            orderIdx: 2,
            estMinutes: 30,
            coverIcon: "palette",
            content: {
              explore:
                "Color is emotion made visible. It shapes how a space feels long before we consciously interpret it. For babies, color becomes environmental language; for parents, it modulates mood and bonding.",
              lectureBullets: [
                "Neutrals—ivory, oat, greige—ground and expand a space.",
                "Pastels—sage, blush, sky—engage curiosity softly without overstimulation.",
                "Earth tones—terracotta, sand, clay—mimic nature’s steadiness and warmth.",
                "Cool tones—seafoam, eucalyptus—quiet the mind and promote rest.",
                "Warm accents—peach, pale gold—infuse happiness and comfort.",
                "Apply the 60–30–10 rule: 60% base, 30% secondary, 10% accent.",
                "Lighting transforms color—warm bulbs (2700–3000 K) support melatonin.",
                "Morning daylight energizes; evening light cues rest and bonding.",
                "Intentional color makes serenity visible.",
              ],
              journalPrompt: "Which colors calm me and feel emotionally safe?",
              applyItems: [
                { id: "item-1", text: "Pick three core colors for walls, furniture, and accents" },
                { id: "item-2", text: "Select bulb temperature that suits evening calm (2700–3000 K)" },
                { id: "item-3", text: "Test paint or fabric swatches in both daylight and evening light" },
              ],
            },
          },
          {
            code: "material-texture-palettes",
            title: "Material & Texture Palettes",
            subtitle: "Sensory Harmony Through Touch & Tone",
            orderIdx: 3,
            estMinutes: 32,
            coverIcon: "layers",
            content: {
              explore:
                "Before babies focus their eyes, they experience the world through touch. Texture teaches comfort and safety, turning design into nurturing.",
              lectureBullets: [
                "Ground the space with nature: wood, linen, rattan, cotton.",
                "Use GREENGUARD Gold or OEKO-TEX materials to ensure low-VOC safety.",
                "Bouclé and sherpa add cozy warmth for gliders or rugs.",
                "Velvet or brushed knit add tactile luxury when used sparingly.",
                "Balance one structured texture (wood/metal) to two soft (fabric/knit).",
                "Texture repetition across zones creates rhythm and calm.",
                "Healthy air equals emotional ease—ventilate regularly.",
                "Texture is the lullaby of design—the world made soft, safe, and predictable.",
              ],
              journalPrompt: "Which textures feel most ‘home’ to me?",
              applyItems: [
                { id: "item-1", text: "Select three primary textures for furniture and textiles" },
                { id: "item-2", text: "Check certifications for safety (OEKO-TEX, GREENGUARD)" },
                { id: "item-3", text: "Order fabric or material swatches for tactile testing" },
              ],
            },
          },
          {
            code: "creating-moodboard",
            title: "Creating a Moodboard",
            subtitle: "From Vision to Visualization",
            orderIdx: 4,
            estMinutes: 28,
            coverIcon: "moodboard",
            content: {
              explore:
                "A moodboard bridges imagination and reality. It captures emotion through visuals, guiding every design decision before you invest.",
              lectureBullets: [
                "Start with emotion, not products—define the feeling you want to live inside.",
                "Gather textures, color swatches, and imagery that evoke that feeling.",
                "Limit palette: four core colors, three main textures—constraint clarifies vision.",
                "Compose with balance—one dominant hue, one mid-tone, one accent.",
                "Adjust until the board feels visually calm—trust your eye’s rest point.",
                "Use digital tools (Canva, Milanote) or tactile corkboard for sensory grounding.",
                "A moodboard is direction, not decoration—your visual compass.",
              ],
              journalPrompt: "What emotion do I want my nursery to hold when I walk in?",
              applyItems: [
                { id: "item-1", text: "Build your moodboard digitally or physically" },
                { id: "item-2", text: "Select four colors and three textures that repeat across the space" },
                { id: "item-3", text: "Share your board with a mentor for feedback" },
              ],
            },
          },
          {
            code: "budgeting-aesthetic-consistency",
            title: "Budgeting with Aesthetic Consistency",
            subtitle: "Luxury Through Intention, Not Excess",
            orderIdx: 5,
            estMinutes: 34,
            coverIcon: "coins",
            content: {
              explore:
                "Luxury in design is cohesion, not cost. Intention turns simple choices into lasting comfort.",
              lectureBullets: [
                "True luxury = deliberate unity, not price tag.",
                "Invest in daily-use foundations: crib, glider, dresser.",
                "Moderate spending on lighting, rugs, and shelving for tone and function.",
                "Save on textiles and décor—refresh seasonally for joy and variety.",
                "Keep one wood tone, one metal accent, one fabric story for cohesion.",
                "Apply the 70–30 principle: 70 % function, 30 % styling.",
                "Allow one ‘joy piece’ that makes you smile daily—emotional ROI.",
                "A room aligned in purpose radiates calm beyond its cost.",
              ],
              journalPrompt: "What matters most for daily comfort and ease?",
              applyItems: [
                { id: "item-1", text: "List furniture by priority: invest, moderate, save" },
                { id: "item-2", text: "Confirm consistent finishes (wood, metal, fabric)" },
                { id: "item-3", text: "Select one statement ‘joy piece’" },
              ],
            },
          },
        ],
      },
      {
        slug: "sleep-space",
        title: "Sleep & Space Planning",
        orderIdx: 2,
        modules: [
          {
            code: "sleep-space-setup",
            title: "Choosing Sleep Space",
            subtitle: "Safe Layouts & Transition Planning",
            orderIdx: 6,
            estMinutes: 28,
            coverIcon: "moon",
            content: {
              explore:
                "Your baby’s sleep space is the heart of nightly rhythm. A clear, predictable layout promotes calm, safety, and smoother sleep transitions.",
              lectureBullets: [
                "Follow ABC sleep: Alone, on Back, in Crib/Bassinet.",
                "Firm, flat mattress with fitted sheet—no pillows, bumpers, or toys.",
                "Keep cords, monitors, and decor at least three feet from sleep zone.",
                "Ideal temperature 68–72 °F; dress baby in wearable blanket, not loose blankets.",
                "Position bassinet or crib near caregiver for first six months.",
                "Plan bassinet-to-crib transition between four and six months.",
                "Anchor furniture and secure drawers for safety.",
                "Choose a space that supports your nighttime routine—easy access for feeds and diapering.",
              ],
              journalPrompt: "What does a peaceful nighttime environment look and feel like for me?",
              applyItems: [
                { id: "item-1", text: "Measure the sleep area and confirm safe clearance on all sides" },
                { id: "item-2", text: "Check ABC sleep setup using a safety checklist" },
                { id: "item-3", text: "Plan transition timeline from bassinet to crib" },
                { id: "item-4", text: "Anchor furniture and remove hanging cords" },
              ],
            },
          },
          {
            code: "nursery-furniture-toys",
            title: "Nursery Furniture & Toys",
            subtitle: "Longevity, Function & Developmental Fit",
            orderIdx: 7,
            estMinutes: 26,
            coverIcon: "boxes",
            content: {
              explore:
                "Quality pieces evolve with your child and simplify daily care. Balance safety, sustainability, and developmental support.",
              lectureBullets: [
                "Invest in convertible furniture—crib-to-toddler-bed or dresser-changing-table.",
                "Choose GREENGUARD Gold or low-VOC finishes for cleaner air.",
                "Rounded corners and tip-restraint kits prevent injuries.",
                "Include open shelving or labeled baskets for visual order.",
                "Toy storage at baby’s eye level encourages independence.",
                "Favor natural materials—wood, cotton, silicone—over plastics.",
                "Rotate toys to limit overstimulation.",
                "Include one soft sensory item, one developmental toy, one social mirror or face toy.",
              ],
              journalPrompt: "Which nursery pieces will serve our family beyond infancy?",
              applyItems: [
                { id: "item-1", text: "Create a list of multi-stage furniture options" },
                { id: "item-2", text: "Verify finish certifications and tip restraints" },
                { id: "item-3", text: "Organize toy baskets by function or theme" },
              ],
            },
          },
          {
            code: "sleep-training-adjustment",
            title: "Sleep Training & Adjustment",
            subtitle: "Gentle Routines & Environment Cues",
            orderIdx: 8,
            estMinutes: 27,
            coverIcon: "zzz",
            content: {
              explore:
                "Sleep is learned through rhythm and consistency. Environment, cues, and caregiver calm teach your baby that the world is safe to rest in.",
              lectureBullets: [
                "Newborns lack circadian rhythm until 10–12 weeks—expect flexibility.",
                "Set a consistent bedtime ritual: dim lights, feed, song, swaddle, lay down drowsy.",
                "Daytime light exposure regulates melatonin.",
                "Respond to cries calmly; avoid overstimulation during night wakings.",
                "Avoid screen light 60 minutes before bedtime.",
                "Use white-noise safely (< 50 dB) as a rest cue.",
                "Track naps and wake windows to discover natural rhythm.",
                "Your calm voice and slow movements signal safety.",
              ],
              journalPrompt: "Which bedtime rituals make me feel calm and connected?",
              applyItems: [
                { id: "item-1", text: "Design a three-step bedtime routine" },
                { id: "item-2", text: "Set light levels for day vs. night" },
                { id: "item-3", text: "Configure a low-decibel white-noise source" },
              ],
            },
          },
          {
            code: "sound-light-safety",
            title: "Sound Machine & Lighting Safety",
            subtitle: "Supporting Restful Nights & Circadian Health",
            orderIdx: 9,
            estMinutes: 24,
            coverIcon: "lightbulb",
            content: {
              explore:
                "Light and sound shape infant physiology. Mindful control of both helps maintain healthy sleep cycles and safe sensory development.",
              lectureBullets: [
                "Keep sound ≤ 50 dB at crib distance (test with phone app).",
                "Place sound machine 6–8 ft from baby, never in crib.",
                "Use warm-white or amber light (2700–3000 K) at night.",
                "Avoid overhead blue/white LEDs after dusk.",
                "Use dimmer or red-spectrum night-light for nighttime feeds.",
                "Keep cords and plugs out of reach; use outlet covers.",
                "Daytime brightness cues alertness; darkness cues rest.",
                "Consistency builds predictable body rhythm.",
              ],
              journalPrompt: "How can I adjust my lighting and sound to feel more restful myself?",
              applyItems: [
                { id: "item-1", text: "Measure night-light temperature (K)" },
                { id: "item-2", text: "Test sound-machine decibel level at crib height" },
                { id: "item-3", text: "Install blackout shades or dimmers" },
                { id: "item-4", text: "Secure all electrical cords safely" },
              ],
            },
          },
          {
            code: "calm-care-routine",
            title: "Creating a Calm Care Routine",
            subtitle: "Wellness Station & Nighttime Reassurance",
            orderIdx: 10,
            estMinutes: 23,
            coverIcon: "heart",
            content: {
              explore:
                "A calm care station turns late-night tasks into comforting rituals. Organization reduces stress when your baby needs quick soothing.",
              lectureBullets: [
                "Designate one zone for diapers, wipes, creams, thermometer, and spare PJs.",
                "Use soft lighting to prevent full wake-ups during changes.",
                "Keep essentials within arm’s reach for efficiency.",
                "Add a comfort item for caregivers—a silk eye mask, soft robe, or soothing tea.",
                "Restock nightly for peace of mind.",
                "Document pediatrician notes or medications in one visible spot.",
                "Pair care routines with a grounding practice—deep breath, mantra, or gratitude.",
                "Your prepared environment eases middle-of-the-night decisions.",
              ],
              journalPrompt: "What helps me feel cared for during 2 a.m. wake-ups?",
              applyItems: [
                { id: "item-1", text: "Assemble a night-care caddy with essentials" },
                { id: "item-2", text: "Set a nightly reset reminder" },
                { id: "item-3", text: "Add one caregiver comfort item to the station" },
              ],
            },
          },
        ],
      },
      {
        slug: "organization",
        title: "Organization & Styling",
        orderIdx: 3,
        modules: [
          {
            code: "storage-zoning-flow",
            title: "Storage Zoning & Flow",
            subtitle: "Design storage that supports real-life rhythms.",
            orderIdx: 9,
            estMinutes: 30,
            coverIcon: "boxes",
            content: {
              explore:
                "Intentional storage zones keep the nursery calm during growth spurts, blowouts, and daily resets.",
              lectureBullets: [
                "Divide the room into care, comfort, and keepsake zones.",
                "Clear bins make late-night restocks faster for sleepy caregivers.",
                "Labeling systems should be legible to partners and rotating helpers.",
                "Place daily essentials at waist height to minimize bending post-birth.",
                "Overflow storage belongs outside the nursery to avoid crowding.",
                "Rotate seasonal items quarterly to prevent overwhelm.",
                "Use vertical space with wall shelves that are secured safely.",
                "Audit zones monthly to keep clutter from creeping back in.",
              ],
              journalPrompt:
                "Which daily moments feel most chaotic now and how could zoning relieve that pressure?",
              applyItems: [
                { id: "map-zones", text: "Map three primary zones and list what belongs in each." },
                { id: "label-plan", text: "Create a labeling system that helpers can understand instantly." },
                { id: "overflow-solution", text: "Decide where overflow items will live outside the nursery." },
              ],
            },
          },
          {
            code: "wardrobe-systems-setup",
            title: "Wardrobe Systems Setup",
            subtitle: "Keep clothing accessible through rapid growth phases.",
            orderIdx: 10,
            estMinutes: 26,
            coverIcon: "hanger",
            content: {
              explore:
                "Build a wardrobe flow that handles frequent outfit changes, donated items, and future sizes without stress.",
              lectureBullets: [
                "Use dividers or bins by size to make morning dressing quick.",
                "Keep a donation basket for outgrown items near the closet.",
                "Prep a weekly capsule of outfits for low-energy days.",
                "Use drawer inserts to prevent tiny items from jumbling.",
                "Track laundry frequency to determine how many basics you need.",
                "Store sentimental pieces separately so they stay pristine.",
                "Label night-time sleepers in a dedicated drawer for partners.",
                "Plan for future sizes by storing vacuum bags out of sight.",
              ],
              journalPrompt:
                "How do I want dressing baby to feel each morning, and what support do I need for that?",
              applyItems: [
                { id: "size-system", text: "Set up bins or dividers for current and next sizes." },
                { id: "capsule-plan", text: "Assemble a five-day outfit capsule for quick mornings." },
                { id: "donation-flow", text: "Choose where outgrown items go and how often you clear them." },
              ],
            },
          },
          {
            code: "intentional-clutter-styling",
            title: "Styling with Intentional Clutter",
            subtitle: "Style surfaces to stay beautiful and functional.",
            orderIdx: 11,
            estMinutes: 24,
            coverIcon: "vignette",
            content: {
              explore:
                "Balance warmth and practicality by styling surfaces with rituals in mind, not just pretty objects.",
              lectureBullets: [
                "Anchor each vignette with a functional tray to corral essentials.",
                "Group items in odd numbers for effortless visual balance.",
                "Rotate sentimental pieces seasonally to keep the room feeling fresh.",
                "Hide utilitarian items behind decorative boxes or baskets.",
                "Layer heights with books, risers, or stacked keepsake boxes.",
                "Match frame finishes to metal accents for cohesion.",
                "Use greenery or florals to add organic movement safely out of reach.",
                "Schedule ten-minute reset rituals to keep styling intact.",
              ],
              journalPrompt:
                "Which surface will I reset nightly, and what cue will remind me to do it?",
              applyItems: [
                { id: "style-surfaces", text: "Style one surface using the tray + odd number method." },
                { id: "sentimental-rotation", text: "Choose two sentimental objects to rotate quarterly." },
                { id: "reset-ritual", text: "Add a calendar reminder for a weekly ten-minute reset." },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: "gear",
    title: "Gear & Registry",
    orderIdx: 2,
    tracks: [
      {
        slug: "gear-foundations",
        title: "Core Gear Foundations",
        orderIdx: 1,
        modules: [
          {
            code: "gear-strategy-kickoff",
            title: "Gear Strategy Kickoff",
            subtitle: "Align values, budget, and daily routines.",
            orderIdx: 1,
            estMinutes: 30,
            coverIcon: "compass",
            content: {
              explore:
                "Clarify what matters most so every registry choice supports how you actually live, not how ads say you should.",
              lectureBullets: [
                "Document your non-negotiables before you comparison shop.",
                "Match gear to lifestyle scenarios like apartments vs. suburbs.",
                "Consider caregiver strengths when delegating product research.",
                "Set a cadence for reviewing advice from mentors or family.",
                "Plan for storage limits so gear never overwhelms your home.",
                "Bundle purchases by timeline: newborn, 3-6 months, 6+ months.",
                "Use try-before-you-buy resources to avoid stroller regret.",
                "Track registry contributions to realign budget as needed.",
                "Keep a running list of must-try gear for future stages.",
                "Schedule periodic declutter checkpoints once baby arrives.",
              ],
              journalPrompt:
                "What does ‘enough’ gear mean to us, and how will we know when we have it?",
              applyItems: [
                { id: "gear-values", text: "Write three values that will guide every gear purchase." },
                { id: "lifestyle-scenarios", text: "List daily lifestyle scenarios gear must support." },
                { id: "review-cadence", text: "Put a monthly registry review on your shared calendar." },
              ],
            },
          },
          {
            code: "registry-platform-guide",
            title: "Registry Platform Deep Dive",
            subtitle: "Choose the best host for your curation style.",
            orderIdx: 2,
            estMinutes: 26,
            coverIcon: "clipboard",
            content: {
              explore:
                "Evaluate registry platforms based on guest experience, completion discounts, and how easily you can update your inventory.",
              lectureBullets: [
                "Universal registries offer flexibility but require maintenance.",
                "Store-specific registries can unlock stacking completion coupons.",
                "Calculate hidden fees for cash funds or group gifting features.",
                "Ensure privacy settings match your comfort level for sharing.",
                "Mobile editing experiences vary widely between platforms.",
                "Some registries sync automatically with retail inventory changes.",
                "Watch for return policies that require unopened packaging.",
                "Consider international guests when choosing retailers.",
                "Plan a guest communication timeline for registry updates.",
                "Document login credentials where partners can access them.",
              ],
              journalPrompt:
                "Which platform aligns with my guests and how do I keep updates effortless?",
              applyItems: [
                { id: "platform-shortlist", text: "Compare pros and cons of two registry platforms." },
                { id: "guest-map", text: "Map where guests live and preferred shopping habits." },
                { id: "update-routine", text: "Outline how and when you will refresh registry inventory." },
              ],
            },
          },
          {
            code: "gear-budget-strategy",
            title: "Budget & Contribution Strategy",
            subtitle: "Blend purchases with registry gifting and resale.",
            orderIdx: 3,
            estMinutes: 28,
            coverIcon: "wallet",
            content: {
              explore:
                "Plan a funding mix that balances gifts, personal purchases, and secondhand finds without awkward conversations.",
              lectureBullets: [
                "Assign price tiers so guests of every budget feel empowered.",
                "Use completion discounts for costly items you plan to self-purchase.",
                "Track secondhand leads in one place to avoid double-buying.",
                "Factor in tax and shipping when estimating final costs.",
                "Bundle requests for big-ticket group gifts with clear instructions.",
                "Communicate thank-you timelines to stay gracious under pressure.",
                "Leverage local buy-nothing groups for short-use gear.",
                "Plan where new gear will live before it arrives at your doorstep.",
                "Stash spare gift cards for later-stage needs like solid feeding.",
              ],
              journalPrompt:
                "How do I want to feel when gifts arrive, and what plan ensures gratitude comes easily?",
              applyItems: [
                { id: "tier-assign", text: "Assign price tiers across your registry categories." },
                { id: "funding-mix", text: "Decide which items you will self-purchase versus leave for guests." },
                { id: "gratitude-plan", text: "Draft a template thank-you note for future personalization." },
              ],
            },
          },
          {
            code: "gear-safety-standards",
            title: "Safety Standards & Certifications",
            subtitle: "Decode regulatory labels before adding to cart.",
            orderIdx: 4,
            estMinutes: 24,
            coverIcon: "shield-check",
            content: {
              explore:
                "Understand the certifications behind sleep, feeding, and travel gear so safety never feels overwhelming.",
              lectureBullets: [
                "Know which certifications are mandatory versus marketing claims.",
                "Check recall databases before purchasing secondhand items.",
                "Familiarize yourself with JPMA and ASTM designations.",
                "Car seats carry expiry dates—log them at time of purchase.",
                "Follow safe sleep standards when purchasing bassinets or cribs.",
                "Ensure baby carriers support ergonomic hip positioning.",
                "Electrical gear should have UL certification for peace of mind.",
                "Register products immediately to receive recall notices.",
                "Store manuals digitally so they are easy to reference.",
              ],
              journalPrompt:
                "Which safety labels confuse me, and what expert or resource can clarify them?",
              applyItems: [
                { id: "certification-cheat", text: "Create a cheat sheet of must-have certifications per category." },
                { id: "recall-check", text: "Bookmark the CPSC recall list and add a quarterly reminder." },
                { id: "manual-storage", text: "Decide where you will store product manuals and expiry dates." },
              ],
            },
          },
          {
            code: "gear-sustainability-plan",
            title: "Sustainability & Resale Planning",
            subtitle: "Build a gear lifecycle from day one.",
            orderIdx: 5,
            estMinutes: 25,
            coverIcon: "leaf",
            content: {
              explore:
                "Design a strategy for passing gear along, recycling packaging, and partnering with circular economy resources.",
              lectureBullets: [
                "Choose materials that can handle cleaning and storage between kids.",
                "Note which brands support trade-in or refurbishment programs.",
                "Document condition at hand-off to future recipients.",
                "Store assembly tools together for simplified reassembly.",
                "Use breathable storage bags to prevent mildew on textiles.",
                "Label boxes clearly with size and season for future you.",
                "Plan a donation or consignment partner in advance.",
                "Communicate gear stories when gifting to make it special.",
              ],
              journalPrompt:
                "How do I want this gear to live on after us, and what systems support that vision?",
              applyItems: [
                { id: "resale-directory", text: "List three resale or donation partners you trust." },
                { id: "storage-plan", text: "Decide how you will store gear between growth stages." },
                { id: "handoff-notes", text: "Create a template note to include when passing gear to someone new." },
              ],
            },
          },
          {
            code: "registry-communication-plan",
            title: "Registry Communication Plan",
            subtitle: "Share updates without overwhelm.",
            orderIdx: 6,
            estMinutes: 22,
            coverIcon: "megaphone",
            content: {
              explore:
                "Craft a warm communication cadence so friends and family know how to support you without awkward follow-ups.",
              lectureBullets: [
                "Lead with gratitude in every registry update to set the tone.",
                "Segment messaging for close relatives versus acquaintances.",
                "Use visuals or short videos to highlight priority items.",
                "Offer non-purchase ways to help for guests on a budget.",
                "Set boundaries for unsolicited advice with kindness.",
                "Create a FAQ to answer common questions once.",
                "Choose your channel: email, group text, or registry platform tools.",
                "Schedule a final reminder three weeks before your event date.",
              ],
              journalPrompt:
                "What language feels true to me when asking for support, and how can I keep it easy to send?",
              applyItems: [
                { id: "message-template", text: "Draft a registry update message you can reuse." },
                { id: "support-options", text: "List non-monetary support ideas to include in messaging." },
                { id: "timeline", text: "Create a communication timeline with three touchpoints." },
              ],
            },
          },
        ],
      },
      {
        slug: "travel-mobility",
        title: "Travel & Mobility",
        orderIdx: 2,
        modules: [
          {
            code: "stroller-masterclass",
            title: "Stroller Systems Decoded",
            subtitle: "Match frame, seat, and lifestyle.",
            orderIdx: 7,
            estMinutes: 30,
            coverIcon: "stroller",
            content: {
              explore:
                "Evaluate strollers based on terrain, folding mechanisms, travel systems, and storage to avoid costly swaps.",
              lectureBullets: [
                "List your primary walking surfaces to pick the right wheel suspension.",
                "Compare fold mechanisms for car, apartment, or travel constraints.",
                "Check car seat compatibility charts before assuming adapters exist.",
                "Assess undercarriage storage for groceries and diaper bags.",
                "Test handle height adjustments for both caregivers.",
                "Consider future family growth—will you need tandem options?",
                "Note airline gate-check policies for frequent flyers.",
                "Weigh stroller weight against who will lift it regularly.",
                "Check accessory ecosystem for weather covers or ride-alongs.",
              ],
              journalPrompt:
                "Where will we use our stroller most, and what will success feel like on those days?",
              applyItems: [
                { id: "terrain-audit", text: "Audit daily routes and note required wheel performance." },
                { id: "fold-test", text: "Test the fold of two shortlisted strollers in person or via demo." },
                { id: "adapter-check", text: "Confirm car seat adapter availability before purchasing." },
              ],
            },
          },
          {
            code: "car-seat-confidence",
            title: "Car Seat Confidence",
            subtitle: "Understand installation, expiration, and travel tips.",
            orderIdx: 8,
            estMinutes: 28,
            coverIcon: "car-seat",
            content: {
              explore:
                "Car seats protect your little one in every travel moment—master installation, fit checks, and ongoing maintenance.",
              lectureBullets: [
                "Choose a seat based on your vehicle make and passenger layout.",
                "Decide between infant bucket and convertible seats early.",
                "Schedule a certified tech appointment for installation help.",
                "Harness fit should pass the pinch test every ride.",
                "Replace seats immediately after any moderate collision.",
                "Log expiration dates and register the seat with the manufacturer.",
                "Understand airline policies for bringing seats on board.",
                "Pack travel bags or covers to protect seats in transit.",
                "Practice installing with LATCH and seatbelt methods.",
              ],
              journalPrompt:
                "What obstacles keep me from feeling confident installing our seat, and how can I remove them?",
              applyItems: [
                { id: "vehicle-measure", text: "Measure backseat width and note overlapping buckles." },
                { id: "tech-appointment", text: "Book a car seat technician session before baby arrives." },
                { id: "expiration-log", text: "Record seat expiration and add a calendar reminder." },
              ],
            },
          },
          {
            code: "babywearing-systems",
            title: "Babywearing Systems",
            subtitle: "Select carriers for every season.",
            orderIdx: 9,
            estMinutes: 23,
            coverIcon: "wrap",
            content: {
              explore:
                "Compare wraps, slings, and structured carriers so you stay comfortable while keeping baby close on the go.",
              lectureBullets: [
                "Newborn wraps offer snuggle-first bonding but require practice.",
                "Ring slings shine for quick ups during errands or around the house.",
                "Structured carriers provide back support for longer outings.",
                "Breathable fabrics matter in warmer climates.",
                "Hip-healthy positioning keeps knees higher than hips.",
                "Practice with a weighted doll before baby arrives.",
                "Adjust straps with both caregivers to avoid mid-outing tweaks.",
                "Consider babywearing educators for tailored fit support.",
              ],
              journalPrompt:
                "When do I imagine wearing baby most, and how long will those stretches last?",
              applyItems: [
                { id: "carrier-trial", text: "Test two carrier styles for ten minutes each." },
                { id: "fit-check", text: "Mark strap placements that feel comfortable for both caregivers." },
                { id: "practice-plan", text: "Schedule three practice sessions before baby arrives." },
              ],
            },
          },
          {
            code: "on-the-go-organization",
            title: "On-the-Go Organization",
            subtitle: "Pack bags that support every outing.",
            orderIdx: 10,
            estMinutes: 22,
            coverIcon: "backpack",
            content: {
              explore:
                "Design diaper bag systems that keep essentials within reach and transitions stress-free.",
              lectureBullets: [
                "Choose a bag style that matches your carrying preferences.",
                "Create grab-and-go pouches by category (feeding, diapering, calm).",
                "Restock during nightly reset while memories are fresh.",
                "Keep a backup mini kit in the car or stroller basket.",
                "Rotate seasonal items like sunscreen or extra layering pieces.",
                "Use waterproof pouches for clothing changes or pump parts.",
                "Add a quick inventory card inside the bag for caregivers.",
                "Set a weekly sanitizing routine for pacifiers and bottles.",
              ],
              journalPrompt:
                "What does a smooth exit from the house look like, and how can the bag coach us through it?",
              applyItems: [
                { id: "pouch-system", text: "Assemble category-based pouches for your main diaper bag." },
                { id: "reset-ritual", text: "Choose a nightly reset cue to restock essentials." },
                { id: "backup-kit", text: "Build a compact backup kit for car or stroller storage." },
              ],
            },
          },
          {
            code: "travel-logistics-playbook",
            title: "Travel Logistics Playbook",
            subtitle: "Plan flights, road trips, and overnights.",
            orderIdx: 11,
            estMinutes: 27,
            coverIcon: "plane",
            content: {
              explore:
                "Create rituals for travel days—including packing, sleep adjustments, and gear protection—so adventures feel doable.",
              lectureBullets: [
                "Start adjusting naps two days before red-eye flights.",
                "Pack duplicates of key soothing items in separate bags.",
                "Know TSA rules for milk, formula, and medical supplies.",
                "Use wearable reminders for feeding or medication schedules.",
                "Reserve cribs or sleep rentals ahead of time.",
                "Call hotels about blackout options or bring portable shades.",
                "Confirm car seat guidelines with rideshare or rental companies.",
                "Plan buffer days for re-entry once home.",
              ],
              journalPrompt:
                "What worries me most about traveling with baby, and which routine can soothe it?",
              applyItems: [
                { id: "travel-checklist", text: "Draft a packing checklist for flights and road trips." },
                { id: "sleep-adjust", text: "Outline how you will shift sleep before and after travel." },
                { id: "gear-protect", text: "Decide how you will protect gear during transit." },
              ],
            },
          },
          {
            code: "outdoor-adventure-setup",
            title: "Outdoor Adventure Setup",
            subtitle: "Gear for hikes, beach days, and park hangs.",
            orderIdx: 12,
            estMinutes: 21,
            coverIcon: "mountains",
            content: {
              explore:
                "Plan outdoor setups that balance safety, comfort, and spontaneity from backyard hangs to weekend hikes.",
              lectureBullets: [
                "Sun protection includes UPF clothing, hats, and shade structures.",
                "Portable sound machines help recreate nap cues outdoors.",
                "Compact foldable mats keep gear sand-free at the beach.",
                "Hydration plans matter for breastfeeding parents and bottle-fed babies.",
                "Baby carriers with lumbar support extend adventure time comfortably.",
                "Bug protection should be age-appropriate and dermatologist approved.",
                "Pack layers for shifting temperatures, especially near water.",
                "Create a post-adventure cleanup kit for the ride home.",
              ],
              journalPrompt:
                "How do I want outdoor time to feel, and what gear helps us stay longer joyfully?",
              applyItems: [
                { id: "outdoor-kit", text: "Assemble an outdoor adventure kit stored by the door." },
                { id: "shade-plan", text: "Choose shade strategies for park days and beach trips." },
                { id: "cleanup-kit", text: "Pack a cleanup bag with wipes, trash bags, and change of clothes." },
              ],
            },
          },
        ],
      },
      {
        slug: "feeding-comfort",
        title: "Feeding & Comfort",
        orderIdx: 3,
        modules: [
          {
            code: "feeding-philosophy-foundations",
            title: "Feeding Philosophy Foundations",
            subtitle: "Align your approach before bottles and pumps arrive.",
            orderIdx: 13,
            estMinutes: 28,
            coverIcon: "bottle",
            content: {
              explore:
                "Clarify lactation goals, partner roles, and backup plans to reduce stress once baby arrives hungry.",
              lectureBullets: [
                "Identify your feeding goals and write them somewhere visible.",
                "Discuss nighttime responsibilities openly with support partners.",
                "Consult lactation specialists early if desired.",
                "Stock a mix of bottle nipple flows to match baby cues.",
                "Prep a pumping station that respects ergonomics and privacy.",
                "Plan sterilizing routines that fit your schedule.",
                "Keep formula or donor milk plans accessible, even if backup.",
                "Normalize pivots; flexibility is a sign of responsive parenting.",
              ],
              journalPrompt:
                "How do I define feeding success, and what support helps me stay compassionate with myself?",
              applyItems: [
                { id: "feeding-manifesto", text: "Write a compassionate statement about your feeding goals." },
                { id: "partner-roles", text: "Map three concrete support roles partners or friends can play." },
                { id: "pumping-station", text: "Designate a pumping or feeding station with supplies stocked." },
              ],
            },
          },
          {
            code: "bottle-sterilizing-systems",
            title: "Bottles & Sterilizing Systems",
            subtitle: "Set up efficient cleaning workflows.",
            orderIdx: 14,
            estMinutes: 24,
            coverIcon: "sparkle",
            content: {
              explore:
                "Plan bottle rotations, drying stations, and sterilizing cadences that fit your space and energy.",
              lectureBullets: [
                "Keep at least eight bottles for full-day coverage.",
                "Match nipple flow to age but watch baby cues first.",
                "Use compact sterilizers if counter space is limited.",
                "Dedicate a drying rack exclusively to feeding supplies.",
                "Batch cleanings to avoid feeling tethered to the sink.",
                "Track bottle inventory to replace worn parts on time.",
                "Sterilize pump parts alongside bottle gear for efficiency.",
                "Label daycare bottles with dishwasher-safe markers.",
              ],
              journalPrompt:
                "What time of day do I have patience for cleaning, and how can the system support that?",
              applyItems: [
                { id: "bottle-count", text: "Inventory bottle sizes and flows you currently own." },
                { id: "sterilizing-cadence", text: "Choose a sterilizing frequency that fits your routine." },
                { id: "drying-zone", text: "Set up a dedicated drying zone that stays clutter-free." },
              ],
            },
          },
          {
            code: "breast-pump-blueprint",
            title: "Breast Pump Blueprint",
            subtitle: "Customize flange fit and pumping cadence.",
            orderIdx: 15,
            estMinutes: 27,
            coverIcon: "pump",
            content: {
              explore:
                "Dial in pump fit, timing, and replacement schedules so sessions are comfortable and productive.",
              lectureBullets: [
                "Measure flange size with a printable guide before baby arrives.",
                "Create a pump parts replacement schedule by weeks post-birth.",
                "Hands-free bras improve mobility and reduce strain.",
                "Portable pumps trade suction strength for flexibility; plan accordingly.",
                "Track pumping sessions to spot supply trends early.",
                "Hydration and snacks near the pump station maintain stamina.",
                "Store milk safely following CDC guidelines.",
                "Plan pump bag organization for work or travel transitions.",
              ],
              journalPrompt:
                "What would make pumping feel supported, and who can help me keep that system running?",
              applyItems: [
                { id: "flange-fit", text: "Confirm flange sizing with a lactation consultant or measurement tool." },
                { id: "parts-calendar", text: "Set reminders to replace membranes, valves, and tubing." },
                { id: "pump-bag", text: "Pack a pump bag with labeled compartments and backups." },
              ],
            },
          },
          {
            code: "solid-feeding-prep",
            title: "Solid Feeding Prep",
            subtitle: "Gear up for baby-led exploration.",
            orderIdx: 16,
            estMinutes: 25,
            coverIcon: "spoon",
            content: {
              explore:
                "Gather essentials for introducing solids—chairs, utensils, storage—while keeping cleanup manageable.",
              lectureBullets: [
                "High chair ergonomics support stable posture and safe swallowing.",
                "Use splash mats or easy-clean rugs under feeding zones.",
                "Silicone bibs with pockets minimize outfit changes.",
                "Batch prep freezer portions with silicone trays.",
                "Introduce open cups early to develop oral motor skills.",
                "Keep allergen introduction tracking simple and visible.",
                "Offer sensory tools to keep baby engaged between bites.",
                "Plan a cleanup routine that includes the floor and chair straps.",
              ],
              journalPrompt:
                "How adventurous do I want meals to feel, and what cleanup support do I need in place?",
              applyItems: [
                { id: "high-chair-fit", text: "Check that your high chair supports foot positioning and straps." },
                { id: "allergen-tracker", text: "Create a tracker for allergen introduction and reactions." },
                { id: "cleanup-kit", text: "Assemble a post-meal cleanup kit with cloths and sanitizing spray." },
              ],
            },
          },
          {
            code: "soothing-comfort-tools",
            title: "Soothing & Comfort Tools",
            subtitle: "Curate items that calm baby and caregivers.",
            orderIdx: 17,
            estMinutes: 23,
            coverIcon: "heart",
            content: {
              explore:
                "Build a toolkit of swaddles, sound, and sensory items that support regulation without overstimulation.",
              lectureBullets: [
                "Swaddles vary in stretch—match to baby's startle reflex needs.",
                "White noise machines should offer consistent volume control.",
                "Paced bottle feeding reduces gas and discomfort.",
                "Use pacifiers recommended by pediatric dentists.",
                "Create a calm-down basket with textured toys and loveys.",
                "Monitor room humidity to prevent dry air discomfort.",
                "Caregivers need comfort too—stock cozy blankets and cushions.",
                "Rotate tools so baby stays engaged without overwhelm.",
              ],
              journalPrompt:
                "What helps me regulate when stressed, and how can I mirror that for baby?",
              applyItems: [
                { id: "swaddle-plan", text: "Choose two swaddle styles to rotate based on baby's cues." },
                { id: "calm-down-basket", text: "Assemble a comfort basket for caregivers and baby." },
                { id: "humidity-check", text: "Measure room humidity and adjust with a humidifier if needed." },
              ],
            },
          },
          {
            code: "night-feed-logistics",
            title: "Night Feed Logistics",
            subtitle: "Reduce friction during overnight care.",
            orderIdx: 18,
            estMinutes: 21,
            coverIcon: "moon-stars",
            content: {
              explore:
                "Set up night feed stations, lighting, and cue cards to keep sleepy caregivers on the same page.",
              lectureBullets: [
                "Keep a dedicated night feeding cart stocked and mobile.",
                "Use soft amber lighting to protect melatonin production.",
                "Prep bottles or pumping parts before bedtime where possible.",
                "Document medication or supplement schedules near the station.",
                "Use wearable timers to pace dream feeds or pumping sessions.",
                "Keep burp cloths in multiple zones for quick access.",
                "Log night feeds briefly to share with daytime partners.",
                "Add affirmations or photos to remind you why you are doing this.",
              ],
              journalPrompt:
                "When I imagine 3 a.m., what support do I want to feel within reach?",
              applyItems: [
                { id: "night-cart", text: "Stock a night feed cart with essentials and label each shelf." },
                { id: "lighting-choice", text: "Select an amber night light and place it within reach." },
                { id: "cue-card", text: "Create a cue card with feeding steps or soothing reminders." },
              ],
            },
          },
        ],
      },
      {
        slug: "safety-monitoring",
        title: "Safety & Monitoring",
        orderIdx: 4,
        modules: [
          {
            code: "monitor-selection-setup",
            title: "Monitor Selection & Setup",
            subtitle: "Choose tech that calms, not alarms.",
            orderIdx: 19,
            estMinutes: 24,
            coverIcon: "monitor",
            content: {
              explore:
                "Evaluate video, audio, and wearable monitors for privacy, reliability, and how they fit into your sleep strategy.",
              lectureBullets: [
                "Decide between Wi-Fi and closed-circuit monitors based on internet reliability.",
                "Check encryption standards for connected devices.",
                "Mount cameras with safe cord management and clear sightlines.",
                "Consider night vision quality for overnight reassurance.",
                "Wearable sensors should complement, not replace, safe sleep habits.",
                "Set notification thresholds that prevent unnecessary panic.",
                "Test backup battery plans for power outages.",
                "Decide who gets alerts—phones, tablets, or shared devices.",
              ],
              journalPrompt:
                "What data helps me feel secure, and when does it cross into overwhelm?",
              applyItems: [
                { id: "monitor-criteria", text: "Write your top five monitor must-haves." },
                { id: "camera-placement", text: "Choose camera placement and ensure cords are anchored." },
                { id: "alert-plan", text: "Set alert preferences and share them with caregiving partners." },
              ],
            },
          },
          {
            code: "home-safety-walkthrough",
            title: "Home Safety Walkthrough",
            subtitle: "Baby-proof with developmental milestones in mind.",
            orderIdx: 20,
            estMinutes: 26,
            coverIcon: "home-shield",
            content: {
              explore:
                "Walk through every room to anticipate safety upgrades before crawling begins.",
              lectureBullets: [
                "Anchor furniture before baby pulls to stand.",
                "Install outlet covers that stay put during toddler exploration.",
                "Use magnetic locks or latches for chemical storage.",
                "Secure cords and blind pulls out of reach.",
                "Check floor heights for gates at stairs or sunken living rooms.",
                "Choose soft corner guards that match your aesthetic.",
                "Keep houseplants vetted for non-toxicity.",
                "Create a choking hazard sweep routine after gatherings.",
              ],
              journalPrompt:
                "Which areas of our home feel most hazardous, and what order will I tackle them in?",
              applyItems: [
                { id: "safety-audit", text: "Conduct a room-by-room safety audit with notes." },
                { id: "priority-list", text: "Rank safety upgrades by urgency and assign due dates." },
                { id: "hazard-bin", text: "Set up a bin for small objects to keep off the floor." },
              ],
            },
          },
          {
            code: "health-medicine-cabinet",
            title: "Health & Medicine Cabinet",
            subtitle: "Stock supplies for calm, confident care.",
            orderIdx: 21,
            estMinutes: 23,
            coverIcon: "first-aid",
            content: {
              explore:
                "Build a medicine cabinet with infant-safe supplies, caregiver education, and documentation ready for pediatric visits.",
              lectureBullets: [
                "Keep a digital document with pediatrician, nurse line, and after-hours clinics.",
                "Stock thermometers, nasal aspirators, and saline drops.",
                "Use locked storage for medications away from heat and light.",
                "Track dosage charts for weight changes over time.",
                "Include caregiver comfort items like snacks and tea.",
                "Prepare a quick grab sick kit for car or travel use.",
                "Store insurance cards and medical history in one place.",
                "Review expiration dates each season and restock as needed.",
              ],
              journalPrompt:
                "How do I want to feel the first night baby spikes a fever, and what setup supports that?",
              applyItems: [
                { id: "pediatric-contacts", text: "List pediatric contacts and post them on the fridge or command center." },
                { id: "cabinet-stock", text: "Stock essential medical items and label dosage tools." },
                { id: "sick-kit", text: "Assemble a grab-and-go sick kit for the car or diaper bag." },
              ],
            },
          },
          {
            code: "emergency-preparedness-plan",
            title: "Emergency Preparedness",
            subtitle: "Create plans for storms, outages, and evacuations.",
            orderIdx: 22,
            estMinutes: 29,
            coverIcon: "alert",
            content: {
              explore:
                "Prepare for emergencies with evacuation checklists, backup power, and communication plans including your wider village.",
              lectureBullets: [
                "Outline evacuation routes and meetup points for your household.",
                "Pack go-bags with diapers, formula, medications, and documents.",
                "Store backup batteries or power banks for monitors and pumps.",
                "Keep paper copies of emergency contacts and medical info.",
                "Rotate shelf-stable feeding supplies every six months.",
                "Identify neighbors or friends who can assist quickly.",
                "Practice drills to ensure gear fits in vehicles as planned.",
                "Include comfort items to calm baby during disruptions.",
              ],
              journalPrompt:
                "Which emergency scenario worries me most, and what step today reduces that anxiety?",
              applyItems: [
                { id: "go-bag", text: "Assemble a family go-bag with baby-specific supplies." },
                { id: "power-plan", text: "Acquire backup power solutions for critical devices." },
                { id: "drill-schedule", text: "Schedule a seasonal emergency plan review with your household." },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: "postpartum",
    title: "Postpartum Care",
    orderIdx: 3,
    tracks: [
      {
        slug: "recovery-wellness",
        title: "Recovery & Wellness",
        orderIdx: 1,
        modules: [
          {
            code: "fourth-trimester-roadmap",
            title: "Fourth Trimester Roadmap",
            subtitle: "Normalize the first twelve weeks.",
            orderIdx: 1,
            estMinutes: 30,
            coverIcon: "calendar",
            content: {
              explore:
                "Understand the physical and emotional rhythms of early postpartum so expectations feel compassionate and realistic.",
              lectureBullets: [
                "Healing is not linear—build flexible support plans.",
                "Hormonal shifts can mimic anxiety; know when to call for help.",
                "Sleep recovery takes time even with supportive partners.",
                "Nourishment rhythms support milk production and mood.",
                "Ask visitors to deliver meals or run errands instead of hold baby.",
                "Document wins to counter the brain's negativity bias.",
                "Use gentle movement once cleared by care providers.",
                "Schedule postpartum checkups before birth to lock in support.",
              ],
              journalPrompt:
                "What do I need most during the fourth trimester, and how will I ask for it?",
              applyItems: [
                { id: "support-map", text: "Map who to call for meals, childcare, and emotional support." },
                { id: "rest-ritual", text: "Plan a daily rest ritual even if it is only ten minutes." },
                { id: "checkup-dates", text: "Book postpartum provider appointments in advance." },
              ],
            },
          },
          {
            code: "body-recovery-basics",
            title: "Body Recovery Basics",
            subtitle: "Care for your healing body with intention.",
            orderIdx: 2,
            estMinutes: 27,
            coverIcon: "lotus",
            content: {
              explore:
                "Equip yourself with recovery tools, pelvic floor awareness, and body-neutral language that honors healing pace.",
              lectureBullets: [
                "Create a bathroom basket with pads, peri bottles, and sprays.",
                "Ice packs and heat therapy each have specific healing windows.",
                "Pelvic floor therapists support both vaginal and cesarean recovery.",
                "Scar massage should wait until medically cleared.",
                "Posture adjustments reduce back pain from feeding sessions.",
                "Hydration supports tissue repair and milk supply.",
                "Track symptoms that warrant provider follow-up.",
                "Affirmations anchor you in appreciation for your healing body.",
              ],
              journalPrompt:
                "What words will I use to thank my body for the work it is doing?",
              applyItems: [
                { id: "recovery-kit", text: "Set up a recovery kit in both bathroom and bedside zones." },
                { id: "therapist-research", text: "Research pelvic floor therapists covered by your insurance." },
                { id: "posture-cues", text: "Note posture cues to review during feeding or pumping." },
              ],
            },
          },
          {
            code: "postpartum-nutrition-hydration",
            title: "Nutrition & Hydration",
            subtitle: "Fuel healing and energy.",
            orderIdx: 3,
            estMinutes: 23,
            coverIcon: "tea",
            content: {
              explore:
                "Build simple meal plans and snack stations that nourish your recovering body without relying on willpower.",
              lectureBullets: [
                "Batch cook freezer meals before birth if possible.",
                "Snack stations near feeding areas support calorie needs.",
                "Warm, easy-to-digest foods may aid recovery.",
                "Hydration goals increase for lactating parents.",
                "Supplement routines should be provider-approved.",
                "Ask visitors to drop meals with reheating instructions.",
                "Track reactions to new foods while monitoring baby cues.",
                "Celebrate small wins like drinking water before coffee.",
              ],
              journalPrompt:
                "Which meals feel comforting and easy, and how can I multiply them?",
              applyItems: [
                { id: "freezer-plan", text: "Plan three freezer-friendly meals to prep or request." },
                { id: "snack-stations", text: "Create two snack stations stocked with grab-and-go options." },
                { id: "hydration-tracker", text: "Set a hydration tracker reminder on your phone or bottle." },
              ],
            },
          },
          {
            code: "mental-health-monitoring",
            title: "Mental Health Monitoring",
            subtitle: "Build proactive checkpoints.",
            orderIdx: 4,
            estMinutes: 26,
            coverIcon: "brain-heart",
            content: {
              explore:
                "Honor your mental health by planning check-ins, crisis contacts, and stigma-free language before baby arrives.",
              lectureBullets: [
                "Differentiate baby blues from postpartum mood disorders.",
                "Share warning signs with partners or trusted friends.",
                "Telehealth therapy expands access during sleepless seasons.",
                "Sleep deprivation mimics anxiety—track patterns honestly.",
                "Grief, identity shifts, and joy can coexist simultaneously.",
                "Create a coping menu for moments of overwhelm.",
                "List crisis hotlines and local resources in visible places.",
                "Medication can be part of a healthy postpartum plan.",
              ],
              journalPrompt:
                "How will I know I need help, and who gets the first call?",
              applyItems: [
                { id: "warning-signs", text: "Write personal warning signs and share them with your support circle." },
                { id: "resource-list", text: "Compile mental health resources and hotline numbers." },
                { id: "coping-menu", text: "Create a coping menu with five options for tough moments." },
              ],
            },
          },
          {
            code: "sleep-recovery-strategies",
            title: "Sleep Recovery Strategies",
            subtitle: "Protect rest even in fragmented nights.",
            orderIdx: 5,
            estMinutes: 24,
            coverIcon: "zzz",
            content: {
              explore:
                "Find micro-rest opportunities, partner exchanges, and nap setups that respect your healing timeline.",
              lectureBullets: [
                "Plan caregiver shifts where possible to extend sleep cycles.",
                "Use blackout curtains and white noise to maximize naps.",
                "Reset caffeine expectations for postpartum sensitivity.",
                "Naps count—aim for thirty-minute windows between feedings.",
                "Communicate rest needs clearly without apology.",
                "Practice relaxing breathing to fall asleep faster.",
                "Keep devices outside the bedroom when possible.",
                "Track restorative moments, not just hours slept.",
              ],
              journalPrompt:
                "What would make rest feel non-negotiable, and how will I protect it?",
              applyItems: [
                { id: "shift-calendar", text: "Create a shift calendar that includes restorative breaks." },
                { id: "nap-space", text: "Designate a nap-friendly space with essentials ready." },
                { id: "relax-ritual", text: "Choose a pre-sleep ritual to cue your body for rest." },
              ],
            },
          },
          {
            code: "movement-core-rehab",
            title: "Movement & Core Rehab",
            subtitle: "Reconnect with strength safely.",
            orderIdx: 6,
            estMinutes: 25,
            coverIcon: "stretch",
            content: {
              explore:
                "Ease back into movement with professional guidance, breathwork, and realistic expectations for energy levels.",
              lectureBullets: [
                "Start with breath and pelvic floor engagement once cleared.",
                "Seek diastasis recti assessments from trained professionals.",
                "Micro workouts count—habit stacking builds momentum.",
                "Supportive footwear reduces joint pain after pregnancy.",
                "Track how movement impacts mood to motivate future sessions.",
                "Use babywearing or stroller walks for gentle cardio.",
                "Hydrate before and after workouts to aid recovery.",
                "Celebrate strength markers beyond body size.",
              ],
              journalPrompt:
                "What motivates me to move, and how can I honor that without pressure?",
              applyItems: [
                { id: "movement-menu", text: "List gentle movement options cleared by your provider." },
                { id: "habit-stack", text: "Pair core exercises with an existing daily habit." },
                { id: "progress-log", text: "Track how movement makes you feel in a shared log." },
              ],
            },
          },
        ],
      },
      {
        slug: "support-systems",
        title: "Support Systems & Identity",
        orderIdx: 2,
        modules: [
          {
            code: "relationship-check-ins",
            title: "Relationship Check-Ins",
            subtitle: "Keep communication kind and clear.",
            orderIdx: 7,
            estMinutes: 23,
            coverIcon: "chat",
            content: {
              explore:
                "Create rhythms for checking in with partners, support people, and yourself as identities shift in early parenthood.",
              lectureBullets: [
                "Schedule weekly debriefs separate from logistical planning.",
                "Use I-statements and appreciation to open conversations.",
                "Clarify expectations around intimacy and alone time.",
                "Invite partners to share feelings without fixing everything.",
                "Celebrate micro wins together to build resilience.",
                "Know when to bring in counseling for neutral support.",
                "Hold space for grief about old routines while embracing new ones.",
                "Create a family mission statement as a guiding compass.",
              ],
              journalPrompt:
                "What do I need to hear each week to feel seen by my partner or support system?",
              applyItems: [
                { id: "checkin-agenda", text: "Draft a weekly check-in agenda with gratitude, needs, and logistics." },
                { id: "appreciation-note", text: "Write an appreciation note to your partner or core support person." },
                { id: "mission-draft", text: "Start a family mission statement that honors your values." },
              ],
            },
          },
          {
            code: "village-building-boundaries",
            title: "Village Building & Boundaries",
            subtitle: "Invite support while protecting your peace.",
            orderIdx: 8,
            estMinutes: 24,
            coverIcon: "village",
            content: {
              explore:
                "Curate a village who knows how to show up for you, respecting your boundaries, culture, and recovery pace.",
              lectureBullets: [
                "List the types of support you need: meals, chores, emotional care.",
                "Create scripts for saying yes, no, or not yet.",
                "Offer guests a job list to direct their energy.",
                "Set visiting hours that respect your feeding or rest schedule.",
                "Use shared calendars for helpers to claim tasks.",
                "Honor cultural traditions that bring you comfort.",
                "Review boundaries regularly as capacity shifts.",
                "Express gratitude without overexplaining your needs.",
              ],
              journalPrompt:
                "Who feels like a safe support right now, and what do I need from them?",
              applyItems: [
                { id: "support-roster", text: "Build a roster of helpers with contact details and preferred tasks." },
                { id: "boundary-script", text: "Practice a boundary script for declining surprise visits." },
                { id: "task-board", text: "Create a visible task board guests can reference." },
              ],
            },
          },
          {
            code: "return-to-work-planning",
            title: "Return-to-Work Planning",
            subtitle: "Make re-entry compassionate and strategic.",
            orderIdx: 9,
            estMinutes: 28,
            coverIcon: "briefcase",
            content: {
              explore:
                "Prepare for return-to-work decisions with pumping logistics, childcare coordination, and mindset shifts.",
              lectureBullets: [
                "Clarify your legal rights for pumping breaks and leave.",
                "Choose childcare that reflects your family's values.",
                "Practice your morning routine before the first day back.",
                "Communicate boundaries with colleagues early.",
                "Plan backup childcare options for inevitable sick days.",
                "Keep a photo or scent of baby nearby for emotional regulation.",
                "Assess wardrobe needs that support pumping or comfortable feeding.",
                "Schedule self-reviews to celebrate progress each month.",
              ],
              journalPrompt:
                "What would a successful return to work look like in ninety days?",
              applyItems: [
                { id: "childcare-plan", text: "Confirm childcare logistics, contacts, and transition dates." },
                { id: "pump-schedule", text: "Draft a sample pump or break schedule for workdays." },
                { id: "morning-rehearsal", text: "Rehearse your morning routine two weeks before returning." },
              ],
            },
          },
          {
            code: "identity-integration",
            title: "Identity Integration",
            subtitle: "Honor the layers of who you are becoming.",
            orderIdx: 10,
            estMinutes: 22,
            coverIcon: "layers-heart",
            content: {
              explore:
                "Blend pre-baby identity with new roles by reflecting on values, rituals, and creative expression.",
              lectureBullets: [
                "Name parts of yourself you want to nurture in this season.",
                "Create rituals that reconnect you with passions or hobbies.",
                "Capture stories in journals or voice notes to witness growth.",
                "Seek communities where your interests overlap with parenting.",
                "Redefine productivity to include presence and rest.",
                "Set personal goals that feel gentle yet energizing.",
                "Invite partners to reflect on their evolving identities too.",
                "Celebrate resilience with tangible reminders or keepsakes.",
              ],
              journalPrompt:
                "Who am I becoming, and what practices make me proud of that evolution?",
              applyItems: [
                { id: "identity-words", text: "Choose three words that describe your current identity blend." },
                { id: "ritual-plan", text: "Design a weekly ritual that reconnects you to a beloved hobby." },
                { id: "story-capture", text: "Record a voice memo about a recent parenting win or lesson." },
              ],
            },
          },
          {
            code: "financial-transitions",
            title: "Financial Transitions",
            subtitle: "Adapt budgets for growing needs.",
            orderIdx: 11,
            estMinutes: 26,
            coverIcon: "calculator",
            content: {
              explore:
                "Align your financial plan with parental leave, childcare costs, and future savings goals without losing sight of joy spending.",
              lectureBullets: [
                "Update budgets with new recurring costs like diapers and childcare.",
                "Track medical bills to leverage FSA/HSA benefits.",
                "Set aside fun money for family experiences, not just essentials.",
                "Review insurance coverage for dependents and disability.",
                "Automate savings for education or emergency funds when possible.",
                "Plan a monthly money date with your partner or support person.",
                "Explore employer benefits like dependent care FSAs.",
                "Celebrate financial wins to stay motivated.",
              ],
              journalPrompt:
                "What money habits help me feel steady, and how can we protect them?",
              applyItems: [
                { id: "budget-refresh", text: "Refresh your budget with new recurring baby-related expenses." },
                { id: "benefits-review", text: "Review employer benefits and submit required paperwork." },
                { id: "money-date", text: "Schedule a monthly money date to review and celebrate progress." },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: "community",
    title: "Community & Mentorship",
    orderIdx: 4,
    tracks: [
      {
        slug: "mentor-intro",
        title: "Mentor Introduction",
        orderIdx: 1,
        modules: [
          {
            code: "mentor-collective-welcome",
            title: "Meet Your Mentor Collective",
            subtitle: "Discover how to engage with the community.",
            orderIdx: 1,
            estMinutes: 18,
            coverIcon: "users",
            content: {
              explore:
                "Learn the rhythms, etiquette, and support styles inside the Taylor-Made community so you feel confident reaching out.",
              lectureBullets: [
                "Mentors respond within 24 hours on weekdays.",
                "Tag posts with categories for faster guidance.",
                "Use mentor office hours for deep dives.",
                "Celebrate wins publicly to inspire others.",
                "DMs are for quick clarifications, not emergencies.",
                "Anonymous posting is available for sensitive topics.",
                "Review community guidelines quarterly for updates.",
                "Share feedback so mentors can tailor resources.",
              ],
              journalPrompt:
                "How do I want to show up inside this community, and what support feels most nourishing?",
              applyItems: [
                { id: "introduce-self", text: "Draft a community introduction post highlighting current goals." },
                { id: "bookmark-guidelines", text: "Bookmark the community guidelines for easy reference." },
                { id: "office-hours", text: "Add upcoming mentor office hours to your calendar." },
              ],
            },
          },
        ],
      },
    ],
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    for (const journey of academyData) {
      await trx("journeys")
        .insert({
          slug: journey.slug,
          title: journey.title,
          order_idx: journey.orderIdx,
        })
        .onConflict("slug")
        .merge({
          title: journey.title,
          order_idx: journey.orderIdx,
        });

      const journeyRecord = await trx("journeys")
        .where({ slug: journey.slug })
        .first();

      for (const track of journey.tracks) {
        await trx("tracks")
          .insert({
            slug: track.slug,
            title: track.title,
            order_idx: track.orderIdx,
            journey_id: journeyRecord.id,
          })
          .onConflict("slug")
          .merge({
            title: track.title,
            order_idx: track.orderIdx,
            journey_id: journeyRecord.id,
          });

        const trackRecord = await trx("tracks")
          .where({ slug: track.slug })
          .first();

        for (const module of track.modules) {
          await trx("modules")
            .insert({
              code: module.code,
              title: module.title,
              subtitle: module.subtitle,
              order_idx: module.orderIdx,
              est_minutes: module.estMinutes,
              cover_icon: module.coverIcon,
              track_id: trackRecord.id,
            })
            .onConflict("code")
            .merge({
              title: module.title,
              subtitle: module.subtitle,
              order_idx: module.orderIdx,
              est_minutes: module.estMinutes,
              cover_icon: module.coverIcon,
              track_id: trackRecord.id,
            });

          const moduleRecord = await trx("modules")
            .where({ code: module.code })
            .first();

          const contentPayload = {
            module_id: moduleRecord.id,
            explore: module.content.explore,
            lecture: { bullets: module.content.lectureBullets },
            journal_prompt: module.content.journalPrompt,
            apply: { items: module.content.applyItems },
          };

          await trx("module_content")
            .insert(contentPayload)
            .onConflict("module_id")
            .merge(contentPayload);
        }
      }
    }
  });
}
