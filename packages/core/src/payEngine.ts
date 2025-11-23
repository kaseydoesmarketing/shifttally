/**
 * ShiftTally Pay Engine
 *
 * Core calculation logic for healthcare worker shift pay.
 * This module is designed to be:
 * - Pure and side-effect free
 * - Fully testable
 * - Portable (can run in React Native, Node, or browser)
 */

import {
  ShiftInput,
  ShiftResult,
  PayBreakdown,
  Differentials,
  DifferentialRates,
  DEFAULT_DIFF_RATES,
  OVERTIME_MULTIPLIER,
} from './types';

import {
  FEDERAL_TAX_RATE_DEFAULT,
  FICA_RATE,
  MEDICARE_RATE,
  getStateTaxRate,
} from './taxData';

/**
 * Calculate total differential pay per hour
 *
 * Differentials stack additively (e.g., night + weekend = both rates added)
 */
export function calculateDiffPerHour(
  diffs: Differentials,
  rates: DifferentialRates = DEFAULT_DIFF_RATES
): number {
  let total = 0;

  if (diffs.night) total += rates.night;
  if (diffs.weekend) total += rates.weekend;
  if (diffs.holiday) total += rates.holiday;
  if (diffs.charge) total += rates.charge;
  if (diffs.preceptor) total += rates.preceptor;

  return total;
}

/**
 * Calculate overtime hours for a shift given weekly context
 *
 * Standard overtime: hours over 40/week at 1.5x
 *
 * Example:
 * - Weekly hours already worked: 36
 * - This shift: 12 hours
 * - Regular hours this shift: 4 (to reach 40)
 * - Overtime hours this shift: 8 (over 40)
 */
export function calculateOvertimeHours(
  shiftHours: number,
  weeklyHoursAlready: number,
  overtimeThreshold: number = 40
): { regularHours: number; overtimeHours: number } {
  const totalAfterShift = weeklyHoursAlready + shiftHours;

  if (weeklyHoursAlready >= overtimeThreshold) {
    // Already in overtime - entire shift is OT
    return {
      regularHours: 0,
      overtimeHours: shiftHours,
    };
  }

  if (totalAfterShift <= overtimeThreshold) {
    // Entire shift is regular time
    return {
      regularHours: shiftHours,
      overtimeHours: 0,
    };
  }

  // Shift crosses the overtime threshold
  const regularHours = overtimeThreshold - weeklyHoursAlready;
  const overtimeHours = shiftHours - regularHours;

  return {
    regularHours,
    overtimeHours,
  };
}

/**
 * Calculate gross pay for a shift
 *
 * Formula:
 * - Regular hours: (baseRate + diffs) * regularHours
 * - Overtime hours: (baseRate + diffs) * 1.5 * overtimeHours
 */
export function calculateGrossPay(
  baseRate: number,
  shiftHours: number,
  weeklyHours: number,
  diffs: Differentials,
  diffRates?: Partial<DifferentialRates>
): { gross: number; basePay: number; diffPay: number; overtimePay: number } {
  const rates: DifferentialRates = { ...DEFAULT_DIFF_RATES, ...diffRates };
  const diffPerHour = calculateDiffPerHour(diffs, rates);
  const effectiveRate = baseRate + diffPerHour;

  const { regularHours, overtimeHours } = calculateOvertimeHours(shiftHours, weeklyHours);

  // Base pay (base rate only, regular hours)
  const basePay = baseRate * shiftHours;

  // Differential pay (diff rate * all hours, not affected by OT multiplier on diff portion)
  // Note: Some facilities do apply OT to diffs. This is configurable in future versions.
  const diffPay = diffPerHour * shiftHours;

  // Overtime premium (the extra 0.5x on overtime hours)
  // Applied to base + diffs for the overtime portion
  const overtimePay = overtimeHours * effectiveRate * (OVERTIME_MULTIPLIER - 1);

  const gross = basePay + diffPay + overtimePay;

  return {
    gross,
    basePay,
    diffPay,
    overtimePay,
  };
}

/**
 * Calculate tax withholdings for a gross amount
 *
 * MVP uses flat effective rates. Future versions will implement:
 * - Progressive federal brackets
 * - State-specific calculations
 * - Pre-tax deduction handling
 */
export function calculateTaxes(
  grossPay: number,
  state: string,
  federalRate: number = FEDERAL_TAX_RATE_DEFAULT
): {
  federalTax: number;
  fica: number;
  medicare: number;
  stateTax: number;
  totalTax: number;
} {
  const federalTax = grossPay * federalRate;
  const fica = grossPay * FICA_RATE;
  const medicare = grossPay * MEDICARE_RATE;
  const stateTax = grossPay * getStateTaxRate(state as any);

  const totalTax = federalTax + fica + medicare + stateTax;

  return {
    federalTax,
    fica,
    medicare,
    stateTax,
    totalTax,
  };
}

/**
 * Main calculation function: Calculate pay for a single shift
 *
 * This is the primary API for the pay engine.
 *
 * @param input - Shift details including rate, hours, state, and differentials
 * @returns Complete pay calculation with gross, net, and detailed breakdown
 *
 * @example
 * ```ts
 * const result = calculateShiftPay({
 *   baseRate: 35,
 *   shiftHours: 12,
 *   weeklyHours: 36,
 *   state: 'FL',
 *   diffs: { night: true, weekend: false, holiday: false, charge: false, preceptor: false },
 * });
 *
 * console.log(result.gross); // ~$474
 * console.log(result.net);   // ~$365 (FL has no state tax)
 * ```
 */
export function calculateShiftPay(input: ShiftInput): ShiftResult {
  const {
    baseRate,
    shiftHours,
    weeklyHours,
    state,
    diffs,
    diffRates,
  } = input;

  // Validate inputs
  if (baseRate < 0) throw new Error('Base rate cannot be negative');
  if (shiftHours < 0) throw new Error('Shift hours cannot be negative');
  if (weeklyHours < 0) throw new Error('Weekly hours cannot be negative');

  // Calculate gross pay components
  const { gross, basePay, diffPay, overtimePay } = calculateGrossPay(
    baseRate,
    shiftHours,
    weeklyHours,
    diffs,
    diffRates
  );

  // Calculate taxes
  const taxes = calculateTaxes(gross, state);

  // Calculate net pay
  const net = gross - taxes.totalTax;

  // Build breakdown
  const breakdown: PayBreakdown = {
    basePay,
    diffPay,
    overtimePay,
    federalTax: taxes.federalTax,
    fica: taxes.fica,
    medicare: taxes.medicare,
    stateTax: taxes.stateTax,
    totalTax: taxes.totalTax,
  };

  // Calculate effective rates
  const effectiveHourlyRate = shiftHours > 0 ? gross / shiftHours : 0;
  const effectiveTaxRate = gross > 0 ? taxes.totalTax / gross : 0;

  return {
    gross,
    net,
    breakdown,
    effectiveHourlyRate,
    effectiveTaxRate,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
}
