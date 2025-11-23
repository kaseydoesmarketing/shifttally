/**
 * Pay result display component
 * Shows gross/net with detailed breakdown
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { ShiftResult, formatCurrency, formatPercent } from '@shifttally/core';

interface PayResultProps {
  result: ShiftResult | null;
  shiftHours: number;
}

export function PayResult({ result, shiftHours }: PayResultProps) {
  const { colors } = useTheme();

  if (!result) {
    return (
      <Card variant="elevated" padding="large" style={styles.card}>
        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Enter your shift details to see your pay
          </Text>
        </View>
      </Card>
    );
  }

  const { gross, net, breakdown, effectiveHourlyRate, effectiveTaxRate } = result;

  return (
    <View style={styles.container}>
      {/* Main Results */}
      <View style={styles.mainResults}>
        {/* Gross Pay Card */}
        <Card variant="elevated" padding="large" style={styles.resultCard}>
          <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
            GROSS PAY
          </Text>
          <Text style={[styles.resultAmount, { color: colors.text }]}>
            {formatCurrency(gross)}
          </Text>
          <Text style={[styles.resultSubtext, { color: colors.textSecondary }]}>
            {formatCurrency(effectiveHourlyRate)}/hr effective
          </Text>
        </Card>

        {/* Net Pay Card (highlighted) */}
        <Card
          variant="elevated"
          padding="large"
          style={[styles.resultCard, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.resultLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            NET PAY
          </Text>
          <Text style={[styles.resultAmount, { color: '#FFFFFF' }]}>
            {formatCurrency(net)}
          </Text>
          <Text style={[styles.resultSubtext, { color: 'rgba(255,255,255,0.8)' }]}>
            {formatPercent(effectiveTaxRate)} total tax
          </Text>
        </Card>
      </View>

      {/* Breakdown Card */}
      <Card variant="outlined" padding="medium" style={styles.breakdownCard}>
        <Text style={[styles.breakdownTitle, { color: colors.text }]}>
          Breakdown
        </Text>

        {/* Earnings Section */}
        <View style={styles.breakdownSection}>
          <BreakdownRow
            label="Base Pay"
            sublabel={`${shiftHours} hrs`}
            amount={breakdown.basePay}
            colors={colors}
          />
          {breakdown.diffPay > 0 && (
            <BreakdownRow
              label="Differentials"
              amount={breakdown.diffPay}
              colors={colors}
              positive
            />
          )}
          {breakdown.overtimePay > 0 && (
            <BreakdownRow
              label="Overtime Premium"
              sublabel="1.5x rate"
              amount={breakdown.overtimePay}
              colors={colors}
              positive
            />
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        {/* Taxes Section */}
        <View style={styles.breakdownSection}>
          <BreakdownRow
            label="Federal Tax"
            amount={-breakdown.federalTax}
            colors={colors}
            negative
          />
          <BreakdownRow
            label="Social Security"
            amount={-breakdown.fica}
            colors={colors}
            negative
          />
          <BreakdownRow
            label="Medicare"
            amount={-breakdown.medicare}
            colors={colors}
            negative
          />
          {breakdown.stateTax > 0 && (
            <BreakdownRow
              label="State Tax"
              amount={-breakdown.stateTax}
              colors={colors}
              negative
            />
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        {/* Total Taxes */}
        <BreakdownRow
          label="Total Taxes"
          amount={-breakdown.totalTax}
          colors={colors}
          negative
          bold
        />
      </Card>
    </View>
  );
}

interface BreakdownRowProps {
  label: string;
  sublabel?: string;
  amount: number;
  colors: any;
  positive?: boolean;
  negative?: boolean;
  bold?: boolean;
}

function BreakdownRow({
  label,
  sublabel,
  amount,
  colors,
  positive,
  negative,
  bold,
}: BreakdownRowProps) {
  const textColor = negative
    ? colors.error
    : positive
    ? colors.success
    : colors.text;

  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownLabelContainer}>
        <Text
          style={[
            styles.breakdownLabel,
            { color: colors.text },
            bold && styles.breakdownLabelBold,
          ]}
        >
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.breakdownSublabel, { color: colors.textSecondary }]}>
            {sublabel}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.breakdownAmount,
          { color: textColor },
          bold && styles.breakdownAmountBold,
        ]}
      >
        {formatCurrency(Math.abs(amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  card: {
    minHeight: 120,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...Typography.body,
    textAlign: 'center',
  },
  mainResults: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  resultCard: {
    flex: 1,
    alignItems: 'center',
  },
  resultLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  resultAmount: {
    ...Typography.displayMedium,
  },
  resultSubtext: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  breakdownCard: {
    marginTop: Spacing.sm,
  },
  breakdownTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  breakdownSection: {
    gap: Spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  breakdownLabelContainer: {
    flex: 1,
  },
  breakdownLabel: {
    ...Typography.body,
  },
  breakdownLabelBold: {
    fontWeight: '600',
  },
  breakdownSublabel: {
    ...Typography.caption,
  },
  breakdownAmount: {
    ...Typography.body,
    fontVariant: ['tabular-nums'],
  },
  breakdownAmountBold: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
});
