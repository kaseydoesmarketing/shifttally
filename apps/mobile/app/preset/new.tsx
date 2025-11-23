/**
 * New Preset Screen (Modal)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { usePresets } from '../../src/hooks/useStorage';
import {
  Button,
  Card,
  Input,
  NumericInput,
  Toggle,
  StatePicker,
} from '../../src/components';
import { Spacing, Typography } from '../../src/constants/theme';
import { Differentials, USState, DEFAULT_DIFF_RATES } from '@shifttally/core';

export default function NewPresetScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { addPreset } = usePresets();

  const [name, setName] = useState('');
  const [baseRate, setBaseRate] = useState(35);
  const [shiftHours, setShiftHours] = useState(12);
  const [weeklyHours, setWeeklyHours] = useState(36);
  const [state, setState] = useState<USState>('FL');
  const [diffs, setDiffs] = useState<Differentials>({
    night: false,
    weekend: false,
    holiday: false,
    charge: false,
    preceptor: false,
  });

  const handleSave = () => {
    if (!name.trim()) {
      return; // Could show validation error
    }

    addPreset({
      name: name.trim(),
      baseRate,
      shiftHours,
      weeklyHours,
      state,
      diffs,
    });

    router.back();
  };

  const toggleDiff = (key: keyof Differentials) => {
    setDiffs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card variant="elevated" padding="large">
          <Input
            label="PRESET NAME"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Tampa General - Night 12s"
            autoFocus
          />

          <NumericInput
            label="BASE HOURLY RATE"
            value={baseRate}
            onChange={setBaseRate}
            prefix="$"
            suffix="/hr"
            min={0}
            max={500}
            decimals={2}
          />

          <NumericInput
            label="TYPICAL SHIFT HOURS"
            value={shiftHours}
            onChange={setShiftHours}
            suffix="hrs"
            min={0}
            max={24}
            decimals={1}
          />

          <NumericInput
            label="TYPICAL WEEKLY HOURS BEFORE SHIFT"
            value={weeklyHours}
            onChange={setWeeklyHours}
            suffix="hrs"
            min={0}
            max={168}
            decimals={0}
          />

          <StatePicker label="WORK STATE" value={state} onChange={setState} />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          DEFAULT DIFFERENTIALS
        </Text>
        <Card variant="outlined" padding="medium">
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
        </Card>

        <Button
          title="Save Preset"
          onPress={handleSave}
          disabled={!name.trim()}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.label,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  saveButton: {
    marginTop: Spacing.xl,
  },
});
