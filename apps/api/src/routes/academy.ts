import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticate, requireAuth } from "../middleware/auth";
import { categoriesForModule } from "../../../../packages/lib/registry";

const router = Router();

router.use(authenticate, requireAuth);

router.get("/journeys", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const journeys = await db("journeys").orderBy("order_idx");
    const moduleRecords = await db("modules")
      .join("tracks", "modules.track_id", "tracks.id")
      .select(
        "modules.id",
        "modules.code",
        "tracks.journey_id as journey_id",
        "tracks.id as track_id"
      );
    const progressRecords = await db("user_progress")
      .where({ user_id: userId })
      .select("module_id", "completed");

    const progressMap = new Map<string, boolean>();
    progressRecords.forEach((row) => {
      progressMap.set(row.module_id, row.completed);
    });

    const journeyProgress = journeys.map((journey) => {
      const moduleIds = moduleRecords
        .filter((mod) => mod.journey_id === journey.id)
        .map((mod) => mod.id);
      const totalModules = moduleIds.length;
      const completedCount = moduleIds.reduce(
        (acc, moduleId) => (progressMap.get(moduleId) ? acc + 1 : acc),
        0
      );
      return {
        ...journey,
        totalModules,
        completedModules: completedCount,
      };
    });

    res.json({ success: true, data: journeyProgress });
  } catch (error) {
    console.error("Error fetching journeys", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to fetch journeys." });
  }
});

router.get("/tracks", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { journey: journeySlug } = req.query;
    if (!journeySlug || typeof journeySlug !== "string") {
      res.status(400).json({
        success: false,
        error: "journey query parameter is required.",
      });
      return;
    }

    const journey = await db("journeys").where({ slug: journeySlug }).first();
    if (!journey) {
      res.status(404).json({ success: false, error: "Journey not found." });
      return;
    }

    const tracks = await db("tracks")
      .where({ journey_id: journey.id })
      .orderBy("order_idx");

    const modules = await db("modules")
      .whereIn(
        "track_id",
        tracks.map((track) => track.id)
      )
      .select("id", "track_id");

    const progressRecords = await db("user_progress")
      .where({ user_id: userId })
      .select("module_id", "completed");

    const progressMap = new Map<string, boolean>();
    progressRecords.forEach((row) => {
      progressMap.set(row.module_id, row.completed);
    });

    const payload = tracks.map((track) => {
      const trackModules = modules.filter(
        (module) => module.track_id === track.id
      );
      const totalModules = trackModules.length;
      const completedModules = trackModules.reduce(
        (acc, module) => (progressMap.get(module.id) ? acc + 1 : acc),
        0
      );
      return {
        ...track,
        totalModules,
        completedModules,
      };
    });

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Error fetching tracks", error);
    res.status(500).json({ success: false, error: "Unable to fetch tracks." });
  }
});

router.get("/modules", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { track: trackSlug } = req.query;
    if (!trackSlug || typeof trackSlug !== "string") {
      res.status(400).json({
        success: false,
        error: "track query parameter is required.",
      });
      return;
    }

    const track = await db("tracks").where({ slug: trackSlug }).first();
    if (!track) {
      res.status(404).json({ success: false, error: "Track not found." });
      return;
    }

    const modules = await db("modules")
      .where({ track_id: track.id })
      .orderBy("order_idx");

    const progressRecords = await db("user_progress")
      .where({ user_id: userId })
      .select("module_id", "completed");

    const progressMap = new Map<string, boolean>();
    progressRecords.forEach((row) => {
      progressMap.set(row.module_id, row.completed);
    });

    const payload = modules.map((module) => ({
      ...module,
      completed: progressMap.get(module.id) ?? false,
    }));

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Error fetching modules", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to fetch modules." });
  }
});

router.get("/modules/:code", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { code } = req.params;
    const moduleRecord = await db("modules")
      .join("tracks", "modules.track_id", "tracks.id")
      .join("journeys", "tracks.journey_id", "journeys.id")
      .select(
        "modules.*",
        "tracks.slug as track_slug",
        "tracks.title as track_title",
        "journeys.slug as journey_slug",
        "journeys.title as journey_title"
      )
      .where("modules.code", code)
      .first();
    if (!moduleRecord) {
      res.status(404).json({ success: false, error: "Module not found." });
      return;
    }

    const content = await db("module_content")
      .where({ module_id: moduleRecord.id })
      .first();

    const progress = await db("user_progress")
      .where({ user_id: userId, module_id: moduleRecord.id })
      .first();

    const categories = categoriesForModule(
      moduleRecord.code,
      moduleRecord.track_slug
    );
    const suggestions = await db("affiliate_products")
      .whereIn("category", categories)
      .andWhere({ active: true })
      .orderBy("price", "asc")
      .limit(12);

    res.json({
      success: true,
      data: {
        module: moduleRecord,
        content,
        progress: progress ?? null,
        suggestions,
      },
    });
  } catch (error) {
    console.error("Error fetching module detail", error);
    res.status(500).json({
      success: false,
      error: "Unable to fetch module detail.",
    });
  }
});

router.post(
  "/progress/:moduleId/checklist",
  async (
    req: Request<{ moduleId: string }, unknown, { itemId?: string; checked?: boolean }>,
    res: Response
  ) => {
    try {
      const userId = req.user!.id;
      const { moduleId } = req.params;
      const { itemId, checked } = req.body ?? {};

      if (!itemId || typeof checked !== "boolean") {
        res.status(400).json({
          success: false,
          error: "itemId and checked boolean are required.",
        });
        return;
      }

      const moduleExists = await db("modules").where({ id: moduleId }).first();
      if (!moduleExists) {
        res.status(404).json({
          success: false,
          error: "Module not found.",
        });
        return;
      }

      const existing = await db("user_progress")
        .where({ user_id: userId, module_id: moduleId })
        .first();

      const previousState: Record<string, boolean> =
        (existing?.checklist_state as Record<string, boolean>) ?? {};
      const nextState = { ...previousState, [itemId]: checked };

      const checklistValues = Object.values(nextState);
      const completed =
        checklistValues.length > 0 && checklistValues.every(Boolean);

      if (existing) {
        await db("user_progress")
          .where({ id: existing.id })
          .update({
            checklist_state: nextState,
            completed,
            updated_at: db.fn.now(),
          });
      } else {
        await db("user_progress").insert({
          user_id: userId,
          module_id: moduleId,
          checklist_state: nextState,
          completed,
        });
      }

      const fresh = await db("user_progress")
        .where({ user_id: userId, module_id: moduleId })
        .first();

      res.json({ success: true, data: fresh });
    } catch (error) {
      console.error("Error updating checklist", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to update progress." });
    }
  }
);

router.get("/community/posts", async (_req: Request, res: Response) => {
  try {
    const posts = await db("community_posts")
      .orderBy("created_at", "desc")
      .limit(100);

    const postIds = posts.map((post) => post.id);
    const comments = postIds.length
      ? await db("community_comments")
          .whereIn("post_id", postIds)
          .orderBy("created_at", "asc")
      : [];

    const grouped = postIds.reduce<Record<string, typeof comments>>(
      (acc, id) => {
        acc[id] = [];
        return acc;
      },
      {}
    );

    comments.forEach((comment) => {
      if (!grouped[comment.post_id]) {
        grouped[comment.post_id] = [];
      }
      grouped[comment.post_id].push(comment);
    });

    const payload = posts.map((post) => ({
      ...post,
      comments: grouped[post.id] ?? [],
    }));

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Error fetching community posts", error);
    res.status(500).json({
      success: false,
      error: "Unable to fetch community posts.",
    });
  }
});

router.post(
  "/community/posts",
  async (
    req: Request<
      unknown,
      unknown,
      {
        category?: string;
        title?: string;
        content?: string;
        imageUrl?: string;
        isAnonymous?: boolean;
      }
    >,
    res: Response
  ) => {
    try {
      const userId = req.user!.id;
      const { category, title, content, imageUrl, isAnonymous = false } =
        req.body ?? {};

      if (!category || !title || !content) {
        res.status(400).json({
          success: false,
          error: "category, title, and content are required.",
        });
        return;
      }

      const [post] = await db("community_posts")
        .insert({
          user_id: userId,
          category,
          title,
          content,
          image_url: imageUrl ?? null,
          is_anonymous: Boolean(isAnonymous),
        })
        .returning("*");

      res.status(201).json({ success: true, data: post });
    } catch (error) {
      console.error("Error creating community post", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to create community post." });
    }
  }
);

router.post(
  "/community/:postId/comments",
  async (
    req: Request<{ postId: string }, unknown, { content?: string }>,
    res: Response
  ) => {
    try {
      const userId = req.user!.id;
      const { postId } = req.params;
      const { content } = req.body ?? {};

      if (!content) {
        res.status(400).json({
          success: false,
          error: "content is required.",
        });
        return;
      }

      const postExists = await db("community_posts").where({ id: postId }).first();
      if (!postExists) {
        res.status(404).json({ success: false, error: "Post not found." });
        return;
      }

      const [comment] = await db("community_comments")
        .insert({
          post_id: postId,
          user_id: userId,
          content,
        })
        .returning("*");

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      console.error("Error creating community comment", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to create comment." });
    }
  }
);

export const academyRouter = router;
