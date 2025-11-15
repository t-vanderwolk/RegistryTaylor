import { PrismaClient } from "@prisma/client";
import { allModules } from "../../dashboard/src/app/dashboard/learn/welcome/data/index.ts";
const prisma = new PrismaClient();
function normalizeModule(module, index) {
    return {
        slug: module.slug,
        title: module.title,
        category: module.journey ?? module.category ?? "",
        summary: module.subtitle ?? module.content?.explore ?? "",
        lecture: module.content?.lecture ?? "",
        workbookPrompt: module.content?.journalPrompt ?? "",
        order: index + 1,
        content: module,
    };
}
async function main() {
    console.log("🌱 Seeding Taylor-Made Baby Academy modules...");
    const normalized = allModules.map(normalizeModule);
    for (const record of normalized) {
        await prisma.academyModule.upsert({
            where: { slug: record.slug },
            update: record,
            create: record,
        });
    }
    console.log("✅ All modules seeded successfully!");
}
main()
    .catch((err) => {
    console.error("❌ Seeding failed", err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
