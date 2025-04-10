import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyPolicy() {
  const {
    getBackgroundClass,
    getCardBackgroundClass,
    getCardBorderClass,
    getTextClass,
    getHeaderTextClass,
    getSubtitleTextClass,
    getSecondaryButtonClass,
    isDark
  } = useThemeStyles();
  const router = useRouter();
  
  // Privacy preference toggles with default values
  const [aiTrainingEnabled, setAiTrainingEnabled] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = React.useState(true);

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#065f46'} />
        </TouchableOpacity>
        <Text className={`${getHeaderTextClass()} text-xl font-bold`}>Privacy & Data</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Privacy Policy Card */}
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextClass()} text-xl font-bold mb-2`}>Privacy Policy</Text>
          <Text className={`${getSubtitleTextClass()} mb-4`}>Last Updated: April 10, 2025</Text>
          
          <Text className={`${getTextClass()} mb-4`}>
            At WardroBuddy, we're committed to protecting your privacy and being transparent about how we use your data. This policy explains what information we collect, how we use it, and the choices you have.
          </Text>
          
          {/* Information Collection Section */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>Information We Collect</Text>
          <Text className={`${getTextClass()} mb-2`}>When you use WardroBuddy, we collect:</Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Information you provide (photos, preferences, profile)</Text>
            <Text className={`${getTextClass()} mb-1`}>• Usage data (interactions, features used, time spent)</Text>
            <Text className={`${getTextClass()} mb-1`}>• Device information (model, OS version, app version)</Text>
            <Text className={`${getTextClass()} mb-1`}>• Images and metadata of clothing items and outfits</Text>
          </View>
          
          {/* Use of Information Section */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>How We Use Your Information</Text>
          <Text className={`${getTextClass()} mb-2`}>We use your data to:</Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Provide personalized outfit recommendations</Text>
            <Text className={`${getTextClass()} mb-1`}>• Improve our AI models and algorithms</Text>
            <Text className={`${getTextClass()} mb-1`}>• Analyze usage patterns to enhance the app</Text>
            <Text className={`${getTextClass()} mb-1`}>• Send relevant notifications and updates</Text>
          </View>
        </View>
        
        {/* Data Preferences Card */}
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2`}>Data Preferences</Text>
          <Text className={`${getSubtitleTextClass()} mb-4`}>
            Customize how your data is used within the app. Disabling certain features may limit some functionality.
          </Text>
          
          {/* AI Training Toggle */}
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <View className="flex-1 pr-4">
              <Text className={`${getTextClass()} font-semibold mb-1`}>AI Model Training</Text>
              <Text className={`${getSubtitleTextClass()} text-sm`}>
                Allow your outfit data to improve our AI recommendations
              </Text>
            </View>
            <Switch
              value={aiTrainingEnabled}
              onValueChange={setAiTrainingEnabled}
              trackColor={{ false: isDark ? '#4b5563' : '#d1d5db', true: isDark ? '#065f46' : '#10b981' }}
              thumbColor={isDark ? '#e5e7eb' : '#ffffff'}
            />
          </View>
          
          {/* Analytics Toggle */}
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <View className="flex-1 pr-4">
              <Text className={`${getTextClass()} font-semibold mb-1`}>Usage Analytics</Text>
              <Text className={`${getSubtitleTextClass()} text-sm`}>
                Share anonymous usage data to help improve the app
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: isDark ? '#4b5563' : '#d1d5db', true: isDark ? '#065f46' : '#10b981' }}
              thumbColor={isDark ? '#e5e7eb' : '#ffffff'}
            />
          </View>
          
          {/* Personalization Toggle */}
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-1 pr-4">
              <Text className={`${getTextClass()} font-semibold mb-1`}>Personalized Experience</Text>
              <Text className={`${getSubtitleTextClass()} text-sm`}>
                Receive recommendations tailored to your style preferences
              </Text>
            </View>
            <Switch
              value={personalizationEnabled}
              onValueChange={setPersonalizationEnabled}
              trackColor={{ false: isDark ? '#4b5563' : '#d1d5db', true: isDark ? '#065f46' : '#10b981' }}
              thumbColor={isDark ? '#e5e7eb' : '#ffffff'}
            />
          </View>
        </View>
        
        {/* Data Deletion Card */}
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2`}>Your Data Control</Text>
          
          <Text className={`${getTextClass()} mb-4`}>
            You have the right to access, correct, or delete your personal data. You can:
          </Text>
          
          <View className="mb-6 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Download your data from Account Settings</Text>
            <Text className={`${getTextClass()} mb-1`}>• Delete specific items from your wardrobe</Text>
            <Text className={`${getTextClass()} mb-1`}>• Request complete account deletion at any time</Text>
          </View>
          
          <TouchableOpacity
            className={`bg-red-500 py-3 rounded-xl mb-2 ${isDark ? 'bg-opacity-70' : ''}`}
          >
            <Text className={`text-white text-center font-semibold`}>
              Delete All My Data
            </Text>
          </TouchableOpacity>
          
          <Text className={`${getSubtitleTextClass()} text-xs text-center`}>
            This action is permanent and cannot be undone
          </Text>
        </View>
        
        <TouchableOpacity
          className={`${getSecondaryButtonClass()} py-3 rounded-xl mb-4`}
          onPress={() => router.back()}
        >
          <Text className={`${getHeaderTextClass()} text-center font-semibold`}>Back to Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 