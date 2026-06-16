import { getNames } from "country-list";

export const COUNTRIES = getNames().sort();

// Legacy code-only list (kept for existing imports). New code should use CURRENCIES from "@/lib/currencies".
import { CURRENCY_CODES } from "./currencies";
export const CURRENCIES = CURRENCY_CODES;

export const ACCOUNT_TYPES = [
  { value: "crypto_mining", label: "Crypto Mining" },
  { value: "pro_trader", label: "Pro Trader" },
  { value: "copy_trading", label: "Copy Trading" },
  { value: "ai_trading", label: "AI Trading" },
] as const;

export const PLANS = [
  { name: "Basic", min: 500, roi: 15, duration: 7, popular: false },
  { name: "Premium", min: 5000, roi: 20.5, duration: 14, popular: true },
  { name: "VIP", min: 10000, roi: 36.8, duration: 60, popular: false },
];

export const TRADERS = [
  { name: "Alex Petrov", roi: 245, winRate: 87, followers: 12480, avatar: "AP" },
  { name: "Sofia Chen", roi: 198, winRate: 82, followers: 9320, avatar: "SC" },
  { name: "Marcus Bell", roi: 176, winRate: 79, followers: 8104, avatar: "MB" },
  { name: "Yuki Tanaka", roi: 154, winRate: 76, followers: 6890, avatar: "YT" },
  { name: "Liam Walsh", roi: 142, winRate: 74, followers: 5210, avatar: "LW" },
  { name: "Aisha Khan", roi: 128, winRate: 71, followers: 4120, avatar: "AK" },
];