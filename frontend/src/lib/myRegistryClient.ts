import { apiFetch } from "@/lib/apiClient";

export type SignupPayload = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export type PurchasePayload = {
  registryId: string;
  itemId: string;
  orderId: string;
};

export async function myRegistryHealth() {
  return apiFetch<{ ok: boolean; data: unknown }>("/api/myregistry/health");
}

export async function myRegistrySignup(payload: SignupPayload) {
  return apiFetch<{ user: unknown }>("/api/myregistry/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function myRegistryShipping(registryId: string) {
  return apiFetch<{ shippingAddress: unknown }>(`/api/myregistry/shipping/${registryId}`);
}

export async function markMyRegistryPurchase(payload: PurchasePayload) {
  return apiFetch<{ purchase: unknown }>("/api/myregistry/purchase", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
