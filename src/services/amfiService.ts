/**
 * AMFI India (Association of Mutual Funds in India) Live Service
 * Queries official AMFI daily NAVs & historical series via official AMFI portal & mfapi.in mirror.
 */

export interface AmfiNavEntry {
  schemeCode: string;
  isin?: string;
  schemeName: string;
  nav: number;
  date: string;
}

export interface AmfiHistoricalPoint {
  date: string;
  nav: string;
}

export interface AmfiSchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    isin_growth?: string;
  };
  data: AmfiHistoricalPoint[];
}

const AMFI_CACHE_KEY = 'finsight_amfi_cache';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export class AmfiService {
  /**
   * Fetches latest NAV for a specific AMFI scheme code (e.g. 122639 for Parag Parikh Flexi Cap).
   */
  static async getSchemeNav(schemeCode: string | number): Promise<AmfiNavEntry | null> {
    try {
      const codeStr = String(schemeCode);
      const res = await fetch(`https://api.mfapi.in/mf/${codeStr}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AmfiSchemeDetails = await res.json();
      
      if (data && data.data && data.data.length > 0) {
        const latest = data.data[0];
        return {
          schemeCode: codeStr,
          isin: data.meta.isin_growth,
          schemeName: data.meta.scheme_name,
          nav: parseFloat(latest.nav),
          date: latest.date,
        };
      }
    } catch (e) {
      console.warn(`[AmfiService] Live fetch failed for scheme ${schemeCode}, checking local market snapshot...`, e);
    }

    // Fallback to local synced snapshot
    try {
      const snapshotRes = await fetch('/data/latest-market-data.json');
      if (snapshotRes.ok) {
        const snapshot = await snapshotRes.json();
        if (snapshot.mutualFunds && snapshot.mutualFunds[schemeCode]) {
          return snapshot.mutualFunds[schemeCode];
        }
      }
    } catch (err) {
      console.error('[AmfiService] Failed to load local snapshot:', err);
    }

    return null;
  }

  /**
   * Fetches full historical series for an AMFI scheme to compute exact multi-year returns.
   */
  static async getSchemeHistory(schemeCode: string | number): Promise<AmfiSchemeDetails | null> {
    try {
      const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[AmfiService] History fetch failed for ${schemeCode}:`, e);
      return null;
    }
  }

  /**
   * Calculates actual CAGR between two dates given historical NAV points.
   */
  static calculateCagr(startNav: number, endNav: number, years: number): number {
    if (startNav <= 0 || endNav <= 0 || years <= 0) return 0;
    return parseFloat(((Math.pow(endNav / startNav, 1 / years) - 1) * 100).toFixed(2));
  }
}
