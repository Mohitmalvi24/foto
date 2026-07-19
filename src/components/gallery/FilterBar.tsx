import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../constants/theme';
import type { AuthorFilter } from '../../types/image';

interface FilterBarProps {
  activeFilter: AuthorFilter;
  onFilterChange: (filter: AuthorFilter) => void;
}

const FILTERS: AuthorFilter[] = ['All', 'A-M', 'N-Z'];

export const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onFilterChange(filter)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
});
