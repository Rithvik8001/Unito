import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
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
    category: "currency",
    fromValue: "100",
    fromUnit: "usd",
    toValue: "92",
    toUnit: "eur",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isFavorite: true,
  },
  {
    id: "3",
    category: "weight",
    fromValue: "5",
    fromUnit: "kg",
    toValue: "11.02",
    toUnit: "lb",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: false,
  },
  {
    id: "4",
    category: "temperature",
    fromValue: "32",
    fromUnit: "f",
    toValue: "0",
    toUnit: "c",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    isFavorite: true,
  },
];

export default function HistoryScreen() {
  const { theme, isDark } = useTheme();
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

    // If today, show only time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // If yesterday, show "Yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Otherwise show date and time
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      case "currency":
        return "cash-outline";
      case "time":
        return "time-outline";
      case "area":
        return "grid-outline";
      case "volume":
        return "cube-outline";
      case "data":
        return "server-outline";
      case "speed":
        return "speedometer-outline";
      default:
        return "swap-horizontal-outline";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "length":
        return "#4A6FFF";
      case "weight":
        return "#FF6B6B";
      case "temperature":
        return "#FF9F43";
      case "currency":
        return "#4CAF50";
      case "time":
        return "#9C27B0";
      case "area":
        return "#2196F3";
      case "volume":
        return "#F44336";
      case "data":
        return "#607D8B";
      case "speed":
        return "#009688";
      default:
        return theme.primary;
    }
  };

  // Render history item
  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: (typeof sampleHistory)[0];
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.historyCard,
        {
          backgroundColor: theme.card,
          marginTop: index === 0 ? 8 : 0,
        },
      ]}
    >
      <View style={styles.historyHeader}>
        <View style={styles.categoryContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getCategoryColor(item.category) + "20" },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(item.category) as any}
              size={20}
              color={getCategoryColor(item.category)}
            />
          </View>
          <Text style={[styles.categoryText, { color: theme.text }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={item.isFavorite ? "star" : "star-outline"}
            size={24}
            color={item.isFavorite ? theme.warning : theme.text + "50"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.conversionContainer}>
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: theme.text }]}>
            {item.fromValue}
          </Text>
          <Text style={[styles.unitText, { color: theme.text + "80" }]}>
            {item.fromUnit}
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={20} color={theme.text + "50"} />
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: theme.text }]}>
            {item.toValue}
          </Text>
          <Text style={[styles.unitText, { color: theme.text + "80" }]}>
            {item.toUnit}
          </Text>
        </View>
      </View>

      <Text style={[styles.timestampText, { color: theme.text + "60" }]}>
        {formatTimestamp(item.timestamp)}
      </Text>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>History</Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: showFavoritesOnly ? theme.primary : theme.subtle,
              borderColor: showFavoritesOnly ? theme.primary : theme.border,
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
          <Ionicons name="time-outline" size={80} color={theme.text + "20"} />
          <Text style={[styles.emptyText, { color: theme.text + "80" }]}>
            {showFavoritesOnly
              ? "No favorite conversions yet"
              : "No conversion history yet"}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "60" }]}>
            {showFavoritesOnly
              ? "Mark conversions as favorites to see them here"
              : "Your conversion history will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 15,
  },
  listContainer: {
    paddingBottom: 30,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 4,
  },
  conversionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  valueText: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 4,
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  timestampText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
