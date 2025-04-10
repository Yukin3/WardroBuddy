import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { ThemePreference, useUserPreferences } from './useUserPreferences';

type ThemeContextType = {
  theme: ColorSchemeName;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<boolean>;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ColorSchemeName>(systemTheme);
  const { preferences, loading, updatePreferences } = useUserPreferences();
  
  // Update the current theme based on the user's preference and system theme
  useEffect(() => {
    if (loading || !preferences) return;
    
    const { theme: themePreference } = preferences;
    
    if (themePreference === 'system') {
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(themePreference);
    }
  }, [preferences, systemTheme, loading]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (!preferences || preferences.theme !== 'system') return;
    setCurrentTheme(systemTheme);
  }, [systemTheme, preferences]);
  
  const setThemePreference = async (preference: ThemePreference): Promise<boolean> => {
    if (loading || !preferences) return false;
    
    if (preference === 'system') {
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(preference);
    }
    
    return await updatePreferences({ theme: preference });
  };
  
  return (
    <ThemeContext.Provider 
      value={{
        theme: currentTheme, 
        themePreference: preferences?.theme || 'system',
        setThemePreference,
        isDark: currentTheme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 