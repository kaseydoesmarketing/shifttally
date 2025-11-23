/**
 * ShiftTally Core Types
 * Pay calculation engine types for healthcare workers
 */

/**
 * US State codes (50 states + DC)
 */
export type USState =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL'
  | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME'
  | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH'
  | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI'
  | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI'
  | 'WY';

/**
 * Differential types available for healthcare workers
 */
export interface Differentials {
  /** Night shift differential (typically evening/overnight) */
  night: boolean;
  /** Weekend differential (Saturday/Sunday) */
  weekend: boolean;
  /** Holiday differential */
  holiday: boolean;
  /** Charge nurse differential */
  charge: boolean;
  /** Preceptor differential (training new nurses) */
  preceptor: boolean;
}

/**
 * Differential rate configuration ($/hr for each type)
 */
export interface DifferentialRates {
  night: number;
  weekend: number;
  holiday: number;
  charge: number;
  preceptor: number;
}

/**
 * Input for calculating a single shift's pay
 */
export interface ShiftInput {
  /** Base hourly rate in dollars */
  baseRate: number;
  /** Number of hours in this shift (e.g., 8, 10, 12) */
  shiftHours: number;
  /** Total hours already scheduled this week (for OT calculation) */
  weeklyHours: number;
  /** State where the nurse is working */
  state: USState;
  /** Which differentials are active for this shift */
  diffs: Differentials;
  /** Custom differential rates (optional, uses defaults if not provided) */
  diffRates?: Partial<DifferentialRates>;

  // Future expansion fields (ignored in v1, but typed for forward compatibility)
  /** Pre-tax deductions like 401k, HSA (future) */
  preTaxDeductions?: PreTaxDeductions;
  /** Post-tax deductions like union dues (future) */
  postTaxDeductions?: PostTaxDeductions;
  /** Traveler mode settings (future) */
  travelerMode?: TravelerSettings;
}

/**
 * Breakdown of pay components
 */
export interface PayBreakdown {
  /** Base pay before differentials and overtime */
  basePay: number;
  /** Total differential pay added */
  diffPay: number;
  /** Overtime pay component (1.5x for hours over 40/week) */
  overtimePay: number;
  /** Federal income tax withheld */
  federalTax: number;
  /** Social Security tax (FICA) */
  fica: number;
  /** Medicare tax */
  medicare: number;
  /** State income tax withheld */
  stateTax: number;
  /** Total taxes withheld */
  totalTax: number;
}

/**
 * Result of shift pay calculation
 */
export interface ShiftResult {
  /** Gross pay for this shift (before taxes) */
  gross: number;
  /** Estimated net pay for this shift (after taxes) */
  net: number;
  /** Detailed breakdown of pay components */
  breakdown: PayBreakdown;
  /** Effective hourly rate for this shift (gross / hours) */
  effectiveHourlyRate: number;
  /** Effective tax rate applied (totalTax / gross) */
  effectiveTaxRate: number;
}

/**
 * Facility preset - saved configuration for quick access
 */
export interface FacilityPreset {
  /** Unique identifier */
  id: string;
  /** Display name (e.g., "Tampa General - Night 12s") */
  name: string;
  /** Base hourly rate */
  baseRate: number;
  /** Typical shift length */
  shiftHours: number;
  /** Typical weekly hours */
  weeklyHours: number;
  /** Work state */
  state: USState;
  /** Default differentials for this preset */
  diffs: Differentials;
  /** Custom differential rates */
  diffRates?: Partial<DifferentialRates>;
  /** When this preset was created */
  createdAt: string;
  /** When this preset was last updated */
  updatedAt: string;
}

// ============================================================================
// Future expansion types (not implemented in v1, but defined for type safety)
// ============================================================================

/** Pre-tax deductions (future) */
export interface PreTaxDeductions {
  /** 401k contribution percentage */
  retirement401k?: number;
  /** HSA contribution per pay period */
  hsa?: number;
  /** FSA contribution per pay period */
  fsa?: number;
}

/** Post-tax deductions (future) */
export interface PostTaxDeductions {
  /** Union dues per pay period */
  unionDues?: number;
  /** Parking fees per pay period */
  parking?: number;
  /** Health insurance premium per pay period */
  healthInsurance?: number;
}

/** Traveler nurse settings (future) */
export interface TravelerSettings {
  /** Is this a travel nursing contract? */
  enabled: boolean;
  /** Tax-free housing stipend per week */
  housingStipend?: number;
  /** Tax-free meals & incidentals per day */
  miePerDiem?: number;
  /** Tax-free travel reimbursement */
  travelReimbursement?: number;
}

// ============================================================================
// Default values
// ============================================================================

/** Default differential rates in $/hr (typical for most facilities) */
export const DEFAULT_DIFF_RATES: DifferentialRates = {
  night: 3.00,
  weekend: 2.50,
  holiday: 5.00,
  charge: 2.00,
  preceptor: 1.50,
};

/** Default weekly hours threshold for overtime */
export const DEFAULT_WEEKLY_HOURS = 40;

/** Overtime multiplier (time and a half) */
export const OVERTIME_MULTIPLIER = 1.5;
