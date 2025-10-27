import React from "react";
import Card from "../../design-system/Card";
import Button from "../../design-system/Button";

export interface Product {
  id: string;
  name: string;
  priceCents?: number;
  metadata?: {
    raw?: {
      price?: string;
    };
  };
  title?: string;
  brand?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  affiliateUrl?: string | null;
  mentorNotes?: string | null;
  productId?: string | null;
}

export type RegistryProduct = Product;

type RegistryCardProps = {
  product: Product;
  onAdd?: (product: Product) => void;
  onOpenLink?: (url: string) => void;
  actionLabel?: string;
  disabled?: boolean;
  showMentorNotes?: boolean;
};

const RegistryCard: React.FC<RegistryCardProps> = ({
  product,
  onAdd,
  onOpenLink,
  actionLabel = "Add to My Registry",
  disabled = false,
  showMentorNotes = true,
}) => {
  const price =
    typeof product.priceCents === "number"
      ? `$${(product.priceCents / 100).toFixed(2)}`
      : product.metadata?.raw?.price ?? "Varies";

  const productTitle = product.title ?? product.name ?? "Product";
  const affiliateUrl = product.affiliateUrl ?? undefined;

  return (
    <Card className="flex h-full flex-col justify-between rounded-2xl border-mauve/20 bg-white/95 shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
      <div className="space-y-4">
        {product.imageUrl && (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-mauve/20 bg-ivory/80">
            <img
              src={product.imageUrl}
              alt={productTitle}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-mauve/75">
            {product.category && <span>{product.category}</span>}
            {product.brand && (
              <>
                <span aria-hidden="true">•</span>
                <span>{product.brand}</span>
              </>
            )}
          </div>
          <h3 className="font-heading text-xl text-charcoal">{productTitle}</h3>
          <p className="text-sm font-semibold text-charcoal/80">{price}</p>
        </div>
        {showMentorNotes && product.mentorNotes && (
          <div className="rounded-2xl border border-mauve/25 bg-mauve/10 p-4 text-xs text-charcoal/70 shadow-inner">
            <p className="font-heading uppercase tracking-[0.35em] text-mauve/80">Mentor Notes</p>
            <p className="mt-2 leading-relaxed">{product.mentorNotes}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {affiliateUrl && (
          <Button
            type="button"
            variant="gold"
            size="sm"
            className="w-full"
            onClick={() => onOpenLink?.(affiliateUrl)}
          >
            View Details
          </Button>
        )}
        {onAdd && (
          <Button
            type="button"
            variant="mauve"
            size="sm"
            className="w-full"
            disabled={disabled}
            onClick={() => onAdd(product)}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RegistryCard;
