import { ExamPreset } from '../types/preset';
import { DEFAULT_EXAM_PRESETS } from '../exam-presets/defaultPresets';

const PRESETS_STORAGE_KEY = 'examsnap_presets_v1';
const STATS_STORAGE_KEY = 'examsnap_usage_stats_v1';
const ADMIN_AUTH_KEY = 'examsnap_admin_session_v1';
const PRICING_STORAGE_KEY = 'examsnap_pricing_v1';
const PREMIUM_UNLOCKED_KEY = 'examsnap_premium_unlocked_v1';

export interface UsageStats {
  photosProcessed: number;
  signaturesProcessed: number;
  pdfsCompressed: number;
  totalSavedBytes: number;
  totalDocsPrepared: number;
  lastUpdated: string;
}

export interface PricingConfig {
  packPrice: number; // e.g. 29
  currency: string;  // "INR"
  symbol: string;    // "₹"
  badgeText: string;
  enabled: boolean;
}

export const DEFAULT_PRICING: PricingConfig = {
  packPrice: 0,
  currency: 'INR',
  symbol: '₹',
  badgeText: '100% Free Forever',
  enabled: true
};

export function getSavedPresets(): ExamPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return DEFAULT_EXAM_PRESETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_EXAM_PRESETS;
  } catch (e) {
    console.error('Failed to load presets from localStorage', e);
    return DEFAULT_EXAM_PRESETS;
  }
}

export function savePresets(presets: ExamPreset[]): void {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save presets to localStorage', e);
  }
}

export function resetPresetsToDefault(): ExamPreset[] {
  try {
    localStorage.removeItem(PRESETS_STORAGE_KEY);
    return DEFAULT_EXAM_PRESETS;
  } catch (e) {
    return DEFAULT_EXAM_PRESETS;
  }
}

export function getUsageStats(): UsageStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) {
      return {
        photosProcessed: 1420,
        signaturesProcessed: 980,
        pdfsCompressed: 615,
        totalSavedBytes: 104857600, // ~100 MB saved
        totalDocsPrepared: 3015,
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      photosProcessed: 1420,
      signaturesProcessed: 980,
      pdfsCompressed: 615,
      totalSavedBytes: 104857600,
      totalDocsPrepared: 3015,
      lastUpdated: new Date().toISOString()
    };
  }
}

export function incrementUsageStat(type: 'photo' | 'signature' | 'pdf', savedBytes: number = 0): void {
  try {
    const stats = getUsageStats();
    if (type === 'photo') stats.photosProcessed += 1;
    if (type === 'signature') stats.signaturesProcessed += 1;
    if (type === 'pdf') stats.pdfsCompressed += 1;
    stats.totalDocsPrepared += 1;
    stats.totalSavedBytes += Math.max(0, savedBytes);
    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    // Ignore error
  }
}

export function getPricingConfig(): PricingConfig {
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (!raw) return DEFAULT_PRICING;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PRICING;
  }
}

export function savePricingConfig(pricing: PricingConfig): void {
  try {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(pricing));
  } catch (e) {
    console.error('Failed to save pricing config', e);
  }
}

export function isPremiumUnlocked(): boolean {
  return true; // 100% Free for all aspirants & users!
}

export function setPremiumUnlocked(unlocked: boolean): void {
  try {
    localStorage.setItem(PREMIUM_UNLOCKED_KEY, unlocked ? 'true' : 'false');
  } catch (e) {
    // Ignore
  }
}

export function getAdminSession(): { isAuthenticated: boolean; email: string; token: string; expiresAt: number } | null {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

export function saveAdminSession(email: string, token: string): void {
  try {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours session
    localStorage.setItem(
      ADMIN_AUTH_KEY,
      JSON.stringify({ isAuthenticated: true, email, token, expiresAt })
    );
  } catch (e) {
    console.error('Failed to save admin session', e);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  } catch (e) {
    // Ignore
  }
}
