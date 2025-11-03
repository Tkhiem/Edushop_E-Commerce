import { type Product } from "@/types/product";

export function calculateOriginalTotal(items: { product: Product }[]): number {
  return items.reduce((acc, item) => acc + item.product.originalPrice, 0);
}

export function calculateCurrentTotal(items: { product: Product }[]): number {
  return items.reduce((acc, item) => acc + item.product.price, 0);
}

export function calculateDiscountPercentage(
  original: number,
  current: number
): number {
  if (original === 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function calculateSavings(original: number, current: number): number {
  return original - current;
}
