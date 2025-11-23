/**
 * AsyncStorage hooks for persisting user data
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FacilityPreset, USState } from '@shifttally/core';

// Storage keys
const STORAGE_KEYS = {
  BASE_RATE: '@shifttally/baseRate',
  STATE: '@shifttally/state',
  WEEKLY_HOURS: '@shifttally/weeklyHours',
  PRESETS: '@shifttally/presets',
  LAST_SHIFT: '@shifttally/lastShift',
} as const;

/**
 * Hook for persisting and retrieving the user's base rate
 */
export function useBaseRate(defaultValue: number = 35) {
  const [baseRate, setBaseRateState] = useState<number>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.BASE_RATE).then((saved) => {
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) {
          setBaseRateState(parsed);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const setBaseRate = useCallback((rate: number) => {
    setBaseRateState(rate);
    AsyncStorage.setItem(STORAGE_KEYS.BASE_RATE, rate.toString());
  }, []);

  return { baseRate, setBaseRate, isLoaded };
}

/**
 * Hook for persisting and retrieving the user's work state
 */
export function useWorkState(defaultValue: USState = 'FL') {
  const [state, setStateValue] = useState<USState>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.STATE).then((saved) => {
      if (saved) {
        setStateValue(saved as USState);
      }
      setIsLoaded(true);
    });
  }, []);

  const setState = useCallback((newState: USState) => {
    setStateValue(newState);
    AsyncStorage.setItem(STORAGE_KEYS.STATE, newState);
  }, []);

  return { state, setState, isLoaded };
}

/**
 * Hook for persisting and retrieving the user's default weekly hours
 */
export function useWeeklyHours(defaultValue: number = 36) {
  const [weeklyHours, setWeeklyHoursState] = useState<number>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_HOURS).then((saved) => {
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setWeeklyHoursState(parsed);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const setWeeklyHours = useCallback((hours: number) => {
    setWeeklyHoursState(hours);
    AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_HOURS, hours.toString());
  }, []);

  return { weeklyHours, setWeeklyHours, isLoaded };
}

/**
 * Hook for managing facility presets
 */
export function usePresets() {
  const [presets, setPresetsState] = useState<FacilityPreset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.PRESETS).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPresetsState(parsed);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const savePresets = useCallback((newPresets: FacilityPreset[]) => {
    setPresetsState(newPresets);
    AsyncStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(newPresets));
  }, []);

  const addPreset = useCallback((preset: Omit<FacilityPreset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPreset: FacilityPreset = {
      ...preset,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newPresets = [...presets, newPreset];
    savePresets(newPresets);
    return newPreset;
  }, [presets, savePresets]);

  const updatePreset = useCallback((id: string, updates: Partial<FacilityPreset>) => {
    const newPresets = presets.map((p) =>
      p.id === id
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    );
    savePresets(newPresets);
  }, [presets, savePresets]);

  const deletePreset = useCallback((id: string) => {
    const newPresets = presets.filter((p) => p.id !== id);
    savePresets(newPresets);
  }, [presets, savePresets]);

  return {
    presets,
    addPreset,
    updatePreset,
    deletePreset,
    isLoaded,
  };
}
