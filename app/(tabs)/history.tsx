import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

// Sample history data - will be replaced with AsyncStorage in Phase 3
const sampleHistory = [
  {
    id: "1",
    category: "length",
    fromValue: "10",
    fromUnit: "in",
    toValue: "25.4",
    toUnit: "cm",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isFavorite: true,
  },
  {
    id: "2",
    category: "weight",
    fromValue: "5",
    fromUnit: "kg",
    toValue: "11.02",
    toUnit: "lb",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isFavorite: false,
  },
  {
    id: "3",
    category: "temperature",
    fromValue: "32",
    fromUnit: "f",
    toValue: "0",
    toUnit: "c",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: true,
  },
];

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [history, setHistory] = useState(sampleHistory);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter history based on favorites toggle
  const filteredHistory = showFavoritesOnly
    ? history.filter((item) => item.isFavorite)
    : history;

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setHistory(
      history.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "length":
        return "ruler-outline";
      case "weight":
        return "barbell-outline";
      case "temperature":
        return "thermometer-outline";
      case "time":
        return "time-outline";
      case "area":
        return "grid-outline";
      case "volume":
        return "cube-outline";
      case "speed":
        return "speedometer-outline";
      default:
        return "swap-horizontal-outline";
    }
  };

  // Render history item
  const renderHistoryItem = ({ item }: { item: (typeof sampleHistory)[0] }) => (
    <View style={[styles.historyCard, { backgroundColor: theme.card }]}>
      <View style={styles.historyHeader}>
        <View style={styles.categoryContainer}>
          <Ionicons
            name={getCategoryIcon(item.category)}
            size={20}
            color={theme.primary}
          />
          <Text style={[styles.categoryText, { color: theme.text }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name={item.isFavorite ? "star" : "star-outline"}
            size={24}
            color={item.isFavorite ? theme.warning : theme.text + "80"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.conversionContainer}>
        <Text style={[styles.valueText, { color: theme.text }]}>
          {item.fromValue} {item.fromUnit}
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={20} color={theme.text + "80"} />
        </View>
        <Text style={[styles.valueText, { color: theme.text }]}>
          {item.toValue} {item.toUnit}
        </Text>
      </View>

      <Text style={[styles.timestampText, { color: theme.text + "80" }]}>
        {formatTimestamp(item.timestamp)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Conversion History
        </Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: showFavoritesOnly ? theme.primary : theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Ionicons
            name="star"
            size={16}
            color={showFavoritesOnly ? "white" : theme.text}
          />
          <Text
            style={[
              styles.filterText,
              { color: showFavoritesOnly ? "white" : theme.text },
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text + "80" }]}>
            {showFavoritesOnly
              ? "No favorite conversions yet"
              : "No conversion history yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    marginLeft: 4,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    marginLeft: 6,
    fontWeight: "500",
  },
  conversionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "500",
  },
  arrowContainer: {
    paddingHorizontal: 12,
  },
  timestampText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});
