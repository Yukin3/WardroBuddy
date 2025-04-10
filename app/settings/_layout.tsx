import React from 'react';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="theme" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="language" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="help" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
} 