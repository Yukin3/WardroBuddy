import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";

export default function RootLayout() {
  const isSignedIn = false;

  return (
    <ThemeProvider>
      <Stack>
        {isSignedIn ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <Stack.Screen name="index" options={{ headerShown: false }} />
        )}
      </Stack>
    </ThemeProvider>
  );
}
