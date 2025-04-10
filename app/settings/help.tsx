import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export default function HelpCenter() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How does the outfit recommendation system work?',
      answer: 'Our outfit recommendation system uses a fine-tuned AI model that analyzes your existing wardrobe, personal style preferences, and occasion requirements. It considers factors like color coordination, style matching, weather conditions, and trending combinations to suggest outfits that are perfectly tailored to you. The more you use the app and rate outfits, the smarter our recommendations become.'
    },
    {
      id: '2',
      question: 'Can I create virtual outfits with clothes I don\'t own yet?',
      answer: 'Yes! You can add items to your wishlist and create virtual outfits to see how they would pair with your existing wardrobe. This feature helps you make more informed purchasing decisions and visualize new style combinations before buying new pieces.'
    },
    {
      id: '3',
      question: 'How do I organize my closet in the app?',
      answer: 'You can organize your virtual closet by categories (tops, bottoms, shoes, etc.), colors, seasons, or by creating custom collections. Simply upload photos of your clothing items, and our AI will automatically categorize them. You can also manually edit details, add tags, and create outfit sets for quick access.'
    },
    {
      id: '4',
      question: 'Is my fashion data private?',
      answer: 'Absolutely. We take your privacy seriously. Your closet data, outfit preferences, and personal information are securely stored and never shared with third parties without your explicit permission. You have full control over what you share with the community and what remains private.'
    },
    {
      id: '5',
      question: 'How can I share my outfits with friends?',
      answer: 'You can share your outfits directly from the app to social media platforms or via messaging apps. Simply navigate to any outfit, tap the share button, and choose your preferred sharing method. You can also participate in our community features where you can showcase your style to other users.'
    },
    {
      id: '6',
      question: 'What if I want to delete my account?',
      answer: 'You can delete your account at any time from the Account Settings page. When you delete your account, all your personal data, including uploaded images, preferences, and activity history, will be permanently removed from our servers within 30 days in accordance with our data retention policy.'
    },
    {
      id: '7',
      question: 'Does the app work offline?',
      answer: 'Some features of the app work offline, such as viewing your saved outfits and closet items. However, features that require AI processing, such as generating new outfit recommendations or analyzing new clothing items, require an internet connection.'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Theme-based styling helpers
  const getBackgroundColorClass = () => isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-emerald-50 to-white';
  const getTextColorClass = () => isDark ? 'text-white' : 'text-gray-700';
  const getHeaderTextColorClass = () => isDark ? 'text-emerald-400' : 'text-emerald-700';
  const getCardBackgroundClass = () => isDark ? 'bg-gray-800' : 'bg-white';
  const getCardBorderClass = () => isDark ? 'border-gray-700' : 'border-emerald-100';
  const getAccordionHeaderClass = () => isDark ? 'bg-gray-700' : 'bg-gray-50';
  const getAccordionBodyClass = () => isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <View className={`flex-1 ${getBackgroundColorClass()}`}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#065f46'} />
        </TouchableOpacity>
        <Text className={`${getHeaderTextColorClass()} text-xl font-bold`}>Help Center</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-xl mb-2`}>
            How can we help you?
          </Text>
          <Text className={`${getTextColorClass()} mb-4`}>
            Find answers to common questions about using Wardrobuddy.
          </Text>

          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mt-2 mb-4`}>
            Frequently Asked Questions
          </Text>
          
          {faqs.map((faq) => (
            <View key={faq.id} className="mb-3 overflow-hidden rounded-lg">
              <TouchableOpacity 
                className={`${getAccordionHeaderClass()} flex-row justify-between items-center p-4 rounded-t-lg`}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <Text className={`${getTextColorClass()} font-medium flex-1 pr-2`}>{faq.question}</Text>
                <Ionicons 
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={isDark ? '#9ca3af' : '#4b5563'} 
                />
              </TouchableOpacity>
              
              {expandedId === faq.id && (
                <View className={`${getAccordionBodyClass()} p-4 border-t rounded-b-lg`}>
                  <Text className={`${getTextColorClass()}`}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View className={`${getCardBackgroundClass()} rounded-xl shadow-md border ${getCardBorderClass()} p-4 mb-4`}>
          <Text className={`${getHeaderTextColorClass()} font-semibold text-lg mb-2`}>
            Need More Help?
          </Text>
          <TouchableOpacity 
            className="flex-row items-center py-3 mt-2"
            onPress={() => {}}
          >
            <Ionicons name="mail-outline" size={22} color={isDark ? '#10b981' : '#059669'} />
            <Text className={`${getTextColorClass()} ml-3`}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => {}}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={isDark ? '#10b981' : '#059669'} />
            <Text className={`${getTextColorClass()} ml-3`}>Live Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => {}}
          >
            <Ionicons name="book-outline" size={22} color={isDark ? '#10b981' : '#059669'} />
            <Text className={`${getTextColorClass()} ml-3`}>User Guide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 