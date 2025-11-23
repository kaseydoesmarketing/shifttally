/**
 * Tax Data for ShiftTally
 *
 * MVP implementation uses effective tax rate approximations.
 * These rates represent typical effective rates for healthcare worker income levels.
 *
 * Future versions will implement:
 * - Progressive federal tax brackets
 * - State-specific bracket calculations
 * - Local taxes (NYC, Philadelphia, etc.)
 * - SDI where applicable
 */

import { USState } from './types';

// ============================================================================
// Federal Tax Constants
// ============================================================================

/**
 * Default federal tax rate (flat approximation for MVP)
 * Based on typical RN salary in the 22% bracket with deductions
 * This is an effective rate estimate, not marginal
 */
export const FEDERAL_TAX_RATE_DEFAULT = 0.15;

/** Social Security (FICA) rate */
export const FICA_RATE = 0.062;

/** Medicare rate */
export const MEDICARE_RATE = 0.0145;

/** Social Security wage base limit for 2024 */
export const FICA_WAGE_BASE = 168600;

// ============================================================================
// State Tax Rates
// ============================================================================

/**
 * Effective state income tax rates by state
 * These are approximations based on typical healthcare worker income ($60-100k)
 *
 * Sources: Tax Foundation, state tax authority websites
 * Note: Some states have no income tax (0%)
 */
export const STATE_TAX_RATES: Record<USState, number> = {
  // No income tax states
  AK: 0,
  FL: 0,
  NV: 0,
  NH: 0,  // Tax on interest/dividends only, not wages
  SD: 0,
  TN: 0,  // Tax on interest/dividends only (phased out), not wages
  TX: 0,
  WA: 0,
  WY: 0,

  // Low tax states (0-3%)
  ND: 0.0175,
  PA: 0.0307,  // Flat rate
  IN: 0.0305,  // Flat rate (plus local)
  MI: 0.0425,  // Flat rate
  AZ: 0.025,   // Flat rate (reduced in 2023)

  // Moderate tax states (3-5%)
  CO: 0.044,   // Flat rate (reduced)
  IL: 0.0495,  // Flat rate
  KY: 0.04,    // Flat rate (reduced 2024)
  MA: 0.05,    // Flat rate (plus surtax on high income)
  NC: 0.0475,  // Flat rate (reduced)
  UT: 0.0465,  // Flat rate

  // Higher tax states (5-7%)
  AL: 0.05,
  AR: 0.044,   // Top rate reduced
  CT: 0.055,
  DE: 0.055,
  GA: 0.055,   // Moving to flat rate
  HI: 0.065,
  ID: 0.058,
  IA: 0.044,   // Flat rate (new 2024)
  KS: 0.054,
  LA: 0.0425,
  ME: 0.065,
  MD: 0.05,    // Plus county tax
  MN: 0.068,
  MS: 0.05,
  MO: 0.048,
  MT: 0.059,
  NE: 0.059,
  NJ: 0.055,
  NM: 0.049,
  NY: 0.06,    // Plus NYC tax if applicable
  OH: 0.035,   // Reduced rates
  OK: 0.0475,
  OR: 0.085,   // High rate, no sales tax
  RI: 0.0475,
  SC: 0.065,
  VT: 0.066,
  VA: 0.0575,
  WV: 0.055,
  WI: 0.053,
  DC: 0.065,

  // Highest tax states (7%+)
  CA: 0.08,    // Effective rate at healthcare worker income
};

/**
 * Get the effective state tax rate for a given state
 */
export function getStateTaxRate(state: USState): number {
  return STATE_TAX_RATES[state] ?? 0;
}

/**
 * State display names for UI
 */
export const STATE_NAMES: Record<USState, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

/**
 * Get all states sorted alphabetically by name for UI dropdowns
 */
export function getAllStatesSorted(): Array<{ code: USState; name: string; taxRate: number }> {
  return (Object.keys(STATE_NAMES) as USState[])
    .map(code => ({
      code,
      name: STATE_NAMES[code],
      taxRate: STATE_TAX_RATES[code],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
