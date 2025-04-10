import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Language = {
  id: string;
  name: string;
  nativeName: string;
};

export default function LanguageSettings() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const languages: Language[] = [
    { id: 'en', name: 'English', nativeName: 'English' },
    { id: 'es', name: 'Spanish', nativeName: 'Español' },
    { id: 'fr', name: 'French', nativeName: 'Français' },
    { id: 'zh', name: 'Mandarin', nativeName: '中文' },
    { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { id: 'ru', name: 'Russian', nativeName: 'Русский' },
    { id: 'ja', name: 'Japanese', nativeName: '日本語' },
  ];

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    // Language change functionality would be implemented here
    console.log(`Language changed to: ${languageId}`);
  };

  // Theme-based styling helpers
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
        <Text className={`${getHeaderTextColorClass()} text-xl font-bold`}>Language Settings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mb-4`}>
            Choose Language
          </Text>
          
          {languages.map((language) => (
            <TouchableOpacity
              key={language.id}
              className={`flex-row items-center py-4 px-3 rounded-lg mb-2 ${getSelectedBackgroundClass(selectedLanguage === language.id)}`}
              onPress={() => handleLanguageChange(language.id)}
            >
              <Text className={`${getTextColorClass()} flex-1`}>
                {language.name} <Text className="text-sm opacity-70">({language.nativeName})</Text>
              </Text>
              {selectedLanguage === language.id && (
                <Ionicons name="checkmark-circle" size={22} color="#059669" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mb-2`}>
            About Language Settings
          </Text>
          <Text className={`${getTextColorClass()} mb-4`}>
            Choose your preferred language for the app interface. Currently, language selection is 
            for demonstration purposes only.
          </Text>
          <Text className={`${getTextColorClass()} mb-2`}>
            <Text className="font-semibold">Note:</Text> Some content may still appear in English while we complete translations.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 