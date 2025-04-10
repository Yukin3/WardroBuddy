import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { auth, storage, rtdb } from "@/config/firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set, onValue, off } from "firebase/database";
import { ref, listAll } from "firebase/storage";
import { useThemeStyles } from "@/hooks/useThemeStyles";

// Define a WishlistItem type
interface WishlistItem {
  id: string;
  imageUrl: string;
  name: string;
  notes?: string;
  createdAt: string;
  timerStarted?: number;
  timerEndTime?: number;
}

// Define a ClosetItem type for similar items
interface ClosetItem {
  id: string;
  imageUrl: string;
  name: string;
  genre: string;
  rating: number;
}

export default function WishlistItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<WishlistItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [similarItems, setSimilarItems] = useState<ClosetItem[]>([]);
  const [recommendations, setRecommendations] = useState<WishlistItem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const {
    getBackgroundClass,
    getCardBackgroundClass,
    getCardBorderClass,
    getTextClass,
    getHeaderTextClass,
    getSubtitleTextClass,
    getPrimaryButtonClass,
    getSecondaryButtonClass,
    getDestructiveButtonClass,
    getDestructiveTextClass,
    getPrimaryIconColor,
    isDark
  } = useThemeStyles();

  useEffect(() => {
    loadItemDetails();
    return () => {
      // Cleanup timer listener
      const userId = auth.currentUser?.uid;
      if (userId) {
        const timerRef = dbRef(rtdb, `timers/${userId}/${id}`);
        off(timerRef);
      }
    };
  }, [id]);

  useEffect(() => {
    // Set up timer listener
    const userId = auth.currentUser?.uid;
    if (userId && item?.id) {
      const timerRef = dbRef(rtdb, `timers/${userId}/${item.id}`);
      onValue(timerRef, (snapshot) => {
        const timerData = snapshot.val();
        if (timerData) {
          const { startTime, endTime } = timerData;
          const now = Date.now();
          if (now < endTime) {
            setTimeRemaining(endTime - now);
            setTimerActive(true);
          } else {
            setTimeRemaining(null);
            setTimerActive(false);
          }
        }
      });
    }
  }, [item?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1000) {
            clearInterval(interval);
            setTimerActive(false);
            return null;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeRemaining]);

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !item) return;

    const startTime = Date.now();
    const endTime = startTime + 48 * 60 * 60 * 1000; // 48 hours in milliseconds

    try {
      const timerRef = dbRef(rtdb, `timers/${userId}/${item.id}`);
      await set(timerRef, {
        startTime,
        endTime,
      });

      setTimeRemaining(48 * 60 * 60 * 1000);
      setTimerActive(true);
      Alert.alert(
        "Timer Started",
        "You have 48 hours to decide if you want to purchase this item."
      );
    } catch (error) {
      console.error("Error starting timer:", error);
      Alert.alert("Error", "Failed to start timer. Please try again.");
    }
  };

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError("Please sign in to view wishlist items");
        return;
      }

      // Get the image URL
      const imageRef = storageRef(
        storage,
        `images/wishlist/${userId}/${id}/image.jpg`
      );
      const imageUrl = await getDownloadURL(imageRef);

      // Get the metadata
      const metadataRef = storageRef(
        storage,
        `images/wishlist/${userId}/${id}/metadata.json`
      );
      const metadataResponse = await fetch(await getDownloadURL(metadataRef));
      const metadata = await metadataResponse.json();

      console.log("Wishlist item metadata:", metadata);

      const wishlistItem: WishlistItem = {
        id: id as string,
        imageUrl,
        name: metadata.name || "",
        notes: metadata.notes || "",
        createdAt: metadata.createdAt || new Date().toISOString(),
        timerStarted: metadata.timerStarted,
        timerEndTime: metadata.timerEndTime,
      };

      setItem(wishlistItem);

      // Get all outfits from the user's closet
      const outfitsRef = ref(storage, `images/${userId}`);
      console.log("Loading outfits from:", `images/${userId}`);
      const outfitsResult = await listAll(outfitsRef);
      console.log("Found outfits:", outfitsResult.prefixes.length);

      // Get outfits with their metadata
      const outfits = await Promise.all(
        outfitsResult.prefixes.map(async (folderRef) => {
          try {
            // Skip wishlist items
            if (folderRef.fullPath.includes("wishlist")) {
              return null;
            }

            const imageRef = ref(storage, `${folderRef.fullPath}/image.jpg`);
            const metadataRef = ref(
              storage,
              `${folderRef.fullPath}/metadata.json`
            );

            const [imageUrl, metadataUrl] = await Promise.all([
              getDownloadURL(imageRef),
              getDownloadURL(metadataRef),
            ]);

            const metadataResponse = await fetch(metadataUrl);
            const metadata = await metadataResponse.json();
            console.log("Outfit metadata structure:", {
              id: folderRef.name,
              hasClothingAnalysis: !!metadata.clothingAnalysis,
              clothingAnalysis: metadata.clothingAnalysis,
              fullMetadata: metadata,
            });

            return {
              id: folderRef.name,
              imageUrl,
              metadata,
            };
          } catch (error) {
            console.error(`Error processing outfit ${folderRef.name}:`, error);
            return null;
          }
        })
      );

      // Filter out failed retrievals
      const validOutfits = outfits.filter(
        (outfit): outfit is NonNullable<typeof outfit> => outfit !== null
      );
      console.log("Valid outfits:", validOutfits.length);

      // Calculate similarity scores based on clothing analysis
      const similarItems = validOutfits
        .map((outfit) => {
          const wishlistAnalysis = metadata.clothingAnalysis || {};
          const outfitAnalysis = outfit.metadata.clothingAnalysis || {};

          console.log("Comparing:", {
            wishlist: wishlistAnalysis,
            outfit: outfitAnalysis,
          });

          // Calculate similarity score (more flexible matching)
          let score = 0;
          let total = 0;

          const compareItems = (item1: string, item2: string) => {
            if (!item1 || !item2) return 0;

            const words1 = item1.toLowerCase().split(/\s+/);
            const words2 = item2.toLowerCase().split(/\s+/);

            // Count matching words
            const matches = words1.filter((word) =>
              words2.some((w2) => w2.includes(word) || word.includes(w2))
            );

            const similarity =
              matches.length / Math.max(words1.length, words2.length);
            console.log(
              "Comparing:",
              item1,
              "with",
              item2,
              "similarity:",
              similarity
            );
            return similarity;
          };

          if (wishlistAnalysis.top && outfitAnalysis.top) {
            const similarity = compareItems(
              wishlistAnalysis.top,
              outfitAnalysis.top
            );
            score += similarity;
            total += 1;
            console.log("Top similarity:", similarity);
          }
          if (wishlistAnalysis.bottom && outfitAnalysis.bottom) {
            const similarity = compareItems(
              wishlistAnalysis.bottom,
              outfitAnalysis.bottom
            );
            score += similarity;
            total += 1;
            console.log("Bottom similarity:", similarity);
          }
          if (wishlistAnalysis.outerwear && outfitAnalysis.outerwear) {
            const similarity = compareItems(
              wishlistAnalysis.outerwear,
              outfitAnalysis.outerwear
            );
            score += similarity;
            total += 1;
            console.log("Outerwear similarity:", similarity);
          }
          if (wishlistAnalysis.shoes && outfitAnalysis.shoes) {
            const similarity = compareItems(
              wishlistAnalysis.shoes,
              outfitAnalysis.shoes
            );
            score += similarity;
            total += 1;
            console.log("Shoes similarity:", similarity);
          }

          const totalScore = total > 0 ? (score / total) * 100 : 0;
          console.log("Total similarity score:", totalScore);

          return {
            id: outfit.id,
            imageUrl: outfit.imageUrl,
            name: outfit.metadata.details || "Outfit",
            genre: outfit.metadata.genre || "Unknown",
            rating: Math.round(totalScore / 20), // Convert to 1-5 star rating
            similarityScore: totalScore,
          };
        })
        .sort((a, b) => b.similarityScore - a.similarityScore); // Sort by similarity score in descending order

      // Filter items but ensure at least one is shown
      const filteredItems = similarItems.filter(
        (item, index) => item.similarityScore >= 20 || index === 0
      );

      console.log("Similar items after filtering:", filteredItems.length);
      setSimilarItems(filteredItems);
      setCompatibilityScore(Math.floor(Math.random() * 100)); // Keep random compatibility score for now
    } catch (err) {
      console.error("Error loading item details:", err);
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const renderSimilarItem = ({ item }: { item: ClosetItem }) => (
    <TouchableOpacity 
      className={`${getCardBackgroundClass()} mr-3 rounded-xl overflow-hidden border ${getCardBorderClass()} shadow-sm w-36`}
      onPress={() => router.push(`/tabs/closet?id=${item.id}`)}
    >
      <Image 
        source={{ uri: item.imageUrl }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className={`${getTextClass()} font-medium`} numberOfLines={1}>
          {item.name || "Unnamed"}
        </Text>
        {item.genre && (
          <Text className={`${getSubtitleTextClass()} text-xs`}>
            {item.genre}
          </Text>
        )}
        {item.rating > 0 && (
          <View className="flex-row items-center mt-1">
            <Text className="text-amber-500 text-xs mr-1">★</Text>
            <Text className={`${getSubtitleTextClass()} text-xs`}>
              {item.rating}/10
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRecommendation = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity 
      className={`${getCardBackgroundClass()} mr-3 rounded-xl overflow-hidden border ${getCardBorderClass()} shadow-sm w-36`}
      onPress={() => router.push(`/wishlist/${item.id}`)}
    >
      <Image 
        source={{ uri: item.imageUrl }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className={`${getTextClass()} font-medium`} numberOfLines={1}>
          {item.name || "Unnamed"}
        </Text>
        {item.notes && (
          <Text className={`${getSubtitleTextClass()} text-xs`} numberOfLines={1}>
            {item.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className={`flex-1 ${getBackgroundClass()} items-center justify-center p-4`}>
        <ActivityIndicator size="large" color={getPrimaryIconColor()} />
        <Text className={`${getHeaderTextClass()} mt-4`}>
          Loading item details...
        </Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className={`flex-1 ${getBackgroundClass()} items-center justify-center p-4`}>
        <View className={`${isDark ? 'bg-red-900' : 'bg-red-50'} p-4 rounded-xl border ${isDark ? 'border-red-800' : 'border-red-200'} mb-4`}>
          <Text className={`${isDark ? 'text-red-400' : 'text-red-600'} text-center`}>
            {error || "Failed to load wishlist item"}
          </Text>
        </View>
        <TouchableOpacity
          className={`${getSecondaryButtonClass()} py-3 px-6 rounded-xl mt-4`}
          onPress={() => router.back()}
        >
          <Text className={getHeaderTextClass()}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${getBackgroundClass()}`}>
      <ScrollView className="flex-1">
        {/* Header with back button */}
        <View className="relative">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-72"
            resizeMode="cover"
          />
          <TouchableOpacity
            className={`absolute top-4 left-4 ${isDark ? 'bg-gray-900/70' : 'bg-white/70'} p-2 rounded-full`}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#065f46"} />
          </TouchableOpacity>
        </View>

        {/* Item details */}
        <View className="p-4">
          <Text className={`${getHeaderTextClass()} text-2xl font-bold mb-1`}>{item.name}</Text>
          
          {/* Timer section if active */}
          {timerActive && timeRemaining !== null && (
            <View className={`${isDark ? 'bg-amber-900/50' : 'bg-amber-50'} px-4 py-3 rounded-xl mb-4 border ${isDark ? 'border-amber-800' : 'border-amber-200'}`}>
              <Text className={`${isDark ? 'text-amber-400' : 'text-amber-600'} font-medium mb-1`}>
                Decision Timer
              </Text>
              <Text className={`${isDark ? 'text-amber-300' : 'text-amber-700'} text-xl font-bold`}>
                {formatTimeRemaining(timeRemaining)}
              </Text>
              <Text className={`${isDark ? 'text-amber-400' : 'text-amber-600'} text-xs mt-1`}>
                Time remaining to make a purchase decision
              </Text>
            </View>
          )}

          {/* Notes section */}
          {item.notes && (
            <View className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-4 mb-4`}>
              <Text className={`${getHeaderTextClass()} font-semibold mb-2`}>Notes</Text>
              <Text className={getTextClass()}>{item.notes}</Text>
            </View>
          )}

          {/* Actions section */}
          <View className="flex-row mb-6">
            {timerActive ? (
              <View className="flex-1">
                <Text className={`${getSubtitleTextClass()} mb-2 text-center`}>
                  Timer is active. Make your decision within the time limit.
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                className={`${getPrimaryButtonClass()} flex-1 py-3 rounded-xl items-center`}
                onPress={handleStartTimer}
              >
                <Text className="text-white font-semibold">Start Decision Timer</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Similar items section */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-3`}>
            Similar Items in Your Closet
          </Text>
          {similarItems.length > 0 ? (
            <FlatList
              data={similarItems}
              renderItem={renderSimilarItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            />
          ) : (
            <View className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-4 mb-6`}>
              <Text className={`${getSubtitleTextClass()} text-center`}>
                No similar items found in your closet
              </Text>
            </View>
          )}

          {/* Recommendations section */}
          <Text className={`${getHeaderTextClass()} text-lg font-semibold mb-3`}>
            You Might Also Like
          </Text>
          {recommendations.length > 0 ? (
            <FlatList
              data={recommendations}
              renderItem={renderRecommendation}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            />
          ) : (
            <View className={`${getCardBackgroundClass()} border ${getCardBorderClass()} rounded-xl p-4 mb-6`}>
              <Text className={`${getSubtitleTextClass()} text-center`}>
                No recommendations available yet
              </Text>
            </View>
          )}

          {/* Delete button at bottom */}
          <TouchableOpacity
            className={`${getDestructiveButtonClass()} py-3 rounded-xl items-center mt-4 mb-8`}
            onPress={() => {
              Alert.alert(
                "Delete Item",
                "Are you sure you want to remove this item from your wishlist?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => {/* existing delete logic */} 
                  }
                ]
              );
            }}
          >
            <Text className={`${getDestructiveTextClass()} font-semibold`}>
              Remove from Wishlist
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
