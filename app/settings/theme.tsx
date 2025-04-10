import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemePreference } from '@/hooks/useUserPreferences';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ThemeSettings() {
  const { themePreference, setThemePreference, isDark } = useTheme();
  const router = useRouter();

  const themes: { id: ThemePreference; label: string; icon: any }[] = [
    { id: 'light', label: 'Light', icon: 'sunny-outline' },
    { id: 'dark', label: 'Dark', icon: 'moon-outline' },
    { id: 'system', label: 'System Default', icon: 'phone-portrait-outline' },
  ];

  const handleThemeChange = async (theme: ThemePreference) => {
    const success = await setThemePreference(theme);
    if (!success) {
      // Handle error
      console.error('Failed to update theme preference');
    }
  };

  const getBackgroundColorClass = () => isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-emerald-50 to-white';
  const getTextColorClass = () => isDark ? 'text-white' : 'text-gray-700';
  const getHeaderTextColorClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700';
  const getCardBackgroundClass = () => isDark ? 'bg-gray-800' : 'bg-white';
  const getCardBorderClass = () => isDark ? 'border-gray-700' : 'border-emerald-100';
  const getSelectedBackgroundClass = (selected: boolean) => selected 
    ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100') 
    : (isDark ? 'bg-gray-700' : 'bg-gray-50');

  return (
    <View className={`flex-1 ${getBackgroundColorClass()}`}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#065f46'} />
        </TouchableOpacity>
        <Text className={`${getHeaderTextColorClass()} text-xl font-bold`}>Theme Settings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mb-4`}>
            Choose Theme
          </Text>
          
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              className={`flex-row items-center py-4 px-3 rounded-lg mb-2 ${getSelectedBackgroundClass(themePreference === theme.id)}`}
              onPress={() => handleThemeChange(theme.id)}
            >
              <Ionicons name={theme.icon} size={22} color={isDark ? '#ffffff' : '#065f46'} className="mr-3" />
              <Text className={`${getTextColorClass()} flex-1 ml-3`}>{theme.label}</Text>
              {themePreference === theme.id && (
                <Ionicons name="checkmark-circle" size={22} color="#059669" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mb-2`}>
            About Themes
          </Text>
          <Text className={`${getTextColorClass()} mb-2`}>
            <Text className="font-semibold">Light:</Text> A bright theme optimized for daytime use.
          </Text>
          <Text className={`${getTextColorClass()} mb-2`}>
            <Text className="font-semibold">Dark:</Text> An eye-friendly dark theme for low-light environments.
          </Text>
          <Text className={`${getTextColorClass()}`}>
            <Text className="font-semibold">System Default:</Text> Follows your device's theme settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 