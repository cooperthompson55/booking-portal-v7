export interface DiscountTier {
  threshold: number;
  percentage: number;
}

export const discountTiers: DiscountTier[] = [
  { threshold: 199.99, percentage: 3 },
  { threshold: 350, percentage: 5 },
  { threshold: 500, percentage: 10 },
  { threshold: 700, percentage: 12 },
  { threshold: 900, percentage: 15 },
  { threshold: 1100, percentage: 17 }
];

export const getDiscount = (subtotal: number): DiscountTier | null => {
  return [...discountTiers]
    .reverse()
    .find(tier => subtotal >= tier.threshold) || null;
};