/**
 * State picker dropdown
 * Shows all 50 US states + DC with tax rate info
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Typography, MIN_TOUCH_TARGET } from '../constants/theme';
import { getAllStatesSorted, formatPercent, USState } from '@shifttally/core';

interface StatePickerProps {
  label?: string;
  value: USState;
  onChange: (state: USState) => void;
}

export function StatePicker({ label, value, onChange }: StatePickerProps) {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const states = getAllStatesSorted();
  const selectedState = states.find((s) => s.code === value);

  const handleSelect = (code: USState) => {
    onChange(code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
          },
        ]}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`Select state, currently ${selectedState?.name}`}
      >
        <View style={styles.selectedContent}>
          <Text style={[styles.selectedText, { color: colors.text }]}>
            {selectedState?.name}
          </Text>
          {selectedState && (
            <Text style={[styles.taxRate, { color: colors.textSecondary }]}>
              {selectedState.taxRate === 0
                ? 'No state tax'
                : `${formatPercent(selectedState.taxRate)} state tax`}
            </Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={[styles.modal, { backgroundColor: colors.background }]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.separator },
            ]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeText, { color: colors.primary }]}>
                Done
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select State
            </Text>
            <View style={styles.closeButton} />
          </View>

          <FlatList
            data={states}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stateItem,
                  {
                    backgroundColor:
                      item.code === value
                        ? colors.primary + '15'
                        : 'transparent',
                  },
                ]}
                onPress={() => handleSelect(item.code)}
              >
                <View style={styles.stateInfo}>
                  <Text style={[styles.stateName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.stateCode, { color: colors.textSecondary }]}
                  >
                    {item.code}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stateTax,
                    {
                      color:
                        item.taxRate === 0
                          ? colors.success
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {item.taxRate === 0
                    ? 'No tax'
                    : formatPercent(item.taxRate)}
                </Text>
                {item.code === value && (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color={colors.primary}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={[styles.separator, { backgroundColor: colors.separator }]}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET + 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectedContent: {
    flex: 1,
  },
  selectedText: {
    ...Typography.bodyLarge,
  },
  taxRate: {
    ...Typography.caption,
    marginTop: 2,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h3,
  },
  closeButton: {
    width: 60,
  },
  closeText: {
    ...Typography.body,
    fontWeight: '600',
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  stateInfo: {
    flex: 1,
  },
  stateName: {
    ...Typography.body,
  },
  stateCode: {
    ...Typography.caption,
    marginTop: 2,
  },
  stateTax: {
    ...Typography.body,
    marginRight: Spacing.sm,
  },
  checkmark: {
    marginLeft: Spacing.xs,
  },
  separator: {
    height: 1,
    marginLeft: Spacing.md,
  },
});
