import type { CartItem } from "../types/cart";

export type CheckoutHistoryItem = {
  courseId?: string;
  title?: string;
  price?: number;
  thumbnail?: string;
  slug?: string;
};

export interface PurchaseHistoryEntry {
  id: string;
  userId: string;
  totalUsd: number;
  totalVnd?: number;
  currency: string;
  paymentMethod: "paypal" | "vnpay";
  purchasedAt: string;
  items: CheckoutHistoryItem[];
}

export interface PendingPurchasePayload {
  cartItems: CheckoutHistoryItem[];
  totalUsd: number;
  totalVnd?: number;
  currency: string;
  paymentMethod: "paypal" | "vnpay";
  createdAt: string;
}

const HISTORY_KEY = "edushop_purchase_history";
const PENDING_KEY = "edushop_pending_purchase";

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readStorage = <T>(key: string): T | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Không thể đọc dữ liệu từ ${key}`, error);
    return null;
  }
};

const writeStorage = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Không thể ghi dữ liệu vào ${key}`, error);
  }
};

export const mapCartItemsToHistory = (
  items: CartItem[] | undefined | null
): CheckoutHistoryItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      courseId: item?.id || item?._id,
      title: item?.title,
      price: item?.discountedPrice ?? item?.price ?? 0,
      thumbnail: item?.thumbnail,
      slug: item?.slug,
    }))
    .filter((item) => !!item.courseId);
};

export const getPurchaseHistory = (userId: string): PurchaseHistoryEntry[] => {
  const history = readStorage<PurchaseHistoryEntry[]>(HISTORY_KEY) || [];

  console.log("history:", history);
  return history.filter((h) => h.userId === userId);
};

export const addPurchaseHistory = (
  entry: PurchaseHistoryEntry
): PurchaseHistoryEntry[] => {
  const history = readStorage<PurchaseHistoryEntry[]>(HISTORY_KEY) || [];
  // Nếu ID đã tồn tại thì KHÔNG thêm nữa
  if (history.some((h) => h.id === entry.id)) {
    return history;
  }
  const nextHistory = [entry, ...history];
  writeStorage(HISTORY_KEY, nextHistory);
  return nextHistory;
};

export const savePendingPurchase = (payload: PendingPurchasePayload) => {
  writeStorage(PENDING_KEY, payload);
};

export const getPendingPurchase = (): PendingPurchasePayload | null => {
  return readStorage<PendingPurchasePayload>(PENDING_KEY);
};

export const clearPendingPurchase = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(PENDING_KEY);
};
