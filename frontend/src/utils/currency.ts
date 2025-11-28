/**
 * Currency conversion and formatting utilities
 * Backend stores prices in USD, frontend displays in VND
 */

// Current exchange rate (update periodically)
const USD_TO_VND_RATE = 24000; // 1 USD = 24,000 VND

/**
 * Convert USD to VND
 * @param usdPrice - Price in USD
 * @returns Price in VND
 */
export const convertUsdToVnd = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_VND_RATE);
};

/**
 * Format price to Vietnamese currency
 * @param usdPrice - Price in USD from backend
 * @param showSymbol - Show currency symbol (default: true)
 * @returns Formatted price string in VND
 */
export const formatPrice = (
  usdPrice: number,
  showSymbol: boolean = true
): string => {
  if (typeof usdPrice !== "number" || isNaN(usdPrice)) {
    return "0 ₫";
  }

  // Convert USD to VND
  const vndPrice = convertUsdToVnd(usdPrice);

  if (showSymbol) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(vndPrice);
  }

  return new Intl.NumberFormat("vi-VN").format(vndPrice);
};

/**
 * Format price in USD (for display purposes)
 */
export const formatPriceUsd = (usdPrice: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(usdPrice);
};

/**
 * Format price to compact notation (e.g., 2.4M ₫)
 */
export const formatPriceCompact = (usdPrice: number): string => {
  const vndPrice = convertUsdToVnd(usdPrice);

  if (vndPrice >= 1000000) {
    return `${(vndPrice / 1000000).toFixed(1)}M ₫`;
  }
  if (vndPrice >= 1000) {
    return `${(vndPrice / 1000).toFixed(0)}K ₫`;
  }
  return `${vndPrice} ₫`;
};

/**
 * Parse VND price string to USD number (for backend)
 */
export const parseVndToUsd = (vndPriceString: string): number => {
  const cleaned = vndPriceString.replace(/[^\d]/g, "");
  const vndPrice = parseInt(cleaned, 10) || 0;
  return Math.round(vndPrice / USD_TO_VND_RATE);
};

/**
 * Calculate discount price
 */
export const calculateDiscount = (
  originalUsdPrice: number,
  discountPercent: number
): number => {
  const discountAmount = (originalUsdPrice * discountPercent) / 100;
  return originalUsdPrice - discountAmount;
};

/**
 * Format price range
 */
export const formatPriceRange = (minUsd: number, maxUsd: number): string => {
  return `${formatPrice(minUsd)} - ${formatPrice(maxUsd)}`;
};

/**
 * Get exchange rate
 */
export const getExchangeRate = (): number => {
  return USD_TO_VND_RATE;
};

/**
 * Format with both USD and VND
 */
export const formatPriceDual = (usdPrice: number): string => {
  const vndPrice = convertUsdToVnd(usdPrice);
  return `${formatPriceUsd(usdPrice)} (${formatPrice(usdPrice)})`;
};
