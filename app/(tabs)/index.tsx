import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from "react-native";

import { useTheme } from "@/app/context/ThemeContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// Conversion categories with icons
const categories = [
  { id: "length", name: "Length", icon: "ruler-outline", color: "#4A6FFF" },
  { id: "weight", name: "Weight", icon: "barbell-outline", color: "#FF6B6B" },
  {
    id: "temperature",
    name: "Temperature",
    icon: "thermometer-outline",
    color: "#FF9F43",
  },
  { id: "currency", name: "Currency", icon: "cash-outline", color: "#4CAF50" },
  { id: "time", name: "Time", icon: "time-outline", color: "#9C27B0" },
  { id: "area", name: "Area", icon: "grid-outline", color: "#2196F3" },
  { id: "volume", name: "Volume", icon: "cube-outline", color: "#F44336" },
  { id: "data", name: "Data", icon: "server-outline", color: "#607D8B" },
  { id: "speed", name: "Speed", icon: "speedometer-outline", color: "#009688" },
];

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Create a ref for storing animated values for each item
  const itemAnimations = useRef(
    categories.map(() => ({
      fadeAnim: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  // Animation on mount
  useEffect(() => {
    // Animate main components
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate each category item with delay
    categories.forEach((_, index) => {
      const delay = index * 100;
      Animated.parallel([
        Animated.timing(itemAnimations[index].fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(itemAnimations[index].translateY, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleCategoryPress = (category: (typeof categories)[0]) => {
    router.push({
      pathname: "/convert",
      params: { category: category.id },
    });
  };

  // Animated header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.7, 1],
    extrapolate: "clamp",
  });

  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0.8, 1],
    extrapolate: "clamp",
  });

  const renderCategory = ({
    item,
    index,
  }: {
    item: (typeof categories)[0];
    index: number;
  }) => {
    return (
      <Animated.View
        style={{
          opacity: itemAnimations[index].fadeAnim,
          transform: [{ translateY: itemAnimations[index].translateY }],
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={[
            styles.categoryCard,
            {
              backgroundColor: theme.card,
              borderColor: isDark ? item.color + "30" : item.color + "20",
            },
          ]}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[item.color + "10", item.color + "20"]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.color + "15" },
            ]}
          >
            <Ionicons name={item.icon as any} size={32} color={item.color} />
          </View>
          <Text style={[styles.categoryName, { color: theme.text }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: headerOpacity,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>Unito</Text>
          <Text style={[styles.subtitle, { color: theme.text + "99" }]}>
            Unit Converter
          </Text>
        </Animated.View>

        {/* Compact header title that appears when scrolling */}
        <Animated.View
          style={[
            styles.compactHeader,
            {
              opacity: headerTitleOpacity,
              transform: [{ scale: headerTitleScale }],
            },
          ]}
        >
          <Text style={[styles.compactTitle, { color: theme.text }]}>
            Unito
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Quick access section */}
      <Animated.View
        style={[
          styles.quickAccessContainer,
          {
            backgroundColor: theme.card,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.quickAccessTitle, { color: theme.text }]}>
          Quick Access
        </Text>
        <View style={styles.quickAccessButtons}>
          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.primary + "15" },
            ]}
            onPress={() => handleCategoryPress(categories[0])}
          >
            <Ionicons
              name={"ruler-outline" as any}
              size={22}
              color={theme.primary}
            />
            <Text style={[styles.quickButtonText, { color: theme.text }]}>
              Length
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.secondary + "15" },
            ]}
            onPress={() => handleCategoryPress(categories[1])}
          >
            <Ionicons
              name={"barbell-outline" as any}
              size={22}
              color={theme.secondary}
            />
            <Text style={[styles.quickButtonText, { color: theme.text }]}>
              Weight
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.warning + "15" },
            ]}
            onPress={() => handleCategoryPress(categories[2])}
          >
            <Ionicons
              name={"thermometer-outline" as any}
              size={22}
              color={theme.warning}
            />
            <Text style={[styles.quickButtonText, { color: theme.text }]}>
              Temp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.success + "15" },
            ]}
            onPress={() => handleCategoryPress(categories[3])}
          >
            <Ionicons
              name={"cash-outline" as any}
              size={22}
              color={theme.success}
            />
            <Text style={[styles.quickButtonText, { color: theme.text }]}>
              Currency
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 20,
    zIndex: 10,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  compactHeader: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  compactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  quickAccessContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  quickAccessButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 16,
    width: "22%",
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 30,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
    borderWidth: 1,
    overflow: "hidden",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
