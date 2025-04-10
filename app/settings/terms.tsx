import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TermsOfService() {
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

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#065f46'} />
        </TouchableOpacity>
        <Text className={`${getHeaderTextClass()} text-xl font-bold`}>Terms of Service</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextClass()} text-xl font-bold mb-2`}>Terms of Service – WardoBuddy</Text>
          <Text className={`${getSubtitleTextClass()} mb-4`}>Effective Date: April 10, 2025</Text>
          
          <Text className={`${getTextClass()} mb-4`}>
            Welcome to WardoBuddy — your personalized wardrobe assistant powered by AI. Before you get started, please take a moment to review the terms below. These Terms of Service ("Terms") explain your rights and responsibilities when using our app.
          </Text>
          
          {/* Section 1 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>1. Acceptance of Terms</Text>
          <Text className={`${getTextClass()} mb-4`}>
            By accessing or using this app (the "App"), you agree to follow and be bound by these Terms. If you don't agree with any part of these Terms, please refrain from using the App.
          </Text>
          
          {/* Section 2 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>2. Overview of the Service</Text>
          <Text className={`${getTextClass()} mb-2`}>
            Our App helps you discover clothing combinations and personalized fashion suggestions using AI technology. Features include:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Smart outfit suggestions based on your wardrobe and preferences</Text>
            <Text className={`${getTextClass()} mb-1`}>• Aesthetic and style tracking over time</Text>
            <Text className={`${getTextClass()} mb-1`}>• Wishlist and shopping goal analysis</Text>
            <Text className={`${getTextClass()} mb-1`}>• Image-based outfit classification</Text>
            <Text className={`${getTextClass()} mb-1`}>• Data-driven trend matching tailored to your taste</Text>
          </View>
          <Text className={`${getTextClass()} mb-4`}>
            Our goal is to make fashion feel effortless, personal, and fun.
          </Text>
          
          {/* Section 3 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>3. User Content & Uploads</Text>
          <Text className={`${getTextClass()} mb-2`}>
            When you upload photos, profile info, or wishlist items:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Your images and data may be processed using AI models for outfit classification and recommendation purposes.</Text>
            <Text className={`${getTextClass()} mb-1`}>• We may use uploaded content to help improve our algorithms (e.g., model training, testing, internal research).</Text>
            <Text className={`${getTextClass()} mb-1`}>• Inappropriate uploads (e.g., nudity, hate symbols, impersonation) may lead to account suspension or legal reporting.</Text>
          </View>
          <Text className={`${getTextClass()} font-semibold mb-4`}>
            TL;DR: Keep uploads fashion-related, respectful, and safe for work.
          </Text>
          
          {/* Section 4 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>4. Privacy & Data Usage</Text>
          <Text className={`${getTextClass()} mb-2`}>
            We take your privacy seriously, but no system is bulletproof. Here's the real talk:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Our team or automated systems may view your uploads for moderation or troubleshooting.</Text>
            <Text className={`${getTextClass()} mb-1`}>• There's always some risk of unauthorized access, leaks, or third-party misuse.</Text>
            <Text className={`${getTextClass()} mb-1`}>• Avoid uploading highly sensitive data like IDs, addresses, or confidential documents.</Text>
          </View>
          <Text className={`${getTextClass()} mb-4`}>
            We do our best to protect your data — but always use common sense when sharing online.
          </Text>
          
          {/* Section 5 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>5. AI Personalization & Data Collection</Text>
          <Text className={`${getTextClass()} mb-2`}>
            To give you better recommendations, we use data such as:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Outfit photos and tags</Text>
            <Text className={`${getTextClass()} mb-1`}>• Style preferences and profile info</Text>
            <Text className={`${getTextClass()} mb-1`}>• App usage and interaction patterns</Text>
          </View>
          <Text className={`${getTextClass()} mb-2`}>
            This helps us:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Train and refine our AI models</Text>
            <Text className={`${getTextClass()} mb-1`}>• Personalize your experience</Text>
            <Text className={`${getTextClass()} mb-1`}>• Build new features you'll (hopefully) love</Text>
          </View>
          <Text className={`${getTextClass()} font-semibold mb-4`}>
            Opt-Out Available: You can turn off AI training or personalization in Settings → Data & Privacy Preferences.
          </Text>
          
          {/* Sections 6-11 */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>6. User Conduct</Text>
          <Text className={`${getTextClass()} mb-2`}>
            To keep the community safe and stylish, please don't:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• Post illegal, harmful, violent, or NSFW content</Text>
            <Text className={`${getTextClass()} mb-1`}>• Violate copyright or intellectual property laws</Text>
            <Text className={`${getTextClass()} mb-1`}>• Try to hack, reverse-engineer, or manipulate the app or AI systems</Text>
          </View>
          <Text className={`${getTextClass()} mb-4`}>
            Keep it classy. Keep it legal.
          </Text>
          
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>7. Ownership & Rights</Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• You always own the content you upload.</Text>
            <Text className={`${getTextClass()} mb-1`}>• We may use your content (with proper care) to run the app, improve AI, and develop new features.</Text>
            <Text className={`${getTextClass()} mb-1`}>• By uploading, you give us a limited, non-exclusive license to use your content for these purposes.</Text>
          </View>
          
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>8. Open Source & Attribution</Text>
          <Text className={`${getTextClass()} mb-4`}>
            Some components (datasets, models, code) may be based on open-source or publicly available resources. We do not claim exclusive rights over those parts and respect open licenses and provide attribution where required.
          </Text>
          
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>9. Account Suspension & Termination</Text>
          <Text className={`${getTextClass()} mb-2`}>
            We may restrict or remove access to your account if:
          </Text>
          <View className="mb-4 pl-4">
            <Text className={`${getTextClass()} mb-1`}>• You repeatedly violate these Terms</Text>
            <Text className={`${getTextClass()} mb-1`}>• Your content or behavior raises legal, safety, or ethical concerns</Text>
            <Text className={`${getTextClass()} mb-1`}>• The platform is being misused (e.g., spamming, scraping, abuse)</Text>
          </View>
          
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>10. Changes to Terms</Text>
          <Text className={`${getTextClass()} mb-4`}>
            We may update these Terms from time to time. You'll be notified about major updates via in-app notifications and email (if you've provided one). Continued use of the App means you're cool with the latest version of the Terms.
          </Text>
          
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-2 mt-4`}>11. Contact Us</Text>
          <Text className={`${getTextClass()} mb-2`}>
            Have questions, suggestions, or concerns?
          </Text>
          <View className="mb-6">
            <Text className={`${getTextClass()} mb-1`}>Email: support@WardoBuddy.com</Text>
            <Text className={`${getTextClass()} mb-1`}>In-App: Help Center → Contact Support</Text>
          </View>
          
          <TouchableOpacity
            className={`${getSecondaryButtonClass()} py-3 rounded-xl mb-4`}
            onPress={() => router.back()}
          >
            <Text className={`${getHeaderTextClass()} text-center font-semibold`}>Back to Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 