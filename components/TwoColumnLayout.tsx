import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  leftWidth?: number; // Percentage width of left column (0-100)
  rightWidth?: number; // Percentage width of right column (0-100)
  gap?: number;
  reverseOnMobile?: boolean; // Whether to show right column first on mobile
}

/**
 * A two-column layout that adapts to screen size
 * On desktop and tablet, shows content in two columns
 * On mobile, stacks content vertically
 */
export default function TwoColumnLayout({
  left,
  right,
  className = '',
  style = {},
  leftWidth = 50,
  rightWidth = 50,
  gap = 24,
  reverseOnMobile = false,
}: TwoColumnLayoutProps) {
  const { isMobile } = useResponsive();

  // For mobile, stack vertically
  if (isMobile) {
    return (
      <View className={className} style={style}>
        {reverseOnMobile ? (
          <>
            <View style={styles.mobileSection}>{right}</View>
            <View style={styles.mobileSection}>{left}</View>
          </>
        ) : (
          <>
            <View style={styles.mobileSection}>{left}</View>
            <View style={styles.mobileSection}>{right}</View>
          </>
        )}
      </View>
    );
  }

  // For desktop/tablet, show side by side
  return (
    <View className={className} style={[styles.container, style]}>
      <View 
        style={[
          styles.column, 
          { 
            width: `${leftWidth}%`,
            marginRight: gap,
          }
        ]}
      >
        {left}
      </View>
      <View 
        style={[
          styles.column, 
          { 
            width: `${rightWidth}%` 
          }
        ]}
      >
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  column: {
    // Column styles
  },
  mobileSection: {
    marginBottom: 16,
  },
}); 