import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("community_comments").del();
  await knex("community_posts").del();
  await knex("user_progress").del();
  await knex("module_content").del();
  await knex("modules").del();
  await knex("tracks").del();
  await knex("journeys").del();

  const [journey] = await knex("journeys")
    .insert({
      slug: "nursery",
      title: "Nursery Design",
      order_idx: 1,
    })
    .returning("*");

  const [track] = await knex("tracks")
    .insert({
      journey_id: journey.id,
      slug: "vision-foundations",
      title: "Vision & Foundations",
      order_idx: 1,
    })
    .returning("*");

  const modules = await knex("modules")
    .insert([
      {
        track_id: track.id,
        code: "nursery-vision-style",
        title: "Nursery Vision & Style Finder",
        subtitle: "Where Aesthetics Meet Emotion",
        order_idx: 1,
        est_minutes: 35,
        cover_icon: "sparkles",
      },
      {
        track_id: track.id,
        code: "color-psychology",
        title: "Color Psychology & Emotional Influence",
        subtitle: "Designing Through Emotion",
        order_idx: 2,
        est_minutes: 30,
        cover_icon: "palette",
      },
    ])
    .returning("*");

  await knex("module_content").insert(
    modules.map((module, index) => ({
      module_id: module.id,
      explore:
        index === 0
          ? "Every nursery tells a story. Align beauty, function, and feeling to set the tone for your family."
          : "Color shapes how a space feels long before we consciously interpret it.",
      lecture: {
        bullets:
          index === 0
            ? [
                "Design begins with emotion—define how you want the room to feel.",
                "Harmonious design lowers cortisol for parents and baby alike.",
                "Five Taylor-Made Style Archetypes guide visual tone and function.",
              ]
            : [
                "Neutrals ground a space and expand perceived size.",
                "Pastels engage curiosity softly without overstimulation.",
                "Warm accents infuse happiness and comfort.",
              ],
      },
      journal_prompt:
        index === 0
          ? "Before baby arrives, how do I want this room to feel?"
          : "Which colors calm me and feel emotionally safe?",
      apply: {
        items:
          index === 0
            ? [
                { id: "style-archetype", text: "Choose your nursery archetype." },
                { id: "three-words", text: "List three words that describe your ideal tone." },
                { id: "inspiration", text: "Collect inspiration images that match the feeling." },
              ]
            : [
                { id: "core-colors", text: "Pick three core colors for walls, furniture, and accents." },
                { id: "lighting", text: "Select bulb temperature to support evening calm." },
                { id: "day-evening", text: "Test your palette in both daylight and evening light." },
              ],
      },
    }))
  );

  const [adminUser] = await knex("users")
    .where({ email: "Admin@me.com" })
    .select("id");

  if (adminUser) {
    const [post] = await knex("community_posts")
      .insert({
        user_id: adminUser.id,
        category: "Nursery",
        title: "Welcome to Taylor-Made Community",
        content:
          "Share a win from your design process or ask for feedback—your mentor concierge is here for you.",
        is_anonymous: false,
      })
      .returning("*");

    await knex("community_comments").insert({
      post_id: post.id,
      user_id: adminUser.id,
      content: "Use this thread to introduce yourself and tell us about your vision!",
    });
  }
}
