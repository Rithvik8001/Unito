import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StatusBar,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Onboarding data
const onboardingData = [
  {
    id: "1",
    title: "Welcome to Unito",
    description:
      "The most elegant unit converter app with a beautiful design and powerful features.",
    icon: "swap-horizontal",
    color: "#4361EE",
  },
  {
    id: "2",
    title: "Multiple Categories",
    description:
      "Convert between units in various categories including length, weight, temperature, currency, and more.",
    icon: "grid",
    color: "#F72585",
  },
  {
    id: "3",
    title: "Instant Conversion",
    description:
      "Get real-time conversions as you type with accurate results and helpful formulas.",
    icon: "flash",
    color: "#4CC9F0",
  },
  {
    id: "4",
    title: "Save Favorites",
    description:
      "Save your frequently used conversions for quick access and view your conversion history.",
    icon: "star",
    color: "#FB8500",
  },
];

export default function OnboardingScreen() {
  const { theme, isDark } = useTheme();
  const colorScheme = useColorScheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation values
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Start animation when component mounts
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle skip
  const handleSkip = () => {
    // Use push instead of navigate to avoid hook issues
    router.push("/(tabs)");
  };

  // Handle next
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Use push instead of navigate to avoid hook issues
      router.push("/(tabs)");
    }
  };

  // Render dot indicators
  const renderDotIndicators = () => {
    const dotPosition = Animated.divide(scrollX, width);

    return (
      <View style={styles.dotContainer}>
        {onboardingData.map((_, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          const scale = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          const width = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
                  width,
                  backgroundColor: onboardingData[index].color,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Render onboarding item
  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof onboardingData)[0];
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const imageScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const imageOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.itemContainer}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [{ scale: imageScale }],
              opacity: imageOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[item.color + "20", item.color + "40"]}
            style={styles.imageBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={40} color="white" />
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: theme.text + "CC" }]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.primary }]}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />

        {/* Dot indicators */}
        {renderDotIndicators()}

        {/* Next button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: onboardingData[currentIndex].color },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
          <Ionicons
            name={
              currentIndex === onboardingData.length - 1
                ? "checkmark"
                : "arrow-forward"
            }
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
});
