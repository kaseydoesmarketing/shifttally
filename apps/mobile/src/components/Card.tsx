/**
 * Card component
 * Glassy white cards on subtle gradient (Stripe-inspired)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}: CardProps) {
  const { colors, isDark } = useTheme();

  const cardStyles: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: colors.card,
      borderColor: variant === 'outlined' ? colors.border : 'transparent',
      borderWidth: variant === 'outlined' ? 1 : 0,
      shadowColor: colors.shadow,
      shadowOpacity: variant === 'elevated' ? (isDark ? 0.5 : 0.15) : (isDark ? 0.3 : 0.08),
      shadowRadius: variant === 'elevated' ? 16 : 8,
      shadowOffset: { width: 0, height: variant === 'elevated' ? 8 : 4 },
      elevation: variant === 'elevated' ? 8 : 4,
    },
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.sm,
  },
  paddingMedium: {
    padding: Spacing.md,
  },
  paddingLarge: {
    padding: Spacing.lg,
  },
});
