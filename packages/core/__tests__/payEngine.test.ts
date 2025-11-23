/**
 * Unit tests for ShiftTally Pay Engine
 */

import {
  calculateShiftPay,
  calculateOvertimeHours,
  calculateDiffPerHour,
  DEFAULT_DIFF_RATES,
  FICA_RATE,
  MEDICARE_RATE,
  FEDERAL_TAX_RATE_DEFAULT,
  getStateTaxRate,
} from '../src';

// Helper to create a basic input
const createInput = (overrides: Partial<Parameters<typeof calculateShiftPay>[0]> = {}) => ({
  baseRate: 35,
  shiftHours: 12,
  weeklyHours: 0,
  state: 'FL' as const,
  diffs: {
    night: false,
    weekend: false,
    holiday: false,
    charge: false,
    preceptor: false,
  },
  ...overrides,
});

describe('calculateOvertimeHours', () => {
  it('returns all regular hours when under 40/week', () => {
    const result = calculateOvertimeHours(12, 24);
    expect(result).toEqual({ regularHours: 12, overtimeHours: 0 });
  });

  it('returns all overtime hours when already at 40/week', () => {
    const result = calculateOvertimeHours(12, 40);
    expect(result).toEqual({ regularHours: 0, overtimeHours: 12 });
  });

  it('splits hours when shift crosses 40/week threshold', () => {
    const result = calculateOvertimeHours(12, 36);
    expect(result).toEqual({ regularHours: 4, overtimeHours: 8 });
  });

  it('handles edge case at exactly 40 hours', () => {
    const result = calculateOvertimeHours(8, 32);
    expect(result).toEqual({ regularHours: 8, overtimeHours: 0 });
  });
});

describe('calculateDiffPerHour', () => {
  it('returns 0 when no diffs enabled', () => {
    const result = calculateDiffPerHour({
      night: false,
      weekend: false,
      holiday: false,
      charge: false,
      preceptor: false,
    });
    expect(result).toBe(0);
  });

  it('returns single diff rate when one enabled', () => {
    const result = calculateDiffPerHour({
      night: true,
      weekend: false,
      holiday: false,
      charge: false,
      preceptor: false,
    });
    expect(result).toBe(DEFAULT_DIFF_RATES.night);
  });

  it('stacks multiple differentials', () => {
    const result = calculateDiffPerHour({
      night: true,
      weekend: true,
      holiday: false,
      charge: false,
      preceptor: false,
    });
    expect(result).toBe(DEFAULT_DIFF_RATES.night + DEFAULT_DIFF_RATES.weekend);
  });

  it('uses custom rates when provided', () => {
    const customRates = { ...DEFAULT_DIFF_RATES, night: 5.00 };
    const result = calculateDiffPerHour(
      { night: true, weekend: false, holiday: false, charge: false, preceptor: false },
      customRates
    );
    expect(result).toBe(5.00);
  });
});

describe('calculateShiftPay', () => {
  describe('basic shift with no diffs, no OT', () => {
    it('calculates correctly for a simple 12-hour shift', () => {
      const input = createInput({
        baseRate: 35,
        shiftHours: 12,
        weeklyHours: 0,
        state: 'FL',
      });

      const result = calculateShiftPay(input);

      // Gross = 35 * 12 = $420
      expect(result.gross).toBe(420);
      expect(result.breakdown.basePay).toBe(420);
      expect(result.breakdown.diffPay).toBe(0);
      expect(result.breakdown.overtimePay).toBe(0);

      // Taxes (FL has no state tax)
      const expectedFederal = 420 * FEDERAL_TAX_RATE_DEFAULT;
      const expectedFica = 420 * FICA_RATE;
      const expectedMedicare = 420 * MEDICARE_RATE;
      const expectedTotal = expectedFederal + expectedFica + expectedMedicare;

      expect(result.breakdown.federalTax).toBeCloseTo(expectedFederal, 2);
      expect(result.breakdown.fica).toBeCloseTo(expectedFica, 2);
      expect(result.breakdown.medicare).toBeCloseTo(expectedMedicare, 2);
      expect(result.breakdown.stateTax).toBe(0);
      expect(result.breakdown.totalTax).toBeCloseTo(expectedTotal, 2);

      // Net
      expect(result.net).toBeCloseTo(420 - expectedTotal, 2);
    });
  });

  describe('shift with multiple differentials', () => {
    it('adds differential pay correctly', () => {
      const input = createInput({
        baseRate: 35,
        shiftHours: 12,
        weeklyHours: 0,
        diffs: {
          night: true,    // +$3
          weekend: true,  // +$2.50
          holiday: false,
          charge: false,
          preceptor: false,
        },
      });

      const result = calculateShiftPay(input);

      // Base pay = 35 * 12 = $420
      expect(result.breakdown.basePay).toBe(420);

      // Diff pay = (3 + 2.50) * 12 = $66
      expect(result.breakdown.diffPay).toBe(66);

      // Gross = 420 + 66 = $486
      expect(result.gross).toBe(486);
    });
  });

  describe('shift with weekly overtime', () => {
    it('calculates overtime premium correctly', () => {
      const input = createInput({
        baseRate: 40,
        shiftHours: 12,
        weeklyHours: 36, // Already worked 36 hours this week
        state: 'TX',
        diffs: {
          night: false,
          weekend: false,
          holiday: false,
          charge: false,
          preceptor: false,
        },
      });

      const result = calculateShiftPay(input);

      // 36 + 12 = 48 hours total
      // 4 hours regular, 8 hours overtime
      // Base pay = 40 * 12 = $480
      expect(result.breakdown.basePay).toBe(480);

      // OT premium = 8 hours * $40 * 0.5 = $160
      expect(result.breakdown.overtimePay).toBe(160);

      // Gross = 480 + 160 = $640
      expect(result.gross).toBe(640);
    });

    it('calculates overtime with differentials', () => {
      const input = createInput({
        baseRate: 40,
        shiftHours: 12,
        weeklyHours: 36,
        diffs: {
          night: true,    // +$3
          weekend: false,
          holiday: false,
          charge: false,
          preceptor: false,
        },
      });

      const result = calculateShiftPay(input);

      // Base pay = 40 * 12 = $480
      expect(result.breakdown.basePay).toBe(480);

      // Diff pay = 3 * 12 = $36
      expect(result.breakdown.diffPay).toBe(36);

      // OT premium = 8 hours * (40 + 3) * 0.5 = $172
      expect(result.breakdown.overtimePay).toBe(172);

      // Gross = 480 + 36 + 172 = $688
      expect(result.gross).toBe(688);
    });
  });

  describe('state tax variations', () => {
    it('applies no state tax in Florida', () => {
      const input = createInput({ state: 'FL' });
      const result = calculateShiftPay(input);
      expect(result.breakdown.stateTax).toBe(0);
    });

    it('applies state tax in California', () => {
      const input = createInput({ state: 'CA' });
      const result = calculateShiftPay(input);
      expect(result.breakdown.stateTax).toBeGreaterThan(0);
      expect(result.breakdown.stateTax).toBeCloseTo(result.gross * getStateTaxRate('CA'), 2);
    });

    it('applies state tax in New York', () => {
      const input = createInput({ state: 'NY' });
      const result = calculateShiftPay(input);
      expect(result.breakdown.stateTax).toBeGreaterThan(0);
    });
  });

  describe('effective rates', () => {
    it('calculates effective hourly rate', () => {
      const input = createInput({
        baseRate: 35,
        shiftHours: 12,
        weeklyHours: 0,
      });
      const result = calculateShiftPay(input);
      expect(result.effectiveHourlyRate).toBe(35); // No OT or diffs
    });

    it('shows higher effective rate with overtime', () => {
      const input = createInput({
        baseRate: 40,
        shiftHours: 12,
        weeklyHours: 36,
      });
      const result = calculateShiftPay(input);
      // Effective rate should be higher than base due to OT
      expect(result.effectiveHourlyRate).toBeGreaterThan(40);
    });
  });

  describe('input validation', () => {
    it('throws error for negative base rate', () => {
      const input = createInput({ baseRate: -10 });
      expect(() => calculateShiftPay(input)).toThrow('Base rate cannot be negative');
    });

    it('throws error for negative shift hours', () => {
      const input = createInput({ shiftHours: -5 });
      expect(() => calculateShiftPay(input)).toThrow('Shift hours cannot be negative');
    });

    it('throws error for negative weekly hours', () => {
      const input = createInput({ weeklyHours: -10 });
      expect(() => calculateShiftPay(input)).toThrow('Weekly hours cannot be negative');
    });
  });

  describe('realistic scenarios', () => {
    it('calculates correctly for a typical night shift RN in Texas', () => {
      // RN making $45/hr, 12-hour night shift, 36 hours already worked
      const input = createInput({
        baseRate: 45,
        shiftHours: 12,
        weeklyHours: 36,
        state: 'TX', // No state tax
        diffs: {
          night: true,    // +$3
          weekend: false,
          holiday: false,
          charge: false,
          preceptor: false,
        },
      });

      const result = calculateShiftPay(input);

      // Expected gross:
      // Base: 45 * 12 = $540
      // Diff: 3 * 12 = $36
      // OT premium: 8 * (45 + 3) * 0.5 = $192
      // Total gross: $768
      expect(result.gross).toBe(768);

      // Effective hourly: 768 / 12 = $64/hr
      expect(result.effectiveHourlyRate).toBe(64);

      // Net should be gross minus federal taxes only (no state tax in TX)
      const expectedTax = result.gross * (FEDERAL_TAX_RATE_DEFAULT + FICA_RATE + MEDICARE_RATE);
      expect(result.net).toBeCloseTo(result.gross - expectedTax, 2);
    });

    it('calculates correctly for a travel nurse holiday shift in California', () => {
      // Travel RN making $55/hr, holiday + charge nurse, 3rd 12-hour shift of the week
      const input = createInput({
        baseRate: 55,
        shiftHours: 12,
        weeklyHours: 24, // Already worked 2 shifts (24 hours)
        state: 'CA',
        diffs: {
          night: false,
          weekend: false,
          holiday: true,  // +$5
          charge: true,   // +$2
          preceptor: false,
        },
      });

      const result = calculateShiftPay(input);

      // No overtime (24 + 12 = 36, under 40)
      expect(result.breakdown.overtimePay).toBe(0);

      // Base: 55 * 12 = $660
      expect(result.breakdown.basePay).toBe(660);

      // Diff: (5 + 2) * 12 = $84
      expect(result.breakdown.diffPay).toBe(84);

      // Gross: $744
      expect(result.gross).toBe(744);

      // CA has ~8% state tax
      expect(result.breakdown.stateTax).toBeGreaterThan(50);
    });
  });
});
