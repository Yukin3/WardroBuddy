import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import ResponsiveContainer from "@/components/ResponsiveContainer";
import TwoColumnLayout from "@/components/TwoColumnLayout";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Theme-based styling helpers
  const getBackgroundClass = () => isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-emerald-50 to-white';
  const getCardBackgroundClass = () => isDark ? 'bg-gray-800' : 'bg-white';
  const getCardBorderClass = () => isDark ? 'border-gray-700' : 'border-emerald-100';
  const getTextClass = () => isDark ? 'text-white' : 'text-gray-700';
  const getHeaderTextClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700';
  const getStatsTextClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700';
  const getSectionTextClass = () => isDark ? 'text-gray-400' : 'text-gray-500';
  const getIconColor = () => isDark ? '#ffffff' : '#25292e';
  const getChevronColor = () => isDark ? '#6b7280' : '#9CA3AF';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    // Listen for auth changes in case user loads in async
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // User profile component
  const ProfileHeader = () => (
    <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
      <View className={`flex-row items-center ${isDesktop ? 'mb-6' : 'mb-4'}`}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className={`${isDesktop ? 'w-24 h-24' : 'w-20 h-20'} rounded-full mr-4`}
          />
        ) : (
          <Image
            source={{
              uri: `https://api.dicebear.com/9.x/initials/svg?seed=${user?.displayName || user?.email || "User"}`,
            }}
            className={`${isDesktop ? 'w-24 h-24' : 'w-20 h-20'} rounded-full mr-4`}
          />
        )}
        <View className="flex-1">
          <Text className={`${getHeaderTextClass()} ${isDesktop ? 'text-3xl' : 'text-2xl'} font-bold mb-1`}>
            {user?.displayName || "Unnamed User"}
          </Text>
          <Text className={`${getSectionTextClass()}`}>
            {user?.email || "@unknown"}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">{user?.uid}</Text>
        </View>
        <TouchableOpacity
          className={`${isDark ? 'bg-gray-700' : 'bg-emerald-100'} p-2 rounded-lg`}
          onPress={() => {}}
        >
          <Ionicons name="pencil" size={isDesktop ? 24 : 20} color={getIconColor()} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className={`flex-row justify-between py-4 border-t border-b ${getCardBorderClass()}`}>
        <View className="items-center flex-1">
          <Text className={`${getStatsTextClass()} ${isDesktop ? 'text-2xl' : 'text-xl'} font-bold`}>42</Text>
          <Text className={`${getSectionTextClass()} text-sm`}>Outfits</Text>
        </View>
        <View className={`items-center flex-1 border-x ${getCardBorderClass()}`}>
          <Text className={`${getStatsTextClass()} ${isDesktop ? 'text-2xl' : 'text-xl'} font-bold`}>128</Text>
          <Text className={`${getSectionTextClass()} text-sm`}>Following</Text>
        </View>
        <View className="items-center flex-1">
          <Text className={`${getStatsTextClass()} ${isDesktop ? 'text-2xl' : 'text-xl'} font-bold`}>256</Text>
          <Text className={`${getSectionTextClass()} text-sm`}>Followers</Text>
        </View>
      </View>
    </View>
  );

  // Settings component
  const SettingsSection = () => (
    <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} overflow-hidden mb-4`}>
      <Text className={`${getHeaderTextClass()} font-semibold ${isDesktop ? 'text-xl' : 'text-lg'} p-4 border-b ${getCardBorderClass()}`}>
        Settings
      </Text>

      {/* Account Settings */}
      <View className={`p-4 border-b ${getCardBorderClass()}`}>
        <Text className={`${getSectionTextClass()} text-sm mb-3`}>ACCOUNT</Text>
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={20} color={getIconColor()} />
            <Text className={`${getTextClass()} ml-3`}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/notifications')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={getIconColor()}
            />
            <Text className={`${getTextClass()} ml-3`}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View className={`p-4 border-b ${getCardBorderClass()}`}>
        <Text className={`${getSectionTextClass()} text-sm mb-3`}>PREFERENCES</Text>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/theme')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={getIconColor()}
            />
            <Text className={`${getTextClass()} ml-3`}>Theme</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/language')}
        >
          <View className="flex-row items-center">
            <Ionicons name="language-outline" size={20} color={getIconColor()} />
            <Text className={`${getTextClass()} ml-3`}>Language</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View className="p-4">
        <Text className={`${getSectionTextClass()} text-sm mb-3`}>SUPPORT</Text>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/help')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={getIconColor()}
            />
            <Text className={`${getTextClass()} ml-3`}>Help Center</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/privacy')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="shield-outline"
              size={20}
              color={getIconColor()}
            />
            <Text className={`${getTextClass()} ml-3`}>Privacy & Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-row items-center justify-between py-3"
          onPress={() => router.push('/settings/terms')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="document-text-outline"
              size={20}
              color={getIconColor()}
            />
            <Text className={`${getTextClass()} ml-3`}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getChevronColor()} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Activity component for desktop view
  const ActivitySection = () => (
    <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} overflow-hidden mb-4`}>
      <Text className={`${getHeaderTextClass()} font-semibold text-xl p-4 border-b ${getCardBorderClass()}`}>
        Recent Activity
      </Text>
      <View className="p-4 space-y-4">
        <View className="flex-row items-center mb-4">
          <View className={`w-10 h-10 rounded-full ${isDark ? 'bg-emerald-900' : 'bg-emerald-100'} items-center justify-center mr-3`}>
            <Ionicons name="heart" size={20} color={isDark ? '#4ADE80' : '#059669'} />
          </View>
          <View className="flex-1">
            <Text className={getTextClass()}>You liked an outfit by <Text className="font-bold">Sarah Parker</Text></Text>
            <Text className={`${getSectionTextClass()} text-xs mt-1`}>2 hours ago</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-4">
          <View className={`w-10 h-10 rounded-full ${isDark ? 'bg-emerald-900' : 'bg-emerald-100'} items-center justify-center mr-3`}>
            <Ionicons name="person-add" size={20} color={isDark ? '#4ADE80' : '#059669'} />
          </View>
          <View className="flex-1">
            <Text className={getTextClass()}><Text className="font-bold">Alex Rodriguez</Text> started following you</Text>
            <Text className={`${getSectionTextClass()} text-xs mt-1`}>Yesterday</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-4">
          <View className={`w-10 h-10 rounded-full ${isDark ? 'bg-emerald-900' : 'bg-emerald-100'} items-center justify-center mr-3`}>
            <Ionicons name="shirt" size={20} color={isDark ? '#4ADE80' : '#059669'} />
          </View>
          <View className="flex-1">
            <Text className={getTextClass()}>You added a new outfit to your closet</Text>
            <Text className={`${getSectionTextClass()} text-xs mt-1`}>2 days ago</Text>
          </View>
        </View>
        
        <TouchableOpacity className="flex-row items-center justify-center mt-2">
          <Text className={getHeaderTextClass()}>View All Activity</Text>
          <Ionicons name="chevron-forward" size={16} color={isDark ? '#4ADE80' : '#059669'} className="ml-1" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          padding: isMobile ? 16 : 24,
          paddingBottom: isMobile ? 16 : 32 
        }}
      >
        <ResponsiveContainer>
          {isDesktop ? (
            // Desktop layout
            <TwoColumnLayout
              leftWidth={35}
              rightWidth={65}
              left={
                <View>
                  <ProfileHeader />
                  {/* Logout Button */}
                  <TouchableOpacity
                    className={`${isDark ? 'bg-red-900' : 'bg-red-50'} py-4 rounded-xl mb-4`}
                    onPress={handleLogout}
                  >
                    <Text className={`${isDark ? 'text-red-400' : 'text-red-600'} text-center font-semibold`}>
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
              }
              right={
                <View>
                  <ActivitySection />
                  <SettingsSection />
                </View>
              }
            />
          ) : isTablet ? (
            // Tablet layout
            <>
              <ProfileHeader />
              <View className="flex-row">
                <View className="flex-1 pr-2">
                  <SettingsSection />
                </View>
                <View className="flex-1 pl-2">
                  <ActivitySection />
                  {/* Logout Button */}
                  <TouchableOpacity
                    className={`${isDark ? 'bg-red-900' : 'bg-red-50'} py-4 rounded-xl mb-4`}
                    onPress={handleLogout}
                  >
                    <Text className={`${isDark ? 'text-red-400' : 'text-red-600'} text-center font-semibold`}>
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            // Mobile layout (unchanged)
            <>
              <ProfileHeader />
              <SettingsSection />
              {/* Logout Button */}
              <TouchableOpacity
                className={`${isDark ? 'bg-red-900' : 'bg-red-50'} py-4 rounded-xl mb-4`}
                onPress={handleLogout}
              >
                <Text className={`${isDark ? 'text-red-400' : 'text-red-600'} text-center font-semibold`}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}
