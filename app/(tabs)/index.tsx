import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

import { useTheme } from "@/app/context/ThemeContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

  const handleCategoryPress = (category: (typeof categories)[0]) => {
    router.push({
      pathname: "/convert",
      params: { category: category.id },
    });
  };

  const renderCategory = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: theme.card }]}
      onPress={() => handleCategoryPress(item)}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}
      >
        <Ionicons name={item.icon as any} size={32} color={item.color} />
      </View>
      <Text style={[styles.categoryName, { color: theme.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Unito</Text>
        <Text style={[styles.subtitle, { color: theme.text + "99" }]}>
          Unit Converter
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 30,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 150,
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
