/**
 * Settings Screen
 * App preferences and about info
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useWeeklyHours, useWorkState } from '../../src/hooks/useStorage';
import { Card, Toggle, StatePicker, NumericInput } from '../../src/components';
import { Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function SettingsScreen() {
  const { colors, mode, setMode, isDark } = useTheme();
  const { weeklyHours, setWeeklyHours } = useWeeklyHours(40);
  const { state, setState } = useWorkState('FL');

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      {/* Appearance Section */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        APPEARANCE
      </Text>
      <Card variant="outlined" padding="none">
        <ThemeOption
          label="Light"
          selected={mode === 'light'}
          onPress={() => handleThemeChange('light')}
          colors={colors}
        />
        <Divider colors={colors} />
        <ThemeOption
          label="Dark"
          selected={mode === 'dark'}
          onPress={() => handleThemeChange('dark')}
          colors={colors}
        />
        <Divider colors={colors} />
        <ThemeOption
          label="System"
          sublabel="Match device settings"
          selected={mode === 'system'}
          onPress={() => handleThemeChange('system')}
          colors={colors}
        />
      </Card>

      {/* Defaults Section */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        DEFAULTS
      </Text>
      <Card variant="outlined" padding="medium">
        <StatePicker
          label="DEFAULT WORK STATE"
          value={state}
          onChange={setState}
        />
        <NumericInput
          label="DEFAULT WEEKLY HOURS"
          value={weeklyHours}
          onChange={setWeeklyHours}
          suffix="hrs"
          min={0}
          max={168}
          decimals={0}
        />
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          These values will be pre-filled when you open the app
        </Text>
      </Card>

      {/* About Section */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        ABOUT
      </Text>
      <Card variant="outlined" padding="none">
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.text }]}>
            Version
          </Text>
          <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>
            1.0.0
          </Text>
        </View>
        <Divider colors={colors} />
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => Linking.openURL('https://shifttally.app/privacy')}
        >
          <Text style={[styles.aboutLabel, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Divider colors={colors} />
        <TouchableOpacity
          style={styles.aboutRow}
          onPress={() => Linking.openURL('https://shifttally.app/terms')}
        >
          <Text style={[styles.aboutLabel, { color: colors.text }]}>
            Terms of Service
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </Card>

      {/* Privacy Notice */}
      <Card
        variant="outlined"
        padding="medium"
        style={[styles.privacyCard, { borderColor: colors.success }]}
      >
        <View style={styles.privacyHeader}>
          <Ionicons name="shield-checkmark" size={24} color={colors.success} />
          <Text style={[styles.privacyTitle, { color: colors.text }]}>
            Your Data Stays Private
          </Text>
        </View>
        <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
          ShiftTally stores all your data locally on your device. We don't
          collect any personal health information (PHI), and we never sell your
          data. Your shift calculations are yours alone.
        </Text>
      </Card>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          Made with care for healthcare workers
        </Text>
      </View>
    </ScrollView>
  );
}

interface ThemeOptionProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
}

function ThemeOption({ label, sublabel, selected, onPress, colors }: ThemeOptionProps) {
  return (
    <TouchableOpacity
      style={styles.themeOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View>
        <Text style={[styles.themeLabel, { color: colors.text }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.themeSublabel, { color: colors.textSecondary }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {selected && (
        <Ionicons name="checkmark" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

function Divider({ colors }: { colors: any }) {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.separator, marginLeft: Spacing.md },
      ]}
    />
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
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
  },
  sectionTitle: {
    ...Typography.label,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    minHeight: 52,
  },
  themeLabel: {
    ...Typography.body,
  },
  themeSublabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  helpText: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    minHeight: 48,
  },
  aboutLabel: {
    ...Typography.body,
  },
  aboutValue: {
    ...Typography.body,
  },
  privacyCard: {
    marginTop: Spacing.lg,
    borderWidth: 1,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  privacyTitle: {
    ...Typography.h3,
  },
  privacyText: {
    ...Typography.body,
    lineHeight: 22,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
  },
});
