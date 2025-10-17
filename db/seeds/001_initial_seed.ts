import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("registry_items").del();
  await knex("affiliate_products").del();
  await knex("invite_requests").del();
  await knex("invite_codes").del();
  await knex("users").del();

  const users = await knex("users")
    .insert([
      {
        username: "member_user",
        email: "User@me.com",
        password_hash:
          "$2b$10$J0XLG3dD2PZy86LI5UUggeAKmYl7qeOHmql7c/bSoGO4.aIOmuk9u",
      },
      {
        username: "mentor_user",
        email: "Mentor@me.com",
        password_hash:
          "$2b$10$KLqR6uNgEVsJVIH5HoufJegJkxY5mkHKsTx3vTkBPw0xDYO24K.Z6",
      },
      {
        username: "admin_user",
        email: "Admin@me.com",
        password_hash:
          "$2b$10$CIRS4FaecAnld3jaEB4Anuh9VITJjs0fh0sIPFuCLNgsJdVT/NgXi",
      },
    ])
    .returning(["id", "email"]);

  const userIds = new Map(users.map((user) => [user.email, user.id]));

  await knex("invite_codes").insert([
    {
      code: "TMBETA2025",
      created_by: "system",
      is_active: true,
      used_by: userIds.get("User@me.com"),
      used_at: knex.fn.now(),
    },
  ]);

  await knex("affiliate_products").insert([
    {
      category: "strollers",
      brand: "Nuna",
      name: "MIXX Next Stroller",
      image_url: "https://example.com/stroller.jpg",
      product_url: withAff("https://www.macrobaby.com/nuna-mixx-next"),
      price: 799.99,
    },
    {
      category: "carseats",
      brand: "UPPAbaby",
      name: "Mesa V2 Infant Car Seat",
      image_url: "https://example.com/mesa.jpg",
      product_url: withAff("https://www.macrobaby.com/uppababy-mesa-v2"),
      price: 329.99,
    },
  ]);
}

function withAff(url: string): string {
  return url.includes("?")
    ? `${url}&affid=taylorvanderwolk`
    : `${url}?affid=taylorvanderwolk`;
}
