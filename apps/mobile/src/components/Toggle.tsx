/**
 * Toggle/Switch component
 * For differentials and settings
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Typography, MIN_TOUCH_TARGET } from '../constants/theme';

interface ToggleProps {
  label: string;
  sublabel?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({
  label,
  sublabel,
  value,
  onChange,
  disabled = false,
}: ToggleProps) {
  const { colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(!value);
  };

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const thumbTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            {sublabel}
          </Text>
        )}
      </View>
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: '#FFFFFF',
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    ...Typography.body,
  },
  sublabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
});
