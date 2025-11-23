/**
 * Edit Preset Screen (Modal)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function EditPresetScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { presets, updatePreset } = usePresets();

  const preset = presets.find((p) => p.id === id);

  const [name, setName] = useState(preset?.name ?? '');
  const [baseRate, setBaseRate] = useState(preset?.baseRate ?? 35);
  const [shiftHours, setShiftHours] = useState(preset?.shiftHours ?? 12);
  const [weeklyHours, setWeeklyHours] = useState(preset?.weeklyHours ?? 36);
  const [state, setState] = useState<USState>(preset?.state ?? 'FL');
  const [diffs, setDiffs] = useState<Differentials>(
    preset?.diffs ?? {
      night: false,
      weekend: false,
      holiday: false,
      charge: false,
      preceptor: false,
    }
  );

  useEffect(() => {
    if (preset) {
      setName(preset.name);
      setBaseRate(preset.baseRate);
      setShiftHours(preset.shiftHours);
      setWeeklyHours(preset.weeklyHours);
      setState(preset.state);
      setDiffs(preset.diffs);
    }
  }, [preset]);

  const handleSave = () => {
    if (!name.trim() || !id) {
      return;
    }

    updatePreset(id, {
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

  if (!preset) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Preset not found
        </Text>
      </View>
    );
  }

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
          title="Save Changes"
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
  errorText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
