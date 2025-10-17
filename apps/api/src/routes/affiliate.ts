import { Router, Request, Response } from "express";
import { db } from "../db";
import { withAff } from "../../../../packages/lib/affiliate";
import { authenticate, requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

type ProductPayload = {
  category?: string;
  brand?: string;
  name?: string;
  image_url?: string;
  product_url?: string;
  price?: number | string;
  active?: boolean;
};

router.use(authenticate);

router.get("/products", requireAuth, async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const builder = db("affiliate_products").where({ active: true });

    if (typeof category === "string" && category.trim().length > 0) {
      builder.andWhere({ category: category.trim() });
    }

    const products = await builder.orderBy("created_at", "desc");
    const payload = products.map((product) => ({
      ...product,
      product_url: withAff(product.product_url),
    }));

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Error fetching affiliate products", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch affiliate products.",
    });
  }
});

router.post(
  "/products",
  requireAdmin,
  async (req: Request<unknown, unknown, ProductPayload>, res: Response) => {
    try {
      const { category, brand, name, image_url, product_url, price, active } =
        req.body ?? {};

      if (!category || !brand || !name || !product_url || price === undefined) {
        res.status(400).json({
          success: false,
          error:
            "Category, brand, name, product_url, and price are required fields.",
        });
        return;
      }

      const normalizedPrice =
        typeof price === "string" ? Number(price) : Number(price);

      if (Number.isNaN(normalizedPrice)) {
        res
          .status(400)
          .json({ success: false, error: "Price must be a numeric value." });
        return;
      }

      const [product] = await db("affiliate_products")
        .insert({
          category,
          brand,
          name,
          image_url: image_url ?? null,
          product_url,
          price: normalizedPrice,
          active: active ?? true,
        })
        .returning("*");

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error("Error creating affiliate product", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create product." });
    }
  }
);

router.put(
  "/products/:id",
  requireAdmin,
  async (
    req: Request<{ id: string }, unknown, ProductPayload>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const payload = { ...req.body } as ProductPayload;
      if (payload?.price !== undefined) {
        const normalizedPrice =
          typeof payload.price === "string"
            ? Number(payload.price)
            : Number(payload.price);
        if (Number.isNaN(normalizedPrice)) {
          res.status(400).json({
            success: false,
            error: "Price must be a numeric value.",
          });
          return;
        }
        payload.price = normalizedPrice;
      }
      if (!Object.keys(payload).length) {
        res
          .status(400)
          .json({ success: false, error: "Update payload is required." });
        return;
      }

      const [product] = await db("affiliate_products")
        .where({ id })
        .update({ ...payload, updated_at: db.fn.now() })
        .returning("*");

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found." });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      console.error("Error updating affiliate product", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update product." });
    }
  }
);

router.post(
  "/products/:id/toggle",
  requireAdmin,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const product = await db("affiliate_products").where({ id }).first();
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found." });
        return;
      }

      const [updated] = await db("affiliate_products")
        .where({ id })
        .update({ active: !product.active, updated_at: db.fn.now() })
        .returning("*");

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Error toggling affiliate product", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to toggle product." });
    }
  }
);

export const affiliateRouter = router;
