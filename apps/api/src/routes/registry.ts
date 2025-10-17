import { Router, Request, Response } from "express";
import { db } from "../db";
import { withAff } from "../../../../packages/lib/affiliate";
import { authenticate, requireAuth } from "../middleware/auth";
import { trackEvent } from "../../../../packages/lib/analytics";

const router = Router();

type RegistryMutationBody = {
  affiliate_product_id?: string;
  mentor_notes?: string | null;
};

router.use(authenticate);

router.get("/list", requireAuth, async (req: Request, res: Response) => {
  try {
    const requestedUser =
      typeof req.query.user === "string" ? req.query.user : req.user?.id;

    if (!requestedUser) {
      res.status(400).json({ success: false, error: "User id is required." });
      return;
    }

    if (requestedUser !== req.user?.id && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "You are not allowed to view another member's registry.",
      });
      return;
    }

    const items = await db("registry_items as ri")
      .leftJoin(
        "affiliate_products as ap",
        "ri.affiliate_product_id",
        "ap.id"
      )
      .select(
        "ri.*",
        "ap.brand",
        "ap.name",
        "ap.category",
        "ap.image_url",
        "ap.product_url",
        "ap.price"
      )
      .where("ri.user_id", requestedUser)
      .orderBy("ri.created_at", "desc");

    const payload = items.map((item) => ({
      id: item.id,
      status: item.status,
      mentor_notes: item.mentor_notes,
      created_at: item.created_at,
      affiliate_product_id: item.affiliate_product_id,
      product: item.affiliate_product_id
        ? {
            id: item.affiliate_product_id,
            brand: item.brand,
            name: item.name,
            category: item.category,
            image_url: item.image_url,
            product_url: item.product_url
              ? withAff(item.product_url)
              : null,
            price: item.price,
          }
        : null,
    }));

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Error fetching registry list", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to fetch registry items." });
  }
});

router.post(
  "/add",
  requireAuth,
  async (req: Request<unknown, unknown, RegistryMutationBody>, res: Response) => {
    try {
      const { affiliate_product_id: affiliateProductId, mentor_notes } =
        req.body ?? {};
      if (!affiliateProductId) {
        res.status(400).json({
          success: false,
          error: "affiliate_product_id is required.",
        });
        return;
      }

      const product = await db("affiliate_products")
        .where({ id: affiliateProductId })
        .first();
      if (!product) {
        res
          .status(404)
          .json({ success: false, error: "Affiliate product not found." });
        return;
      }

      await db("registry_items")
        .insert({
          user_id: req.user!.id,
          affiliate_product_id: affiliateProductId,
          status: "added",
          mentor_notes: mentor_notes ?? null,
        })
        .onConflict(["user_id", "affiliate_product_id"])
        .merge({
          status: "added",
          mentor_notes: mentor_notes ?? null,
          created_at: db.fn.now(),
        });

      const item = await db("registry_items")
        .where({
          user_id: req.user!.id,
          affiliate_product_id: affiliateProductId,
        })
        .first();

      await trackEvent({
        name: "registry_item_added",
        payload: { userId: req.user!.id, affiliateProductId },
      });

      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error("Error adding registry item", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to add registry item." });
    }
  }
);

router.post(
  "/remove",
  requireAuth,
  async (req: Request<unknown, unknown, RegistryMutationBody>, res: Response) => {
    try {
      const { affiliate_product_id: affiliateProductId } = req.body ?? {};
      if (!affiliateProductId) {
        res.status(400).json({
          success: false,
          error: "affiliate_product_id is required.",
        });
        return;
      }

      const existing = await db("registry_items")
        .where({
          user_id: req.user!.id,
          affiliate_product_id: affiliateProductId,
        })
        .first();

      if (!existing) {
        res.status(404).json({
          success: false,
          error: "Registry item not found.",
        });
        return;
      }

      await db("registry_items")
        .where({
          user_id: req.user!.id,
          affiliate_product_id: affiliateProductId,
        })
        .update({
          status: "removed",
        });

      await trackEvent({
        name: "registry_item_removed",
        payload: { userId: req.user!.id, affiliateProductId },
      });

      res.json({ success: true, data: { removed: true } });
    } catch (error) {
      console.error("Error removing registry item", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to remove registry item." });
    }
  }
);

export const registryRouter = router;
