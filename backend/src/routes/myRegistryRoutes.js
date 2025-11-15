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

const normalizeInput = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value === undefined || value === null) {
    return "";
  }
  return String(value).trim();
};

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
    const normalizedEmail = normalizeInput(email);

    if (!normalizedEmail) {
      return res.status(400).json({ error: "A valid email is required." });
    }

    const data = await signupUser({
      email: normalizedEmail,
      firstName: normalizeInput(firstName) || undefined,
      lastName: normalizeInput(lastName) || undefined,
    });
    res.status(201).json({ user: data ?? null });
  }),
);

router.get(
  "/shipping/:registryId",
  asyncHandler(async (req, res) => {
    const { registryId } = req.params;
    const normalizedRegistryId = normalizeInput(registryId);
    if (!normalizedRegistryId) {
      return res.status(400).json({ error: "registryId is required" });
    }
    const data = await getShippingAddress(normalizedRegistryId);
    res.json({ shippingAddress: data ?? null });
  }),
);

router.post(
  "/purchase",
  asyncHandler(async (req, res) => {
    const { registryId, itemId, orderId } = req.body ?? {};
    const normalizedRegistryId = normalizeInput(registryId);
    const normalizedItemId = normalizeInput(itemId);
    const normalizedOrderId = normalizeInput(orderId);

    if (!normalizedRegistryId || !normalizedItemId || !normalizedOrderId) {
      return res.status(400).json({ error: "registryId, itemId, and orderId are required" });
    }

    const data = await setGiftAsPurchased({
      registryId: normalizedRegistryId,
      itemId: normalizedItemId,
      orderId: normalizedOrderId,
    });

    res.status(200).json({ purchase: data ?? null });
  }),
);

export default router;
