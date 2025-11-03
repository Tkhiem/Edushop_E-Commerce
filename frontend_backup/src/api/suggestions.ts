import { mockProducts } from "@/data/products";
import { getFavorites } from "@/utils/favoriteStorage";
import { getViewedProducts } from "@/utils/viewedStorage";
import { getCartItems } from "@/utils/cartStorage";
import type { Product } from "@/types/product";

type SuggestionContext = "home" | "cart";

export async function fetchSuggestions(
  userId: string,
  context: SuggestionContext = "home"
): Promise<Product[]> {
  const favorites = getFavorites();
  const viewed = getViewedProducts().map((v) => v.product);
  const cart = getCartItems().map((v) => v.product);

  const all = [...favorites, ...viewed, ...cart];
  // const allIds = new Set(all.map((p) => p.id));
  const cartIds = new Set(cart.map((p) => p.id));

  if (context === "home" && all.length === 0) {
    return mockProducts
      .filter((p) => p.rating >= 4.5 && p.countRating >= 100)
      .slice(0, 6);
  }

  console.log(userId);

  const categoryScore = new Map<string, number>();
  const tagScore = new Map<string, number>();
  const levelScore = new Map<Product["level"], number>();

  for (const p of all) {
    categoryScore.set(p.category, (categoryScore.get(p.category) || 0) + 3);
    for (const tag of p.tags) {
      tagScore.set(tag, (tagScore.get(tag) || 0) + 2);
    }
    levelScore.set(p.level, (levelScore.get(p.level) || 0) + 2);
  }

  const scored: { product: Product; score: number }[] = [];

  for (const product of mockProducts) {
    if (context === "cart" && cartIds.has(product.id)) continue;
    // if (context === "home" && allIds.has(product.id)) continue;

    let score = 0;
    score += categoryScore.get(product.category) || 0;
    score += levelScore.get(product.level) || 0;
    for (const tag of product.tags) {
      score += tagScore.get(tag) || 0;
    }

    if (favorites.find((f) => f.id === product.id)) score += 10;
    if (cart.find((c) => c.id === product.id)) score += 6;
    if (viewed.find((v) => v.id === product.id)) score += 3;

    if (product.rating >= 4.2) score += 1;
    if (product.countRating >= 200) score += 1;

    if (score > 0) {
      scored.push({ product, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map((s) => s.product);
}
