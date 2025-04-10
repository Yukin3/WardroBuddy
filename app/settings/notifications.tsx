import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';

// Define notification settings structure
interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const {
    getBackgroundClass,
    getCardBackgroundClass,
    getCardBorderClass,
    getTextClass,
    getHeaderTextClass,
    getSubtitleTextClass,
    getPrimaryButtonClass,
    isDark
  } = useThemeStyles();
  const router = useRouter();
  const navigation = useNavigation();
  
  // Initial notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'outfit_suggestions',
      title: 'Outfit Suggestions',
      description: 'Get personalized outfit ideas based on your wardrobe',
      enabled: true
    },
    {
      id: 'wishlist_updates',
      title: 'Wishlist Updates',
      description: 'Price drops, back in stock, and other wishlist alerts',
      enabled: true
    },
    {
      id: 'timer_reminders',
      title: 'Decision Timers',
      description: 'Reminders when your decision timers are about to expire',
      enabled: true
    },
    {
      id: 'style_trends',
      title: 'Style Trends',
      description: 'Updates on new fashion trends matching your style',
      enabled: false
    },
    {
      id: 'social_activity',
      title: 'Social Activity',
      description: 'Likes, comments, and follows on your outfits',
      enabled: true
    },
    {
      id: 'special_offers',
      title: 'Special Offers',
      description: 'Promotions, discounts, and app updates',
      enabled: false
    },
    {
      id: 'wardrobe_stats',
      title: 'Wardrobe Stats',
      description: 'Weekly roundup of your wardrobe analytics',
      enabled: true
    }
  ]);
  
  // Keep track of the original settings to detect changes
  const [originalSettings, setOriginalSettings] = useState<NotificationSetting[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    // Store the original settings when component mounts
    setOriginalSettings([...notificationSettings]);
    
    // Add a listener for back button presses
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasUnsavedChanges) {
        showUnsavedChangesAlert();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    });
    
    // Add a listener for navigation changes
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasUnsavedChanges) {
        return;
      }
      
      // Prevent default behavior
      e.preventDefault();
      showUnsavedChangesAlert();
    });
    
    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [hasUnsavedChanges, navigation]);
  
  // Check for unsaved changes whenever settings change
  useEffect(() => {
    if (originalSettings.length === 0) return;
    
    const settingsChanged = JSON.stringify(notificationSettings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(settingsChanged);
  }, [notificationSettings, originalSettings]);
  
  const toggleSetting = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };
  
  const savePreferences = () => {
    // In a real app, save to backend/storage here
    setOriginalSettings([...notificationSettings]);
    setHasUnsavedChanges(false);
    Alert.alert(
      "Preferences Saved",
      "Your notification preferences have been updated."
    );
  };
  
  const showUnsavedChangesAlert = () => {
    Alert.alert(
      "Unsaved Changes",
      "You have unsaved changes. Do you want to save them before leaving?",
      [
        {
          text: "Don't Save",
          style: "destructive",
          onPress: () => router.back()
        },
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: () => {
            savePreferences();
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => {
            if (hasUnsavedChanges) {
              showUnsavedChangesAlert();
            } else {
              router.back();
            }
          }}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#065f46'} />
        </TouchableOpacity>
        <Text className={`${getHeaderTextClass()} text-xl font-bold`}>Notification Settings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Description Card */}
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextClass()} font-semibold text-lg mb-2`}>
            Manage Your Notifications
          </Text>
          <Text className={`${getSubtitleTextClass()}`}>
            Choose which notifications you want to receive. You can change these settings anytime.
          </Text>
        </View>
        
        {/* Notification Settings */}
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} overflow-hidden mb-6`}>
          {notificationSettings.map((setting, index) => (
            <View 
              key={setting.id}
              className={`p-4 flex-row justify-between items-center ${
                index !== notificationSettings.length - 1 ? `border-b ${getCardBorderClass()}` : ''
              }`}
            >
              <View className="flex-1 pr-4">
                <Text className={`${getTextClass()} font-semibold mb-1`}>{setting.title}</Text>
                <Text className={`${getSubtitleTextClass()} text-sm`}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: isDark ? '#4b5563' : '#d1d5db', true: isDark ? '#065f46' : '#10b981' }}
                thumbColor={isDark ? '#e5e7eb' : '#ffffff'}
              />
            </View>
          ))}
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          className={`${getPrimaryButtonClass()} py-3 rounded-xl ${!hasUnsavedChanges ? 'opacity-50' : ''}`}
          onPress={savePreferences}
          disabled={!hasUnsavedChanges}
        >
          <Text className="text-white text-center font-semibold">
            {hasUnsavedChanges ? 'Save Preferences' : 'No Changes to Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 