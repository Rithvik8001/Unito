import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
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
  { id: "time", name: "Time", icon: "time-outline", color: "#4CAF50" },
  { id: "area", name: "Area", icon: "grid-outline", color: "#9C27B0" },
  { id: "volume", name: "Volume", icon: "cube-outline", color: "#2196F3" },
  { id: "speed", name: "Speed", icon: "speedometer-outline", color: "#F44336" },
  { id: "data", name: "Data", icon: "server-outline", color: "#607D8B" },
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
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 140,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
