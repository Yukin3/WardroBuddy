import React, {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { auth, storage } from "@/config/firebase";
import { getUserOutfitsFromStorage, Outfit } from "@/utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useResponsive } from "@/hooks/useResponsive";
import ResponsiveContainer from "@/components/ResponsiveContainer";
import ResponsiveGrid from "@/components/ResponsiveGrid";
import TwoColumnLayout from "@/components/TwoColumnLayout";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

interface WishlistItem {
  id: string;
  imageUrl: string;
  name: string;
  notes?: string;
  createdAt: string;
}

const Button = ({ label, onPress, style }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      className="bg-emerald-600 active:bg-emerald-700"
    >
      <Text className="text-white font-semibold">{label}</Text>
    </TouchableOpacity>
  );
};

import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {
    getBackgroundClass,
    getCardBackgroundClass,
    getCardBorderClass,
    getHeaderTextClass,
    getTextClass,
    getSubtitleTextClass,
    getEmptyStateIconClass,
    getPrimaryButtonClass,
    getPrimaryIconColor,
    isDark
  } = useThemeStyles();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const loadOutfits = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found, user not signed in");
        return;
      }

      const userOutfits = await getUserOutfitsFromStorage(userId);
      setOutfits(userOutfits);
    } catch (err) {
      console.error("Error loading outfits:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadOutfits(), loadWishlistItems()]);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const pickImageAsync = async () => {
    console.log("pickImageAsync");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  // Load wishlist items from Firebase Storage
  const loadWishlistItems = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found, user not signed in");
        return;
      }

      // Get wishlist items from Firebase Storage
      const storageRef = ref(storage, `images/wishlist/${userId}`);
      const result = await listAll(storageRef);

      // Get items from each folder
      const items = await Promise.all(
        result.prefixes.map(async (folderRef) => {
          try {
            // Get the image URL
            const imageRef = ref(storage, `${folderRef.fullPath}/image.jpg`);
            const imageUrl = await getDownloadURL(imageRef);

            // Get the metadata
            const metadataRef = ref(
              storage,
              `${folderRef.fullPath}/metadata.json`
            );
            const metadataResponse = await fetch(
              await getDownloadURL(metadataRef)
            );
            const metadata = await metadataResponse.json();

            const wishlistItem: WishlistItem = {
              id: folderRef.name,
              imageUrl,
              name: metadata.name || "",
              notes: metadata.notes || "",
              createdAt: metadata.createdAt || new Date().toISOString(),
            };
            return wishlistItem;
          } catch (error) {
            console.error(`Error processing folder ${folderRef.name}:`, error);
            return null;
          }
        })
      );

      const validItems = items
        .filter((item): item is WishlistItem => item !== null)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setWishlistItems(validItems);
    } catch (err) {
      console.error("Error loading wishlist items:", err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Load outfits when component mounts
  useEffect(() => {
    loadOutfits();
    loadWishlistItems();
  }, []);

  // Navigate to outfits tab
  const navigateToOutfits = () => {
    router.push("/tabs/closet");
  };

  // Navigate to create tab
  const navigateToCreate = () => {
    router.push("/tabs/create");
  };

  // Navigate to wishlist item
  const navigateToWishlistItem = (itemId: string) => {
    router.push(`/wishlist/${itemId}`);
  };

  // Navigate to add wishlist item
  const navigateToAddWishlist = () => {
    router.push("/tabs/wishlist");
  };

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingBottom: 20,
          paddingTop: isMobile ? 0 : 16
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={getPrimaryIconColor()}
            colors={[getPrimaryIconColor()]}
          />
        }
      >
        <ResponsiveContainer>
          {/* Welcome section for desktop */}
          {!isMobile && (
            <View className="px-4 mb-6">
              <Text className={`${getHeaderTextClass()} text-3xl font-bold mb-2`}>
                Welcome back
              </Text>
              <Text className={`${getSubtitleTextClass()} text-lg`}>
                Here's what's happening with your wardrobe today
              </Text>
            </View>
          )}

          {isDesktop ? (
            // Desktop layout with two columns
            <TwoColumnLayout
              left={
                <View className="p-2">
                  {/* Recommendations section */}
                  <View className="px-4 py-4 mb-4">
                    <View className="flex-row items-center justify-between mb-4">
                      <View>
                        <Text className={`${getHeaderTextClass()} text-xl font-bold`}>
                          Recommendations
                        </Text>
                        <Text className={`${getSubtitleTextClass()} text-sm`}>
                          Based on your wishlist
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={navigateToAddWishlist}
                        className="flex-row items-center"
                      >
                        <Text className={`${getHeaderTextClass()} mr-1`}>View All</Text>
                        <Ionicons name="chevron-forward" size={16} color={isDark ? "#4ADE80" : "#059669"} />
                      </TouchableOpacity>
                    </View>

                    {loadingWishlist ? (
                      <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    ) : wishlistItems.length === 0 ? (
                      <View
                        className={`${getCardBackgroundClass()} rounded-xl p-6 shadow-sm border ${getCardBorderClass()} items-center`}
                      >
                        <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                          <Ionicons name="heart-outline" size={32} color={getPrimaryIconColor()} />
                        </View>
                        <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                          Add Your First Wishlist Item
                        </Text>
                        <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                          Start building your wishlist to get personalized recommendations
                        </Text>
                        <TouchableOpacity
                          className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}
                          onPress={navigateToAddWishlist}
                        >
                          <Text className="text-white font-semibold">Get Started</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <ResponsiveGrid numColumns={2} gap={16}>
                        {wishlistItems.slice(0, 4).map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => navigateToWishlistItem(item.id)}
                            className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl shadow-sm overflow-hidden mb-4`}
                          >
                            <Image
                              source={{ uri: item.imageUrl }}
                              className="w-full h-40"
                              resizeMode="cover"
                            />
                            <View className="p-3">
                              <Text className={`${getTextClass()} font-semibold text-lg mb-1`} numberOfLines={1}>
                                {item.name}
                              </Text>
                              {item.notes && (
                                <Text className={`${getSubtitleTextClass()} text-sm`} numberOfLines={2}>
                                  {item.notes}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ResponsiveGrid>
                    )}
                  </View>
                </View>
              }
              right={
                <View className="p-2">
                  {/* Outfits section */}
                  <View className="px-4 py-4">
                    <View className="flex-row items-center justify-between mb-4">
                      <View>
                        <Text className={`${getHeaderTextClass()} text-xl font-bold`}>
                          Recent Outfits
                        </Text>
                        <Text className={`${getSubtitleTextClass()} text-sm`}>
                          From your closet
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={navigateToOutfits}
                        className="flex-row items-center"
                      >
                        <Text className={`${getHeaderTextClass()} mr-1`}>See All</Text>
                        <Ionicons name="chevron-forward" size={16} color={isDark ? "#4ADE80" : "#059669"} />
                      </TouchableOpacity>
                    </View>

                    {loading ? (
                      <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    ) : outfits.length === 0 ? (
                      <View
                        className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-6 shadow-sm items-center`}
                      >
                        <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                          <Ionicons name="shirt-outline" size={32} color={getPrimaryIconColor()} />
                        </View>
                        <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                          Create Your First Outfit
                        </Text>
                        <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                          Start building your digital closet by creating an outfit
                        </Text>
                        <TouchableOpacity
                          className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}
                          onPress={navigateToCreate}
                        >
                          <Text className="text-white font-semibold">Create Now</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <ResponsiveGrid numColumns={2} gap={16}>
                        {outfits.slice(0, 4).map((outfit) => (
                          <TouchableOpacity
                            key={outfit.id}
                            onPress={() => {}}
                            className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl shadow-sm overflow-hidden mb-4`}
                          >
                            <Image
                              source={{ uri: outfit.imageUrl }}
                              className="w-full h-40"
                              resizeMode="cover"
                            />
                            <View className="p-3">
                              <Text className={`${getTextClass()} font-semibold`} numberOfLines={1}>
                                {outfit.details?.split('\n')[0] || "New Outfit"}
                              </Text>
                              <Text className={`${getSubtitleTextClass()} text-xs mt-1`}>
                                {new Date(outfit.createdAt).toLocaleDateString()}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ResponsiveGrid>
                    )}
                  </View>
                </View>
              }
            />
          ) : isTablet ? (
            // Tablet layout with responsive grid
            <>
              {/* Recommendations section */}
              <View className="px-4 py-6 space-y-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className={`${getHeaderTextClass()} text-xl font-bold`}>
                      Recommendations
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-sm`}>
                      Based on your wishlist
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={navigateToAddWishlist}
                    className="flex-row items-center"
                  >
                    <Text className={`${getHeaderTextClass()} mr-1`}>View All</Text>
                    <Ionicons name="chevron-forward" size={16} color={isDark ? "#4ADE80" : "#059669"} />
                  </TouchableOpacity>
                </View>

                {loadingWishlist ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    <Text className={`${getSubtitleTextClass()} mt-2`}>Loading wishlist...</Text>
                  </View>
                ) : wishlistItems.length === 0 ? (
                  <TouchableOpacity
                    onPress={navigateToAddWishlist}
                    className={`${getCardBackgroundClass()} rounded-xl p-6 shadow-sm border ${getCardBorderClass()} items-center`}
                  >
                    <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                      <Ionicons name="heart-outline" size={32} color={getPrimaryIconColor()} />
                    </View>
                    <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                      Add Your First Wishlist Item
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                      Start building your wishlist to get personalized recommendations
                    </Text>
                    <View className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}>
                      <Text className="text-white font-semibold">Get Started →</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <ResponsiveGrid numColumns={3} gap={16}>
                    {wishlistItems.slice(0, 6).map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => navigateToWishlistItem(item.id)}
                        className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-3 shadow-sm`}
                      >
                        <Image
                          source={{ uri: item.imageUrl }}
                          className="w-full h-36 rounded-lg mb-2"
                          resizeMode="cover"
                        />
                        <Text className={`${getTextClass()} font-semibold text-lg mb-1`}>
                          {item.name}
                        </Text>
                        {item.notes && (
                          <Text className={`${getTextClass()} text-gray-600 text-sm`} numberOfLines={2}>
                            {item.notes}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ResponsiveGrid>
                )}
              </View>

              {/* Outfits section */}
              <View className="px-4 pb-6 space-y-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className={`${getHeaderTextClass()} text-xl font-bold`}>
                      Recent Outfits
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-sm`}>
                      From your closet
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={navigateToOutfits}
                    className="flex-row items-center"
                  >
                    <Text className={`${getHeaderTextClass()} mr-1`}>See All</Text>
                    <Ionicons name="chevron-forward" size={16} color={isDark ? "#4ADE80" : "#059669"} />
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    <Text className={`${getSubtitleTextClass()} mt-2`}>Loading outfits...</Text>
                  </View>
                ) : outfits.length === 0 ? (
                  <TouchableOpacity
                    onPress={navigateToCreate}
                    className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-6 shadow-sm items-center`}
                  >
                    <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                      <Ionicons name="shirt-outline" size={32} color={getPrimaryIconColor()} />
                    </View>
                    <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                      Create Your First Outfit
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                      Start building your digital closet by creating an outfit
                    </Text>
                    <View className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}>
                      <Text className="text-white font-semibold">Create Now →</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <ResponsiveGrid numColumns={3} gap={16}>
                    {outfits.slice(0, 6).map((outfit) => (
                      <TouchableOpacity
                        key={outfit.id}
                        onPress={() => {}}
                        className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl shadow-sm overflow-hidden`}
                      >
                        <Image
                          source={{ uri: outfit.imageUrl }}
                          className="w-full h-40"
                          resizeMode="cover"
                        />
                        <View className="p-3">
                          <Text className={`${getTextClass()} font-semibold`}>
                            {outfit.details?.split('\n')[0] || "New Outfit"}
                          </Text>
                          <Text className={`${getSubtitleTextClass()} text-xs mt-1`}>
                            {new Date(outfit.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ResponsiveGrid>
                )}
              </View>
            </>
          ) : (
            // Existing mobile layout
            <>
              {/* recommendations section */}
              <View className="px-4 py-6 space-y-4">
                <View className="space-y-1">
                  <Text className={`text-xl font-bold ${getHeaderTextClass()}`}>
                    Recommendations
                  </Text>
                  <Text className={`${getSubtitleTextClass()} text-sm`}>
                    Based on your wishlist
                  </Text>
                </View>

                {loadingWishlist ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    <Text className={`${getSubtitleTextClass()} mt-2`}>Loading wishlist...</Text>
                  </View>
                ) : wishlistItems.length === 0 ? (
                  <TouchableOpacity
                    onPress={navigateToAddWishlist}
                    className={`${getCardBackgroundClass()} rounded-2xl p-6 shadow-sm border ${getCardBorderClass()} items-center`}
                  >
                    <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                      <Ionicons name="heart-outline" size={32} color={getPrimaryIconColor()} />
                    </View>
                    <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                      Add Your First Wishlist Item
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                      Start building your wishlist to get personalized recommendations
                    </Text>
                    <View className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}>
                      <Text className="text-white font-semibold">Get Started →</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className="space-y-4">
                    {wishlistItems.slice(0, 2).map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => navigateToWishlistItem(item.id)}
                        className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-2xl p-3 shadow-sm`}
                      >
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{ width: "100%", height: 200 }}
                          resizeMode="cover"
                          className="rounded-xl mb-2"
                        />
                        <View className="p-2">
                          <Text className={`${getTextClass()} font-semibold text-lg mb-1`}>
                            {item.name}
                          </Text>
                          {item.notes && (
                            <Text className={`${getTextClass()} text-gray-600 text-sm`} numberOfLines={2}>
                              {item.notes}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* outfits section */}
              <View className="px-4 pb-6 space-y-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className={`text-xl font-bold ${getHeaderTextClass()}`}>
                      Recent Outfits
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-sm`}>
                      From your closet
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={navigateToOutfits}
                    className="flex-row items-center"
                  >
                    <Text className={`${getHeaderTextClass()} mr-1`}>See All</Text>
                    <Ionicons name="chevron-forward" size={16} color={isDark ? "#4ADE80" : "#059669"} />
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color={getPrimaryIconColor()} />
                    <Text className={`${getSubtitleTextClass()} mt-2`}>Loading outfits...</Text>
                  </View>
                ) : outfits.length === 0 ? (
                  <TouchableOpacity
                    onPress={navigateToCreate}
                    className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-2xl p-6 shadow-sm items-center`}
                  >
                    <View className={`w-16 h-16 ${getEmptyStateIconClass()} rounded-full items-center justify-center mb-4`}>
                      <Ionicons name="shirt-outline" size={32} color={getPrimaryIconColor()} />
                    </View>
                    <Text className={`${getHeaderTextClass()} text-lg font-semibold text-center mb-2`}>
                      Create Your First Outfit
                    </Text>
                    <Text className={`${getSubtitleTextClass()} text-center mb-4`}>
                      Start building your digital closet by creating an outfit
                    </Text>
                    <View className={`${getPrimaryButtonClass()} px-6 py-3 rounded-xl`}>
                      <Text className="text-white font-semibold">Create Now →</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className="space-y-4">
                    {outfits.slice(0, 5).map((outfit) => (
                      <View key={outfit.id} className="mr-4">
                        <Image
                          source={{ uri: outfit.imageUrl }}
                          className="w-24 h-64 rounded-2xl"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
});
