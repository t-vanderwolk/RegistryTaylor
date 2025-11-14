import express from "express";
import {
  getHealthCheck,
  signupUser,
  getShippingAddress,
  setGiftAsPurchased,
} from "../services/myRegistryService.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const data = await getHealthCheck();
    res.json({ ok: true, data });
  }),
);

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, firstName, lastName } = req.body ?? {};
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const data = await signupUser({ email, firstName, lastName });
    res.status(201).json({ user: data ?? null });
  }),
);

router.get(
  "/shipping/:registryId",
  asyncHandler(async (req, res) => {
    const { registryId } = req.params;
    const data = await getShippingAddress(registryId);
    res.json({ shippingAddress: data ?? null });
  }),
);

router.post(
  "/purchase",
  asyncHandler(async (req, res) => {
    const { registryId, itemId, orderId } = req.body ?? {};
    if (!registryId || !itemId || !orderId) {
      return res.status(400).json({ error: "registryId, itemId, and orderId are required" });
    }
    const data = await setGiftAsPurchased({ registryId, itemId, orderId });
    res.status(200).json({ purchase: data ?? null });
  }),
);

export default router;
