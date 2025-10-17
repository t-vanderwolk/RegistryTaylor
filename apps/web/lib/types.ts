export type Journey = {
  id: string;
  slug: string;
  title: string;
  order_idx: number;
  created_at?: string;
  updated_at?: string;
  totalModules: number;
  completedModules: number;
};

export type Track = {
  id: string;
  slug: string;
  title: string;
  order_idx: number;
  journey_id: string;
  created_at?: string;
  updated_at?: string;
  totalModules: number;
  completedModules: number;
};

export type Module = {
  id: string;
  track_id: string;
  code: string;
  title: string;
  subtitle: string | null;
  order_idx: number;
  est_minutes: number;
  cover_icon: string | null;
  created_at?: string;
  updated_at?: string;
  completed?: boolean;
};

export type ModuleContent = {
  id: string;
  module_id: string;
  explore: string;
  lecture: { bullets: string[] };
  journal_prompt: string;
  apply: { items: Array<{ id: string; text: string }> };
};

export type ProgressRecord = {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  checklist_state: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

export type AffiliateProduct = {
  id: string;
  category: string;
  brand: string;
  name: string;
  image_url: string | null;
  product_url: string;
  price: number | string;
  active: boolean;
};

export type ModuleDetailResponse = {
  module: Module & {
    track_slug: string;
    track_title: string;
    journey_slug: string;
    journey_title: string;
  };
  content: ModuleContent;
  progress: ProgressRecord | null;
  suggestions: AffiliateProduct[];
};

export type RegistryItem = {
  id: string;
  user_id: string;
  module_id?: string | null;
  affiliate_product_id: string | null;
  status: "suggested" | "added" | "removed";
  mentor_notes: string | null;
  created_at: string;
  product: AffiliateProduct | null;
};

export type CommunityComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type CommunityPost = {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  image_url: string | null;
  is_anonymous: boolean;
  created_at: string;
  comments: CommunityComment[];
};

export type InviteRecord = {
  id: string;
  code: string;
  created_by: string | null;
  is_active: boolean;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  used_by_username?: string | null;
  used_by_email?: string | null;
};
