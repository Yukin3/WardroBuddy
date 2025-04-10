import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

/**
 * A container component that adapts to different screen sizes
 * On desktop, it centers content with max-width
 * On tablet, it provides appropriate padding
 * On mobile, it maintains the current layout
 */
export default function ResponsiveContainer({
  children,
  className = '',
  style = {},
  fullWidth = false,
}: ResponsiveContainerProps) {
  const { isMobile, containerMaxWidth, horizontalPadding } = useResponsive();

  // For mobile, don't apply any special container styles to preserve current layout
  if (isMobile || fullWidth) {
    return (
      <View className={className} style={style}>
        {children}
      </View>
    );
  }
  
  // For desktop/tablet, apply centered container with max width
  return (
    <View className={`flex-1 items-center ${className}`} style={style}>
      <View
        style={[
          styles.container,
          {
            maxWidth: containerMaxWidth,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
}); 