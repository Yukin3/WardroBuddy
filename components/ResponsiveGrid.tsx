import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  gap?: number;
  numColumns?: number; // Optional override of auto-responsive columns
}

/**
 * A responsive grid component that adapts to screen size
 * Automatically determines the number of columns based on screen size
 */
export default function ResponsiveGrid({
  children,
  className = '',
  style = {},
  gap = 16,
  numColumns,
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop, gridColumns } = useResponsive();

  // If numColumns is explicitly provided, use that, otherwise use responsive columns
  const columns = numColumns || gridColumns;

  // For mobile, don't change anything if numColumns is not specified
  if (isMobile && !numColumns) {
    return (
      <View className={className} style={style}>
        {children}
      </View>
    );
  }

  // Convert children to array to handle React.Children mapping
  const childrenArray = React.Children.toArray(children);
  
  // Convert flat array into rows with the specified number of columns
  const rows = [];
  for (let i = 0; i < childrenArray.length; i += columns) {
    rows.push(childrenArray.slice(i, i + columns));
  }

  return (
    <View className={className} style={style}>
      {rows.map((row, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={[
            styles.row,
            { marginBottom: rowIndex < rows.length - 1 ? gap : 0 }
          ]}
        >
          {row.map((child, colIndex) => (
            <View 
              key={`col-${rowIndex}-${colIndex}`} 
              style={[
                styles.column,
                { 
                  flex: 1,
                  marginRight: colIndex < row.length - 1 ? gap : 0,
                }
              ]}
            >
              {child}
            </View>
          ))}
          
          {/* Add empty columns to fill the row if needed */}
          {row.length < columns && Array(columns - row.length).fill(0).map((_, index) => (
            <View 
              key={`empty-${rowIndex}-${index}`} 
              style={[
                styles.column,
                { 
                  flex: 1,
                  marginRight: index < columns - row.length - 1 ? gap : 0,
                }
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    // Column styles here
  },
}); 