import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { auth } from "@/config/firebase";
import { getUserOutfitsFromStorage, Outfit } from "@/utils/firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useRouter } from "expo-router";
import { useResponsive } from "@/hooks/useResponsive";

// Separate component for outfit item to properly use hooks
const OutfitItem = React.memo(
  ({
    item,
    index,
    itemWidth,
    gap,
  }: {
    item: Outfit;
    index: number;
    itemWidth: number;
    gap: number;
  }) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemScaleAnim = useRef(new Animated.Value(0.9)).current;
    const { getCardBackgroundClass, getCardBorderClass, getTextClass, getHeaderTextClass, isDark } = useThemeStyles();

    useEffect(() => {
      const delay = index * 100;
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(itemScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [index]);

    return (
      <Animated.View
        className={`mb-4 rounded-2xl overflow-hidden ${getCardBackgroundClass()} shadow-md border ${getCardBorderClass()}`}
        style={{
          width: itemWidth,
          marginLeft: index % 2 === 0 ? 0 : gap,
          opacity: itemFadeAnim,
          transform: [{ scale: itemScaleAnim }],
        }}
      >
        <View className="w-full aspect-square items-center justify-center bg-gray-50">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="p-3">
          {item.details && (
            <Text className={`${getTextClass()} text-sm mb-2`} numberOfLines={2}>
              {item.details}
            </Text>
          )}
          {item.genre && (
            <View className={`${isDark ? 'bg-emerald-900' : 'bg-emerald-100'} px-3 py-1 rounded-full mb-2 self-start`}>
              <Text className={`${isDark ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-medium`}>
                {item.genre}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
              {item.date
                ? new Date(item.date).toLocaleDateString()
                : new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.rating && (
              <View className="flex-row items-center">
                <Text className="text-amber-500 text-xs mr-1">★</Text>
                <Text className={`${getTextClass()} text-xs font-medium`}>
                  {item.rating}/10
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  }
);

export default function ClosetScreen() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "genre">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const { 
    getBackgroundClass, 
    getCardBackgroundClass, 
    getCardBorderClass, 
    getTextClass,
    getHeaderTextClass,
    getSubtitleTextClass,
    getInputBackgroundClass,
    getPrimaryIconColor,
    getSecondaryButtonClass,
    getEmptyStateIconClass,
    isDark
  } = useThemeStyles();
  const router = useRouter();
  const { screenWidth, horizontalPadding, gridColumns, isMobile, isTablet, isDesktop } = useResponsive();

  // Responsive calculations
  const padding = horizontalPadding;
  const gap = isMobile ? 12 : isTablet ? 16 : 20;
  const numColumns = gridColumns;
  const itemWidth = (screenWidth - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const loadOutfits = async () => {
    try {
      setError(null);
      setIsOffline(false);
      const userId = auth.currentUser?.uid;
      console.log("Current user ID:", userId);

      if (!userId) {
        console.log("No user ID found, user not signed in");
        setError("Please sign in to view your outfits");
        return;
      }

      console.log("Calling getUserOutfitsFromStorage with userId:", userId);
      const userOutfits = await getUserOutfitsFromStorage(userId);
      console.log("Received outfits from storage:", userOutfits);

      if (userOutfits.length === 0) {
        setIsOffline(true);
      }

      setOutfits(userOutfits);
    } catch (err) {
      console.error("Error loading outfits:", err);
      setError("Failed to load outfits");
      setIsOffline(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOutfits();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOutfits();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getSortedOutfits = () => {
    let sorted = [...outfits];

    if (searchQuery) {
      sorted = sorted.filter(
        (outfit) =>
          outfit.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          outfit.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    sorted.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.date || a.createdAt;
        const dateB = b.date || b.createdAt;
        return sortOrder === "asc"
          ? new Date(dateA).getTime() - new Date(dateB).getTime()
          : new Date(dateB).getTime() - new Date(dateA).getTime();
      } else if (sortBy === "rating") {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
      } else if (sortBy === "genre") {
        const genreA = a.genre || "";
        const genreB = b.genre || "";
        return sortOrder === "asc"
          ? genreA.localeCompare(genreB)
          : genreB.localeCompare(genreA);
      }
      return 0;
    });

    return sorted;
  };

  const renderOutfit = ({ item, index }: { item: Outfit; index: number }) => {
    // Recalculate index for grid layout based on number of columns
    const adjustedIndex = index % numColumns;
    
    return (
      <OutfitItem 
        item={item} 
        index={index} 
        itemWidth={itemWidth} 
        gap={gap} 
      />
    );
  };

  if (loading) {
    return (
      <View className={`flex-1 ${getBackgroundClass()} items-center justify-center`}>
        <ActivityIndicator size="large" color={getPrimaryIconColor()} />
        <Text className={`${getHeaderTextClass()} mt-4 font-medium`}>
          Loading your closet...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 ${getBackgroundClass()} items-center justify-center p-4`}>
        <View className={`${isDark ? 'bg-red-900' : 'bg-red-50'} p-4 rounded-2xl border ${isDark ? 'border-red-800' : 'border-red-200'} mb-4`}>
          <Text className={`${isDark ? 'text-red-400' : 'text-red-600'} text-center font-medium`}>{error}</Text>
        </View>
        <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
          Please try again or check your internet connection
        </Text>
        <TouchableOpacity
          className={`${getSecondaryButtonClass()} px-6 py-3 rounded-xl`}
          onPress={() => {
            setLoading(true);
            loadOutfits();
          }}
        >
          <Text className={getHeaderTextClass()}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <Animated.View
        className={`px-${padding/4} pt-4 pb-2`}
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }}
      >
        <Text className={`${getHeaderTextClass()} ${isDesktop ? 'text-3xl' : isTablet ? 'text-2xl' : 'text-2xl'} font-bold mb-2`}>
          Your Closet
        </Text>

        {/* Search and filter */}
        <View className={`flex-row items-center mb-4 p-2 rounded-xl ${getInputBackgroundClass()}`}>
          <Ionicons name="search" size={20} color={isDark ? "#6b7280" : "#9ca3af"} className="mr-2" />
          <TextInput
            placeholder="Search outfits..."
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            className={`flex-1 ${getTextClass()}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={isDark ? "#6b7280" : "#9ca3af"} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <TouchableOpacity
            className={`flex-row items-center mr-3 px-3 py-2 rounded-lg ${sortBy === "date" ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100') : (isDark ? 'bg-gray-800' : 'bg-gray-100')}`}
            onPress={() => {
              setSortBy("date");
              if (sortBy === "date") toggleSortOrder();
            }}
          >
            <Ionicons
              name={sortOrder === "desc" ? "calendar" : "calendar-outline"}
              size={16}
              color={sortBy === "date" ? (isDark ? "#4ADE80" : "#059669") : (isDark ? "#9ca3af" : "#6b7280")}
              className="mr-1"
            />
            <Text className={`${sortBy === "date" ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : getSubtitleTextClass()} text-sm font-medium`}>
              Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center mr-3 px-3 py-2 rounded-lg ${sortBy === "rating" ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100') : (isDark ? 'bg-gray-800' : 'bg-gray-100')}`}
            onPress={() => {
              setSortBy("rating");
              if (sortBy === "rating") toggleSortOrder();
            }}
          >
            <Ionicons
              name={sortOrder === "desc" ? "star" : "star-outline"}
              size={16}
              color={sortBy === "rating" ? (isDark ? "#4ADE80" : "#059669") : (isDark ? "#9ca3af" : "#6b7280")}
              className="mr-1"
            />
            <Text className={`${sortBy === "rating" ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : getSubtitleTextClass()} text-sm font-medium`}>
              Rating {sortBy === "rating" && (sortOrder === "desc" ? "↓" : "↑")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center mr-3 px-3 py-2 rounded-lg ${sortBy === "genre" ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100') : (isDark ? 'bg-gray-800' : 'bg-gray-100')}`}
            onPress={() => {
              setSortBy("genre");
              if (sortBy === "genre") toggleSortOrder();
            }}
          >
            <Ionicons
              name={sortOrder === "desc" ? "bookmark" : "bookmark-outline"}
              size={16}
              color={sortBy === "genre" ? (isDark ? "#4ADE80" : "#059669") : (isDark ? "#9ca3af" : "#6b7280")}
              className="mr-1"
            />
            <Text className={`${sortBy === "genre" ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : getSubtitleTextClass()} text-sm font-medium`}>
              Genre {sortBy === "genre" && (sortOrder === "desc" ? "↓" : "↑")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {outfits.length === 0 ? (
        <Animated.View
          className={`flex-1 justify-center items-center p-6`}
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View className={`${getEmptyStateIconClass()} p-5 rounded-full mb-4`}>
            <Ionicons name="shirt-outline" size={40} color={getPrimaryIconColor()} />
          </View>
          <Text className={`${getHeaderTextClass()} ${isDesktop ? 'text-2xl' : isTablet ? 'text-xl' : 'text-xl'} font-bold text-center mb-2`}>
            Your Closet is Empty
          </Text>
          <Text className={`${getSubtitleTextClass()} text-center mb-6`}>
            Start adding outfits to build your digital closet
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/tabs/create')}
            className={`${getSecondaryButtonClass()} py-3 px-6 rounded-xl`}
          >
            <Text className={`${getHeaderTextClass()} font-semibold`}>Create First Outfit</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View 
          style={{ 
            flex: 1, 
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
          }}
        >
          <FlatList
            data={getSortedOutfits()}
            renderItem={renderOutfit}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={numColumns.toString()} // Force re-render when number of columns changes
            contentContainerStyle={{ 
              paddingHorizontal: padding, 
              paddingBottom: 20,
              maxWidth: isDesktop ? 1140 : undefined,
              alignSelf: isDesktop ? 'center' : undefined,
              width: '100%'
            }}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={getPrimaryIconColor()}
                colors={[getPrimaryIconColor()]}
              />
            }
            ListEmptyComponent={
              searchQuery ? (
                <View className="py-8 items-center">
                  <Text className={`${getSubtitleTextClass()} text-center`}>
                    No outfits match your search
                  </Text>
                </View>
              ) : null
            }
          />
        </Animated.View>
      )}
    </View>
  );
}
