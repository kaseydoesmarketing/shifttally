/**
 * Input component
 * Clean, accessible text/numeric inputs
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Typography, MIN_TOUCH_TARGET } from '../constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  prefix,
  suffix,
  error,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.inputBorder,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.affix, { color: colors.textSecondary }]}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            prefix && styles.inputWithPrefix,
            suffix && styles.inputWithSuffix,
          ]}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          {...textInputProps}
        />
        {suffix && (
          <Text style={[styles.affix, { color: colors.textSecondary }]}>
            {suffix}
          </Text>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

/**
 * Numeric input specifically for currency/hours
 */
interface NumericInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  containerStyle?: ViewStyle;
}

export function NumericInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max = 999999,
  decimals = 2,
  containerStyle,
}: NumericInputProps) {
  const { colors } = useTheme();

  const handleChange = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);

    if (cleaned === '' || cleaned === '.') {
      onChange(0);
      return;
    }

    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const displayValue = value === 0 ? '' : value.toFixed(decimals).replace(/\.?0+$/, '');

  return (
    <Input
      label={label}
      prefix={prefix}
      suffix={suffix}
      value={displayValue}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      containerStyle={containerStyle}
    />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET + 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.bodyLarge,
    paddingVertical: Spacing.sm,
  },
  inputWithPrefix: {
    paddingLeft: Spacing.xs,
  },
  inputWithSuffix: {
    paddingRight: Spacing.xs,
  },
  affix: {
    ...Typography.bodyLarge,
  },
  error: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});
