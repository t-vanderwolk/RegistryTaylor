import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticate, requireAuth } from "../middleware/auth";
import { withAff } from "../../../../packages/lib/affiliate";

const router = Router();

router.use(authenticate, requireAuth);

router.post(
  "/reflections",
  async (
    req: Request<unknown, unknown, { moduleCode?: string; content?: string; isAnonymous?: boolean }>,
    res: Response
  ) => {
    try {
      const userId = req.user!.id;
      const moduleCode = req.body?.moduleCode?.trim();
      const content = req.body?.content ?? "";
      const isAnonymous = Boolean(req.body?.isAnonymous);

      if (!moduleCode) {
        return res.status(400).json({ success: false, error: "moduleCode is required." });
      }

      const existing = await db("reflections")
        .where({ user_id: userId, module_code: moduleCode })
        .first();

      if (existing) {
        const [updated] = await db("reflections")
          .where({ id: existing.id })
          .update(
            {
              content,
              is_anonymous: isAnonymous,
              updated_at: db.fn.now(),
            },
            "*"
          );
        return res.json({ success: true, data: updated });
      }

      const [created] = await db("reflections")
        .insert({
          user_id: userId,
          module_code: moduleCode,
          content,
          is_anonymous: isAnonymous,
        })
        .returning("*");

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      console.error("Error saving reflection", error);
      res.status(500).json({ success: false, error: "Unable to save reflection." });
    }
  }
);

router.get(
  "/reflections",
  async (req: Request<unknown, unknown, unknown, { module?: string }>, res: Response) => {
    try {
      const userId = req.user!.id;
      const moduleCode = req.query.module?.trim();
      if (!moduleCode) {
        return res
          .status(400)
          .json({ success: false, error: "module query parameter is required." });
      }

      const reflection = await db("reflections")
        .where({ user_id: userId, module_code: moduleCode })
        .first();

      if (!reflection) {
        return res.json({ success: true, data: null });
      }

      const feedback = await db("mentor_feedback")
        .where({ reflection_id: reflection.id })
        .orderBy("created_at", "asc");

      const share = await db("reflection_shares")
        .where({ reflection_id: reflection.id })
        .first();

      res.json({
        success: true,
        data: {
          reflection,
          feedback,
          share,
        },
      });
    } catch (error) {
      console.error("Error fetching reflection", error);
      res.status(500).json({ success: false, error: "Unable to fetch reflections." });
    }
  }
);

router.post("/reflections/:id/share", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const reflection = await db("reflections").where({ id }).first();

    if (!reflection || reflection.user_id !== userId) {
      return res.status(404).json({ success: false, error: "Reflection not found." });
    }

    if (reflection.is_shared) {
      const existingShare = await db("reflection_shares").where({ reflection_id: id }).first();
      return res.json({ success: true, data: existingShare });
    }

    const [post] = await db("community_posts")
      .insert({
        user_id: reflection.is_anonymous ? userId : userId,
        category: "Reflections",
        title: "Shared Reflection",
        content: reflection.content,
        is_anonymous: reflection.is_anonymous,
      })
      .returning("*");

    const [share] = await db("reflection_shares")
      .insert({
        reflection_id: id,
        post_id: post.id,
      })
      .returning("*");

    await db("reflections").where({ id }).update({ is_shared: true, updated_at: db.fn.now() });

    res.status(201).json({ success: true, data: { share, post } });
  } catch (error) {
    console.error("Error sharing reflection", error);
    res.status(500).json({ success: false, error: "Unable to share reflection." });
  }
});

router.post(
  "/reflections/:id/mentor-feedback",
  async (req: Request<{ id: string }, unknown, { content?: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const content = req.body?.content?.trim();
      if (!content) {
        return res.status(400).json({ success: false, error: "content is required." });
      }

      const reflection = await db("reflections").where({ id }).first();
      if (!reflection) {
        return res.status(404).json({ success: false, error: "Reflection not found." });
      }

      const [feedback] = await db("mentor_feedback")
        .insert({
          reflection_id: id,
          mentor_id: req.user!.id,
          content,
        })
        .returning("*");

      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      console.error("Error creating mentor feedback", error);
      res.status(500).json({ success: false, error: "Unable to add mentor feedback." });
    }
  }
);

router.get(
  "/registry/suggestions",
  async (req: Request<unknown, unknown, unknown, { module?: string; slide?: string }>, res) => {
    try {
      const moduleCode = req.query.module?.trim();
      const slideIdx = Number(req.query.slide ?? 0);

      if (!moduleCode || Number.isNaN(slideIdx)) {
        return res.status(400).json({
          success: false,
          error: "module and slide query parameters are required.",
        });
      }

      const mapping = await db("insight_registry_map")
        .where({ module_code: moduleCode, slide_idx: slideIdx })
        .first();

      if (!mapping) {
        return res.json({ success: true, data: [] });
      }

      const categories = mapping.categories as string[];
      if (!categories || categories.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const products = await db("affiliate_products")
        .whereIn("category", categories)
        .andWhere({ active: true })
        .orderBy("created_at", "desc")
        .limit(6);

      const payload = products.map((product) => ({
        ...product,
        product_url: withAff(product.product_url),
      }));

      res.json({ success: true, data: payload });
    } catch (error) {
      console.error("Error fetching registry suggestions", error);
      res.status(500).json({ success: false, error: "Unable to load registry suggestions." });
    }
  }
);

router.post(
  "/achievements/award",
  async (req: Request<unknown, unknown, { achievementCode?: string }>, res: Response) => {
    try {
      const achievementCode = req.body?.achievementCode?.trim();
      if (!achievementCode) {
        return res
          .status(400)
          .json({ success: false, error: "achievementCode is required." });
      }

      const achievement = await db("achievements").where({ code: achievementCode }).first();
      if (!achievement) {
        return res.status(404).json({ success: false, error: "Achievement not found." });
      }

      const userId = req.user!.id;
      const existing = await db("user_achievements")
        .where({ user_id: userId, achievement_code: achievementCode })
        .first();

      if (existing) {
        return res.json({ success: true, data: existing, awarded: false });
      }

      const [awarded] = await db("user_achievements")
        .insert({
          user_id: userId,
          achievement_code: achievementCode,
        })
        .returning("*");

      res.status(201).json({ success: true, data: awarded, awarded: true });
    } catch (error) {
      console.error("Error awarding achievement", error);
      res.status(500).json({ success: false, error: "Unable to award achievement." });
    }
  }
);

export const engagementRouter = router;
