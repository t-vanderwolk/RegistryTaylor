export type RegistryCategory = "Nursery" | "Gear" | "Postpartum";
export type RegistrySource = "macro" | "silvercross" | "awin" | "cj" | "myregistry";

export type RegistryItem = {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  price: number | null;
  affiliateUrl: string;
  category: RegistryCategory;
  registrySource: RegistrySource;
  affiliateId?: string | null;
  retailer?: string | null;
  description?: string | null;
  externalId?: string | null;
  mentorNote?: string | null;
};

export type RegistryNote = {
  id: string;
  userId: string;
  productId: string;
  note: string;
  createdAt: string;
  updatedAt?: string;
};
