// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.profile.deleteMany();

  // Create sample users for testing roles
  const member = await prisma.profile.create({
    data: {
      email: "member@me.com",
      password: "Karma",
      name: "Member Test",
      role: "MEMBER",
    },
  });

  const mentor = await prisma.profile.create({
    data: {
      email: "mentor@me.com",
      password: "Karma",
      name: "Mentor Test",
      role: "MENTOR",
    },
  });

  const admin = await prisma.profile.create({
    data: {
      email: "admin@me.com",
      password: "Karma",
      name: "Admin Test",
      role: "ADMIN",
    },
  });

  console.log("✅ Seeded Member, Mentor, and Admin users");
  console.table({ member, mentor, admin });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });