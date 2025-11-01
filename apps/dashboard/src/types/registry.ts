export type RegistryCategory = "Nursery" | "Gear" | "Postpartum" | "Uncategorized";
export type RegistrySource =
  | "macro"
  | "silvercross"
  | "awin"
  | "cj"
  | "myregistry"
  | "babylist"
  | "impact"
  | "static";

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
  importedFrom?: string | null;
  url?: string | null;
  mentorNote?: string | null;
};

export type RegistryNote = {
  id: string;
  userId: string;
  productId: string;
  mentorId?: string;
  note: string;
  createdAt: string;
  updatedAt?: string;
};

export type RegistryCatalogItem = {
  id: string;
  externalId?: string | null;
  title: string;
  brand?: string | null;
  price?: number | null;
  category?: string | null;
  image?: string | null;
  url?: string | null;
  affiliateUrl?: string | null;
  retailer?: string | null;
  source: RegistrySource;
};
