import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import ResponsiveContainer from "@/components/ResponsiveContainer";

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Common tab options for all screens
  const getTabBarIcon = (focused: boolean, iconName: any) => {
    const iconColor = focused
      ? isDark
        ? "#4ADE80"
        : "#059669"
      : isDark
      ? "#9CA3AF"
      : "#6B7280";

    return <Ionicons name={iconName} size={24} color={iconColor} />;
  };

  // Apply different styles based on screen size
  if (!isMobile) {
    // For tablet and desktop, use a side navigation
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: {
            position: "absolute",
            left: 0,
            top: isDesktop ? 48 : 24,
            bottom: isDesktop ? 48 : 24,
            width: isDesktop ? 240 : 80,
            height: "auto",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            borderTopWidth: 0,
            borderRightWidth: 1,
            borderRightColor: isDark ? "#374151" : "#E5E7EB",
            elevation: 0,
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
          tabBarShowLabel: isDesktop,
          tabBarActiveTintColor: isDark ? "#4ADE80" : "#059669",
          tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280",
          tabBarLabelStyle: {
            marginLeft: isDesktop ? -20 : 0,
            fontSize: 14,
          },
          tabBarItemStyle: {
            height: 60,
            justifyContent: isDesktop ? "flex-start" : "center",
            paddingLeft: isDesktop ? 24 : 0,
            marginVertical: 4,
            borderRadius: 8,
            marginHorizontal: 8,
          },
          headerStyle: {
            backgroundColor: isDark ? "#111827" : "#F3FAFA",
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1F2937",
            fontSize: 18,
            fontWeight: "600",
          },
          headerTitleAlign: "center",
          // Content container padding
          contentStyle: {
            paddingLeft: isDesktop ? 240 : 80,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: isDesktop ? "Home" : "",
            headerTitle: "WardroBuddy",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "home"),
          }}
        />
        <Tabs.Screen
          name="closet"
          options={{
            title: isDesktop ? "Closet" : "",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "shirt"),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: isDesktop ? "Create" : "",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "add-circle"),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: isDesktop ? "Wishlist" : "",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "heart"),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: isDesktop ? "Social" : "",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "people"),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: isDesktop ? "Profile" : "",
            tabBarIcon: ({ focused }: { focused: boolean }) => getTabBarIcon(focused, "person"),
          }}
        />
      </Tabs>
    );
  }

  // Default mobile bottom tab navigation
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarBackground: () => (
          <BlurView 
            tint={isDark ? 'dark' : 'light'} 
            intensity={80} 
            style={StyleSheet.absoluteFill} 
          />
        ),
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#F3FAFA',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#374151' : '#E5E7EB',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: isDark ? '#FFFFFF' : '#1F2937',
          fontSize: 18,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'WardroBuddy',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "home"),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "shirt"),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "add-circle"),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "heart"),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "people"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            getTabBarIcon(focused, "person"),
        }}
      />
    </Tabs>
  );
}
