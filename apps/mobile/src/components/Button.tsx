/**
 * Primary button component
 * Large tap targets, accessible, haptic feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Typography, MIN_TOUCH_TARGET, Animation } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'large' | 'medium' | 'small';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[size],
    {
      backgroundColor:
        variant === 'primary'
          ? colors.primary
          : variant === 'secondary'
          ? colors.backgroundElevated
          : 'transparent',
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: colors.border,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${size}Text`],
    {
      color:
        variant === 'primary'
          ? '#FFFFFF'
          : variant === 'secondary'
          ? colors.text
          : colors.primary,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  medium: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
  largeText: {
    fontSize: 18,
  },
  mediumText: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
});
