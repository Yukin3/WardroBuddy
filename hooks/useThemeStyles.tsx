import { useTheme } from './useTheme';

/**
 * A hook that provides consistent theme-based styling functions across the app
 */
export const useThemeStyles = () => {
  const { isDark } = useTheme();
  
  // Background styles
  const getBackgroundClass = () => isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-emerald-50 to-white';
  const getCardBackgroundClass = () => isDark ? 'bg-gray-800' : 'bg-white';
  const getCardBorderClass = () => isDark ? 'border-gray-700' : 'border-emerald-100';
  const getInputBackgroundClass = () => isDark ? 'bg-gray-700' : 'bg-gray-50';
  
  // Text styles
  const getTextClass = () => isDark ? 'text-white' : 'text-gray-700';
  const getHeaderTextClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700';
  const getStatsTextClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700'; 
  const getSectionTextClass = () => isDark ? 'text-gray-400' : 'text-gray-500';
  const getSubtitleTextClass = () => isDark ? 'text-gray-300' : 'text-gray-600';
  
  // Icon colors
  const getIconColor = () => isDark ? '#ffffff' : '#25292e';
  const getChevronColor = () => isDark ? '#6b7280' : '#9CA3AF';
  const getPrimaryIconColor = () => isDark ? '#4ADE80' : '#059669';
  
  // Button styles
  const getPrimaryButtonClass = () => isDark ? 'bg-emerald-800' : 'bg-emerald-600';
  const getSecondaryButtonClass = () => isDark ? 'bg-gray-700' : 'bg-emerald-100';
  const getDestructiveButtonClass = () => isDark ? 'bg-red-900' : 'bg-red-50';
  const getDestructiveTextClass = () => isDark ? 'text-red-400' : 'text-red-600';
  
  // Special elements
  const getEmptyStateIconClass = () => isDark ? 'bg-gray-700' : 'bg-emerald-100';
  const getSelectedBackgroundClass = (selected: boolean) => selected 
    ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100') 
    : (isDark ? 'bg-gray-700' : 'bg-gray-50');
  
  return {
    // Background styles
    getBackgroundClass,
    getCardBackgroundClass,
    getCardBorderClass,
    getInputBackgroundClass,
    
    // Text styles
    getTextClass,
    getHeaderTextClass,
    getStatsTextClass,
    getSectionTextClass,
    getSubtitleTextClass,
    
    // Icon colors
    getIconColor,
    getChevronColor,
    getPrimaryIconColor,
    
    // Button styles
    getPrimaryButtonClass,
    getSecondaryButtonClass,
    getDestructiveButtonClass,
    getDestructiveTextClass,
    
    // Special elements
    getEmptyStateIconClass,
    getSelectedBackgroundClass,
    
    // The direct boolean for conditional styling
    isDark,
  };
}; 