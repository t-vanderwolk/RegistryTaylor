exports.seed = async (knex) => {
  const hasTable = await knex.schema.hasTable("blog_posts");
  if (!hasTable) return;

  // Ensure idempotency
  await knex("blog_posts").where({ slug: "stroller-styles-demystified" }).del();

  const content = `
# 🍼 *Stroller Styles, Demystified:*
### What’s the Difference Between Modular, Travel System, Umbrella, Travel, Compact, Full-Size, Single-to-Double, Double & Jogging Strollers?

Let’s face it—stroller shopping can feel like learning a new language. If terms like “modular,” “travel system,” or “convertible” leave you scratching your head, you’re not alone.

This guide clears the clutter by breaking stroller options into **core features** first (Modular, Travel System), followed by **form factor categories** (from Umbrella to Jogging). Whether you’re a first-timer or registry repeat, this layout helps you make a confident, informed choice.

---

## 🔁 Modular  
**Keywords:** Reversible Seat • Removable Seat • Bassinet Compatible

A stroller is considered **modular** when the **main seat can be reversed and fully removed**, and you can attach a **dedicated bassinet directly to the frame**—no adapters required. Modular design allows for parent-facing bonding early on and transitions cleanly into forward-facing toddler mode.

💡 *Modular does not mean car seat compatible on its own.* That’s a travel system. With the right adapters, every modular stroller can also run as a travel system, giving you the best of both worlds.

**Best for:**  
- Face-to-face strolling in early months  
- Parents who want long-term flexibility  
- A sleek alternative to car seat use in the newborn stage

---

## 🚗 Travel System  
**Keywords:** Car Seat Compatible • Click-In Convenience • Newborn-Ready

A **travel system** is any stroller that allows an **infant car seat to attach directly to the frame**. This is all about convenience—especially in the early months when baby is sleeping and too small for a standard seat.

Modular frames fall into this camp *and* give you bassinet/seat options beyond the car seat itself.

**Best for:**  
- Easy car-to-stroller transitions  
- Nap-friendly errands  
- Families using the infant car seat as their main newborn ride

---

## ☂️ Umbrella Strollers  
**Keywords:** Ultra-Light • Slim Fold • Minimal Features  
**Modular?** No  
**Travel System?** No

Umbrella strollers are the simplest, most affordable strollers on the market. They’re ultra-light, fold vertically, and often lack full recline, modular seating, or newborn compatibility. Great for quick errands or older toddlers who want to hop in and out.

**Best for:**  
- Toddlers on the go  
- Grandparents or caregivers  
- Simple, second-stroller use

---

## ✈️ Travel Strollers  
**Keywords:** Lightweight • Compact Fold • Overhead Bin Friendly  
**Modular?** No  
**Travel System?** Sometimes (with adapter)

Travel strollers are a step up from umbrellas. They’re designed for portability, with smooth folds and low weight—but often with more comfort features. Some offer travel system compatibility with the right car seat adapter, but modular features are rare.

**Best for:**  
- Families who fly often  
- Compact backup stroller  
- Quick errands with infants or toddlers

---

## 🧳 Compact Strollers  
**Keywords:** Lightweight • Modular • Small Footprint  
**Modular?** Yes  
**Travel System?** Yes

Compact strollers bridge the gap between travel and full-size. Many now offer **modular features** like a reversible seat or bassinet compatibility—but in a smaller, easier-to-store frame. Great for one-and-done families who need flexibility and portability in one.

**Best for:**  
- Urban or small-space living  
- One-stroller households  
- Modular features without the bulk

---

## 👑 Full-Size Strollers  
**Keywords:** Spacious • Modular • Long-Term Use  
**Modular?** Yes  
**Travel System?** Yes

Full-size strollers are built for daily life and long walks. They usually include **modular functionality** (reversible seats + bassinet-ready frames), plenty of storage, and smooth suspension. These strollers often serve from birth through toddlerhood.

**Best for:**  
- Families who walk a lot  
- Newborn to toddler transition  
- Parents who want the full feature set

---

## ➕ Modular Single-to-Double  
**Keywords:** Expandable • Modular • Bonus Single Mode Use  
**Modular?** Yes  
**Travel System?** Yes

These strollers offer modular features *and* grow with your family. In single mode, you can use the extra space for a market basket or cooler. When baby #2 arrives, swap that out for a second seat. You get maximum flexibility in both configurations.

**Best for:**  
- Growing families  
- Long-term investment  
- Stylish versatility

---

## 🔄 Convertible Single-to-Double  
**Keywords:** Expandable • Practical • Simplified  
**Modular?** Often no  
**Travel System?** Yes

These strollers expand from single to double with added seats, but often lack full modularity (no reversible seating or bassinet options). They’re a practical option for families who want to keep things simple without sacrificing future flexibility.

**Best for:**  
- Two-under-two families  
- Minimalist double stroller planning  
- Budget-conscious expansion

---

## 👯‍♀️ Double Strollers (Tandem or Side-by-Side)  
**Keywords:** Purpose-Built • Dual Seating • Not Convertible  
**Modular?** No  
**Travel System?** Sometimes

Double strollers are designed to carry two children right out of the box. They’re not modular or expandable—you buy them knowing you’re strolling with two. Great for twins or toddlers who both still ride.

**Best for:**  
- Twin families  
- Two toddlers  
- Parents who don’t need a single mode

---

## 🏃‍♀️ Jogging Strollers  
**Keywords:** Three Wheels • Suspension • Performance  
**Modular?** Usually no  
**Travel System?** Sometimes

Jogging strollers are built for movement—with large air-filled tires, excellent suspension, and front-wheel locks for safety. Not all jogging strollers support newborns or modular setups, so check certification before running or adding a car seat.

**Best for:**  
- Runners and outdoor parents  
- Park paths, gravel, and uneven terrain  
- Smooth suspension needs

---

## 📊 Stroller Style Comparison Chart

| **Stroller Type**                 | **Modular?** | **Travel System?** | **Best For**                                        |
|----------------------------------|--------------|---------------------|----------------------------------------------------|
| **Modular**                      | ✅           | ✅ (if compatible)   | Reversible seats without relying on car seats      |
| **Travel System**                | N/A          | ✅ (by definition)   | Infant car seat click-in convenience               |
| **Umbrella**                     | ❌           | ❌                  | Simplicity, toddlers, backup stroller              |
| **Travel**                       | ❌           | ✅ (some models)     | Lightweight travel with more comfort               |
| **Compact**                      | ✅           | ✅                  | One-and-done lightweight + modular combo           |
| **Full-Size**                    | ✅           | ✅                  | Daily, long-term modular stroller                  |
| **Modular Single-to-Double**     | ✅           | ✅                  | Growing families, utility + expansion              |
| **Convertible Single-to-Double** | ❌ (often)   | ✅                  | Two kids with fewer bells and whistles             |
| **Double (Built-in)**            | ❌           | ✅ (some models)     | Twins or two toddlers                              |
| **Jogging**                      | ❌ (usually) | ✅ (some models)     | Active parents, terrain performance                |

---

## 💬 Need Help Choosing?

At **Taylor-Made Baby Co.**, we simplify all things stroller—from technical specs to lifestyle fit. Whether you want a compact reversible ride or a fully loaded frame that grows with your family, we’re here to guide you.

🍼 **Book your one-on-one stroller consultation today.**  
We’ll help you find the perfect fit—modular or not.
`.trim();

  await knex("blog_posts").insert({
    title: "Stroller Styles, Demystified",
    slug: "stroller-styles-demystified",
    category: "Guides",
    excerpt:
      "Confused about modular versus travel systems, or which stroller grows with two kids? This Taylor-Made guide breaks every stroller style into plain-language essentials—complete with quick comparison chart and concierge tips.",
    content,
    visibility: "public",
    published_at: new Date("2024-09-15T10:00:00Z"),
    updated_at: knex.fn.now(),
  });

  console.log("✅ Seeded: Stroller Styles, Demystified");
};