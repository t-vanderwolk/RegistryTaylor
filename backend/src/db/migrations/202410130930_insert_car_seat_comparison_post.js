exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  const existing = await knex('blog_posts').where({ slug: 'car-seats-simplified' }).first('id');
  if (existing) return;

  const content = `# 🚗 *Car Seats, Simplified:*
### How to choose infant, convertible, rotating, one-for-life, booster, and travel seats with Taylor-Made ease

Car seat shopping should feel intentional, not overwhelming. This guide translates the jargon, highlights concierge-level must-knows, and helps you match the right seat to your vehicle, travel rhythm, and growing child.

---

## 👶 Infant Car Seats  
**Keywords:** Rear-Facing Bucket • Base + Carrier • Travel System Ready

**Why families love them**  
- Lightweight carrier clicks into a base or stroller frame
- Keeps baby sleeping during transfers between errands
- Supportive newborn inserts hug fourth-trimester bodies

**Concierge checklist**  
- Test base angle and recline in your exact parking spot
- Practice one-handed carrier release with winter gear on
- Confirm stroller frame or travel system compatibility in store

---

## 🔁 Convertible Car Seats  
**Keywords:** Rear to Forward • Extended Use • Plush Safety

**Why families love them**  
- Install once and rear-face well into toddler years
- Deep side-impact protection and cushioned recline positions
- Cost-effective if you want to skip the infant bucket stage

**Concierge checklist**  
- Measure front-to-back clearance when front seats slide back
- Choose a model with a no-rethread harness for quick growth spurts
- Look for easy-clean fabrics or covers that zip off without uninstalling

---

## 🔄 Rotating Convertible Seats  
**Keywords:** Swivel Loading • Back-Saving • Premium Convenience

**Why families love them**  
- Seat pivots toward the door so buckling is gentler on your back
- Ideal for SUVs, tall vehicles, or postpartum caregivers
- Encourages longer rear-facing without awkward leaning

**Concierge checklist**  
- Verify the swivel clears your door frame and garage walls
- Check for built-in belt lock-offs if you need to install without anchors
- Review the weight limit for rotation so expectations stay realistic

---

## ♾️ One-for-Life Convertibles  
**Keywords:** Grow-with-Me • Harness to Booster • Minimalist Solution

**Why families love them**  
- Transitions from rear-facing to forward-facing to high-back booster
- Smart choice for grandparents, secondary cars, or minimalist shoppers
- Adjustable headrests keep big kids supported in booster mode

**Concierge checklist**  
- Confirm booster configuration keeps the lap belt low on the hips
- Store harness pads and extra pieces so booster mode is ready later
- Note expiration dates since these seats remain in play for years

---

## 🧒 Booster Seats  
**Keywords:** Belt Positioning • High-Back or Backless • Big Kid Freedom

**Why families love them**  
- Teaches proper belt fit once harness days are done
- High-back shells add side protection and sleepy head support
- Backless boosters are light enough for carpools and travel

**Concierge checklist**  
- Review belt fit rules together: shoulder strap touches collarbone, not neck
- Keep an extra backless booster in the trunk for grandparents or ride shares
- Revisit readiness every growth spurt to maintain safe belt placement

---

## ✈️ Travel Car Seats  
**Keywords:** Lightweight • Compact • On-the-Go Ready

**Why families love them**  
- Slim profiles slip through airports and rideshares with ease
- Quick installs mean you always have a certified seat on hand
- Perfect for city living, taxis, or jet-setting families

**Concierge checklist**  
- Confirm the seat is approved for aircraft use if you fly often
- Practice installing with the vehicle belt for international travel
- Pair with a travel cart or backpack so your hands stay free

---

## 📊 Quick Comparison
| Seat Type | Orientation | Longevity | Concierge Tip |
|----------|-------------|-----------|----------------|
| Infant Bucket | Rear-facing | Birth to 12-18 months | Pair with a stroller frame for effortless transfers |
| Convertible | Rear to forward | Birth to 4-6 years | Install once and rely on extended rear-facing limits |
| Rotating Convertible | Rear to forward | Birth to ~4 years | Swivel keeps buckle routines easy on your body |
| One-for-Life | Rear, forward, booster | Birth to preteen | Track accessories so booster mode is ready later |
| High-Back Booster | Forward | 4+ years | Adjustable headrest keeps the belt on the collarbone |
| Backless Booster | Forward | 5+ years | Lightweight backup for carpools or travel days |

---

## 💬 Need Concierge Advice?
Taylor can review your vehicle, travel plans, and daily rhythm to recommend a seat that installs beautifully and keeps your little one cozy long after the first ride. **Book a consultation** to create a custom car seat roadmap.`

  await knex('blog_posts').insert({
    title: 'Car Seats, Simplified',
    slug: 'car-seats-simplified',
    category: 'Guides',
    excerpt:
      'Compare infant, convertible, rotating, and booster seats with Taylor\'s concierge tips so you can choose the right fit before your install.',
    content,
    visibility: 'public',
    published_at: new Date('2024-10-01T10:00:00Z'),
  });
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  await knex('blog_posts').where({ slug: 'car-seats-simplified' }).del();
};
