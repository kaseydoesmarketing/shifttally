/**
 * Presets Screen
 * List and manage facility presets
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { usePresets } from '../../src/hooks/useStorage';
import { Card, Button } from '../../src/components';
import { Spacing, Typography, BorderRadius, MIN_TOUCH_TARGET } from '../../src/constants/theme';
import { FacilityPreset, formatCurrency, STATE_NAMES } from '@shifttally/core';

export default function PresetsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { presets, deletePreset, isLoaded } = usePresets();

  const handleDelete = (preset: FacilityPreset) => {
    Alert.alert(
      'Delete Preset',
      `Are you sure you want to delete "${preset.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePreset(preset.id),
        },
      ]
    );
  };

  const handleEdit = (preset: FacilityPreset) => {
    router.push(`/preset/${preset.id}`);
  };

  const handleApply = (preset: FacilityPreset) => {
    // Navigate to Quick Tally with preset values
    // For now, just navigate - we'll implement preset application later
    router.push({
      pathname: '/',
      params: {
        baseRate: preset.baseRate.toString(),
        shiftHours: preset.shiftHours.toString(),
        weeklyHours: preset.weeklyHours.toString(),
        state: preset.state,
      },
    });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Facility Presets
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Save your common shift configurations
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Card variant="outlined" padding="large" style={styles.emptyCard}>
            <Ionicons
              name="bookmark-outline"
              size={48}
              color={colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Presets Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Create presets to quickly load your common shift setups
            </Text>
            <Button
              title="Create Preset"
              onPress={() => router.push('/preset/new')}
              size="medium"
              style={styles.emptyButton}
            />
          </Card>
        }
        renderItem={({ item }) => (
          <PresetCard
            preset={item}
            colors={colors}
            onApply={() => handleApply(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          presets.length > 0 ? (
            <Button
              title="Add Preset"
              onPress={() => router.push('/preset/new')}
              variant="secondary"
              style={styles.addButton}
            />
          ) : null
        }
      />
    </View>
  );
}

interface PresetCardProps {
  preset: FacilityPreset;
  colors: any;
  onApply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PresetCard({ preset, colors, onApply, onEdit, onDelete }: PresetCardProps) {
  const activeDiffs = [
    preset.diffs.night && 'Night',
    preset.diffs.weekend && 'Weekend',
    preset.diffs.holiday && 'Holiday',
    preset.diffs.charge && 'Charge',
    preset.diffs.preceptor && 'Preceptor',
  ].filter(Boolean);

  return (
    <Card variant="elevated" padding="medium">
      <TouchableOpacity
        style={styles.presetHeader}
        onPress={onApply}
        activeOpacity={0.7}
      >
        <View style={styles.presetInfo}>
          <Text style={[styles.presetName, { color: colors.text }]}>
            {preset.name}
          </Text>
          <Text style={[styles.presetDetails, { color: colors.textSecondary }]}>
            {formatCurrency(preset.baseRate)}/hr · {preset.shiftHours}h shift · {STATE_NAMES[preset.state]}
          </Text>
          {activeDiffs.length > 0 && (
            <Text style={[styles.presetDiffs, { color: colors.primary }]}>
              {activeDiffs.join(', ')}
            </Text>
          )}
        </View>
        <Ionicons
          name="play-circle"
          size={32}
          color={colors.primary}
        />
      </TouchableOpacity>

      <View style={[styles.presetActions, { borderTopColor: colors.separator }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="pencil" size={18} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
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
  separator: {
    height: Spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.sm,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    ...Typography.h3,
  },
  presetDetails: {
    ...Typography.body,
    marginTop: 2,
  },
  presetDiffs: {
    ...Typography.caption,
    marginTop: 4,
  },
  presetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: Spacing.sm,
  },
  actionText: {
    ...Typography.body,
  },
  addButton: {
    marginTop: Spacing.lg,
  },
});
