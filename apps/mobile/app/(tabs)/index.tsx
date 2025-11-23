/**
 * Quick Tally - Home Screen
 * Main shift pay calculator
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useBaseRate, useWorkState, useWeeklyHours } from '../../src/hooks/useStorage';
import {
  Button,
  Card,
  NumericInput,
  Toggle,
  StatePicker,
  PayResult,
} from '../../src/components';
import { Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import {
  calculateShiftPay,
  ShiftResult,
  Differentials,
  USState,
  DEFAULT_DIFF_RATES,
} from '@shifttally/core';

export default function QuickTallyScreen() {
  const { colors } = useTheme();

  // Persisted values
  const { baseRate, setBaseRate, isLoaded: baseRateLoaded } = useBaseRate(35);
  const { state, setState, isLoaded: stateLoaded } = useWorkState('FL');
  const { weeklyHours, setWeeklyHours, isLoaded: weeklyHoursLoaded } = useWeeklyHours(0);

  // Local state
  const [shiftHours, setShiftHours] = useState(12);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [diffs, setDiffs] = useState<Differentials>({
    night: false,
    weekend: false,
    holiday: false,
    charge: false,
    preceptor: false,
  });

  // Calculate result in real-time
  const result = useMemo<ShiftResult | null>(() => {
    if (baseRate <= 0 || shiftHours <= 0) return null;

    try {
      return calculateShiftPay({
        baseRate,
        shiftHours,
        weeklyHours,
        state,
        diffs,
      });
    } catch {
      return null;
    }
  }, [baseRate, shiftHours, weeklyHours, state, diffs]);

  const toggleDiff = useCallback((key: keyof Differentials) => {
    setDiffs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const activeDiffsCount = Object.values(diffs).filter(Boolean).length;

  // Wait for storage to load
  if (!baseRateLoaded || !stateLoaded || !weeklyHoursLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Quick Tally
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Calculate your shift pay instantly
          </Text>
        </View>

        {/* Input Card */}
        <Card variant="elevated" padding="large" style={styles.inputCard}>
          {/* Base Rate */}
          <NumericInput
            label="HOURLY RATE"
            value={baseRate}
            onChange={setBaseRate}
            prefix="$"
            suffix="/hr"
            min={0}
            max={500}
            decimals={2}
          />

          {/* Shift Hours */}
          <NumericInput
            label="SHIFT HOURS"
            value={shiftHours}
            onChange={setShiftHours}
            suffix="hrs"
            min={0}
            max={24}
            decimals={1}
          />

          {/* Weekly Hours (for OT calculation) */}
          <NumericInput
            label="HOURS ALREADY WORKED THIS WEEK"
            value={weeklyHours}
            onChange={setWeeklyHours}
            suffix="hrs"
            min={0}
            max={168}
            decimals={0}
          />

          {/* State Picker */}
          <StatePicker
            label="WORK STATE"
            value={state}
            onChange={setState}
          />

          {/* Advanced Toggle */}
          <TouchableOpacity
            style={[
              styles.advancedToggle,
              { borderTopColor: colors.separator },
            ]}
            onPress={() => setShowAdvanced(!showAdvanced)}
            accessibilityRole="button"
            accessibilityLabel={`${showAdvanced ? 'Hide' : 'Show'} differentials`}
          >
            <View style={styles.advancedToggleLeft}>
              <Ionicons
                name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.advancedToggleText, { color: colors.text }]}>
                Differentials
              </Text>
            </View>
            {activeDiffsCount > 0 && (
              <View
                style={[styles.badge, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.badgeText}>{activeDiffsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Differentials */}
          {showAdvanced && (
            <View style={styles.diffsContainer}>
              <Toggle
                label="Night Shift"
                sublabel={`+$${DEFAULT_DIFF_RATES.night.toFixed(2)}/hr`}
                value={diffs.night}
                onChange={() => toggleDiff('night')}
              />
              <Toggle
                label="Weekend"
                sublabel={`+$${DEFAULT_DIFF_RATES.weekend.toFixed(2)}/hr`}
                value={diffs.weekend}
                onChange={() => toggleDiff('weekend')}
              />
              <Toggle
                label="Holiday"
                sublabel={`+$${DEFAULT_DIFF_RATES.holiday.toFixed(2)}/hr`}
                value={diffs.holiday}
                onChange={() => toggleDiff('holiday')}
              />
              <Toggle
                label="Charge Nurse"
                sublabel={`+$${DEFAULT_DIFF_RATES.charge.toFixed(2)}/hr`}
                value={diffs.charge}
                onChange={() => toggleDiff('charge')}
              />
              <Toggle
                label="Preceptor"
                sublabel={`+$${DEFAULT_DIFF_RATES.preceptor.toFixed(2)}/hr`}
                value={diffs.preceptor}
                onChange={() => toggleDiff('preceptor')}
              />
            </View>
          )}
        </Card>

        {/* Results */}
        <PayResult result={result} shiftHours={shiftHours} />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.xs,
  },
  inputCard: {
    marginBottom: Spacing.lg,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
  },
  advancedToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  advancedToggleText: {
    ...Typography.body,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  diffsContainer: {
    marginTop: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
