/**
 * @shifttally/core
 *
 * Pay calculation engine for healthcare workers
 */

// Main calculation function
export { calculateShiftPay, calculateGrossPay, calculateTaxes, calculateDiffPerHour, calculateOvertimeHours, formatCurrency, formatPercent } from './payEngine';

// Types
export type {
  USState,
  Differentials,
  DifferentialRates,
  ShiftInput,
  ShiftResult,
  PayBreakdown,
  FacilityPreset,
  PreTaxDeductions,
  PostTaxDeductions,
  TravelerSettings,
} from './types';

// Constants
export {
  DEFAULT_DIFF_RATES,
  DEFAULT_WEEKLY_HOURS,
  OVERTIME_MULTIPLIER,
} from './types';

// Tax data
export {
  FEDERAL_TAX_RATE_DEFAULT,
  FICA_RATE,
  MEDICARE_RATE,
  FICA_WAGE_BASE,
  STATE_TAX_RATES,
  STATE_NAMES,
  getStateTaxRate,
  getAllStatesSorted,
} from './taxData';
