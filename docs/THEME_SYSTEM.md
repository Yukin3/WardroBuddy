# WardroBuddy Theme System

This document provides guidelines for the unified theme system used across the WardroBuddy app. Using this system ensures a consistent visual appearance between all screens and components.

## Theme Basics

The app supports both light and dark modes, controlled through the user preferences system. The theme system provides helper functions to apply the correct styling based on the current theme.

## How to Use the Theme System

### 1. Import the useThemeStyles hook

In your component, import the theme styles hook:

```jsx
import { useThemeStyles } from "@/hooks/useThemeStyles";
```

### 2. Use the hook to access styling functions

```jsx
export default function YourComponent() {
  const {
    getBackgroundClass,
    getCardBackgroundClass,
    getTextClass,
    // ...other styling functions
    isDark,
  } = useThemeStyles();

  // Use in your JSX
  return <View className={`flex-1 ${getBackgroundClass()}`}>{/* ... */}</View>;
}
```

## Available Styling Functions

### Background Styles

- `getBackgroundClass()` - For screen backgrounds
- `getCardBackgroundClass()` - For card and panel backgrounds
- `getCardBorderClass()` - For card borders
- `getInputBackgroundClass()` - For input fields and search bars

### Text Styles

- `getTextClass()` - For regular text
- `getHeaderTextClass()` - For headings and titles
- `getStatsTextClass()` - For statistics and numbers
- `getSectionTextClass()` - For section titles
- `getSubtitleTextClass()` - For subtitles and descriptions

### Icon Colors

- `getIconColor()` - For regular icons
- `getChevronColor()` - For chevrons and arrows
- `getPrimaryIconColor()` - For primary accent icons

### Button Styles

- `getPrimaryButtonClass()` - For primary action buttons
- `getSecondaryButtonClass()` - For secondary action buttons
- `getDestructiveButtonClass()` - For destructive action buttons
- `getDestructiveTextClass()` - For destructive action text

### Special Elements

- `getEmptyStateIconClass()` - For empty state icon containers
- `getSelectedBackgroundClass(selected)` - For selectable items

### Direct Theme Access

- `isDark` - Boolean indicating if dark mode is active

## Common UI Patterns

### Screen Layout

```jsx
<View className={`flex-1 ${getBackgroundClass()}`}>
  <ScrollView className="flex-1">{/* Content here */}</ScrollView>
</View>
```

### Card Components

```jsx
<View
  className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}
>
  <Text className={`${getHeaderTextClass()} font-semibold text-lg mb-2`}>
    Card Title
  </Text>
  <Text className={getTextClass()}>Card content goes here</Text>
</View>
```

### Buttons

```jsx
{
  /* Primary Button */
}
<TouchableOpacity className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}>
  <Text className="text-white font-semibold">Primary Action</Text>
</TouchableOpacity>;

{
  /* Secondary Button */
}
<TouchableOpacity
  className={`${getSecondaryButtonClass()} px-6 py-3 rounded-xl`}
>
  <Text className={getHeaderTextClass()}>Secondary Action</Text>
</TouchableOpacity>;

{
  /* Destructive Button */
}
<TouchableOpacity
  className={`${getDestructiveButtonClass()} py-3 rounded-xl items-center`}
>
  <Text className={`${getDestructiveTextClass()} font-semibold`}>
    Destructive Action
  </Text>
</TouchableOpacity>;
```

### Loading States

```jsx
<View className={`flex-1 ${getBackgroundClass()} items-center justify-center`}>
  <ActivityIndicator size="large" color={getPrimaryIconColor()} />
  <Text className={`${getHeaderTextClass()} mt-4 font-medium`}>Loading...</Text>
</View>
```

### Empty States

```jsx
<View className={`flex-1 justify-center items-center p-6`}>
  <View className={`${getEmptyStateIconClass()} p-5 rounded-full mb-4`}>
    <Ionicons name="shirt-outline" size={40} color={getPrimaryIconColor()} />
  </View>
  <Text
    className={`${getHeaderTextClass()} text-xl font-bold text-center mb-2`}
  >
    No Items Found
  </Text>
  <Text className={`${getSubtitleTextClass()} text-center mb-6`}>
    Description text here
  </Text>
  <TouchableOpacity
    className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}
  >
    <Text className="text-white font-semibold">Action Button</Text>
  </TouchableOpacity>
</View>
```

## Color Palette

Our app uses a consistent color palette based on Tailwind CSS colors:

- Primary: Emerald (emerald-50 to emerald-900)
- Neutral: Gray (gray-50 to gray-900)
- Destructive: Red (red-50 to red-900)
- Warning: Amber (amber-50 to amber-900)

## Best Practices

1. Always use the theme helper functions instead of hardcoding colors
2. Test your UI in both light and dark modes
3. Follow the established patterns for spacing, shadows, and rounded corners
4. Use consistent font weights (normal for body text, semibold/bold for headings)
5. Ensure sufficient contrast between text and backgrounds
