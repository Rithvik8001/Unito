import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getUnitsByCategory,
  convertUnits,
  getFormulaDescription,
} from "@/app/constants/units";
import { BlurView } from "expo-blur";
import {
  fetchLatestRates,
  CurrencyRates,
  getFormattedTimeUntilRefresh,
} from "@/app/services/currencyService";

export default function ConvertScreen() {
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams();
  const categoryId = (params.category as string) || "length";

  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");
  const [showFromUnits, setShowFromUnits] = useState(false);
  const [showToUnits, setShowToUnits] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshStatus, setRefreshStatus] = useState<string>("");

  // Get the appropriate units based on category
  const units = getUnitsByCategory(categoryId);

  // Set default units based on category
  useEffect(() => {
    if (categoryId === "length") {
      setFromUnit("in");
      setToUnit("cm");
    } else if (categoryId === "currency") {
      setFromUnit("usd");
      setToUnit("eur");
      // Fetch currency rates when currency is selected
      fetchCurrencyRates();
      updateRefreshStatus();
    } else if (categoryId === "temperature") {
      setFromUnit("c");
      setToUnit("f");
    } else if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
  }, [categoryId, units]);

  // Update refresh status periodically
  useEffect(() => {
    if (categoryId === "currency") {
      updateRefreshStatus();
      const interval = setInterval(updateRefreshStatus, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [categoryId]);

  // Update the refresh status text
  const updateRefreshStatus = async () => {
    if (categoryId === "currency") {
      const status = await getFormattedTimeUntilRefresh();
      setRefreshStatus(status);
    }
  };

  // Fetch currency rates from API
  const fetchCurrencyRates = async (forceRefresh = false) => {
    if (categoryId !== "currency") return;

    setIsLoading(true);
    try {
      const rates = await fetchLatestRates("USD", forceRefresh);
      setCurrencyRates(rates);
      setLastUpdated(formatLastUpdated(rates.lastUpdated));
      updateRefreshStatus();
    } catch (error) {
      console.error("Error fetching currency rates:", error);
      Alert.alert(
        "Error",
        "Could not fetch latest currency rates. Using fallback rates instead."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format the last updated timestamp
  const formatLastUpdated = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return `Last updated: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (e) {
      return "Last updated: Unknown";
    }
  };

  // Update result when inputs change
  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      const value = parseFloat(inputValue);
      if (!isNaN(value)) {
        let convertedValue: number;

        // Use API rates for currency if available
        if (categoryId === "currency" && currencyRates) {
          const fromRate = currencyRates.rates[fromUnit] || 1;
          const toRate = currencyRates.rates[toUnit] || 1;
          convertedValue = (value * toRate) / fromRate;
        } else {
          convertedValue = convertUnits(value, fromUnit, toUnit, categoryId);
        }

        setResult(convertedValue.toFixed(6));

        // Animate the result
        animation.setValue(0);
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }
  }, [inputValue, fromUnit, toUnit, categoryId, currencyRates]);

  // Get unit name from id
  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
  };

  // Swap units
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a future implementation, we would save this to storage
  };

  // Refresh currency rates
  const handleRefreshRates = () => {
    if (refreshStatus === "Refresh available now") {
      fetchCurrencyRates(true); // Force refresh
    } else {
      Alert.alert(
        "Refresh Not Available",
        `Currency rates are updated weekly to minimize API calls. ${refreshStatus}.`,
        [
          { text: "OK" },
          { text: "Refresh Anyway", onPress: () => fetchCurrencyRates(true) },
        ]
      );
    }
  };

  // Get category icon
  const getCategoryIcon = () => {
    switch (categoryId) {
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

  // Format result for display
  const formatResult = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";

    // For very large or very small numbers, use scientific notation
    if (num > 1e9 || (num < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }

    // For currency, show 2 decimal places
    if (categoryId === "currency") {
      return num.toFixed(2);
    }

    // For other categories, remove trailing zeros
    return parseFloat(num.toFixed(6)).toString();
  };

  // Animation styles
  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Ionicons
              name={getCategoryIcon() as any}
              size={24}
              color={theme.primary}
              style={styles.titleIcon}
            />
            <Text style={[styles.title, { color: theme.text }]}>
              {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}{" "}
              Converter
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* From Unit Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>From</Text>
            <TouchableOpacity
              style={[
                styles.unitSelector,
                { borderColor: theme.border, backgroundColor: theme.subtle },
              ]}
              onPress={() => {
                setShowFromUnits(!showFromUnits);
                setShowToUnits(false);
              }}
            >
              <Text style={[styles.unitText, { color: theme.text }]}>
                {getUnitName(fromUnit)}
              </Text>
              <Ionicons
                name={showFromUnits ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.subtle,
                },
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="Enter value"
              placeholderTextColor={theme.text + "80"}
            />
          </View>

          {/* Unit Selection Dropdown - From */}
          {showFromUnits && (
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  shadowColor: isDark ? "#000" : "#888",
                },
              ]}
            >
              <ScrollView
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={false}
              >
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor:
                          fromUnit === unit.id
                            ? theme.primary + "20"
                            : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setFromUnit(unit.id);
                      setShowFromUnits(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        {
                          color:
                            fromUnit === unit.id ? theme.primary : theme.text,
                          fontWeight: fromUnit === unit.id ? "600" : "400",
                        },
                      ]}
                    >
                      {unit.name}
                    </Text>
                    {fromUnit === unit.id && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Swap Button */}
          <TouchableOpacity
            style={[styles.swapButton, { backgroundColor: theme.primary }]}
            onPress={handleSwapUnits}
          >
            <Ionicons name="swap-vertical" size={20} color="white" />
          </TouchableOpacity>

          {/* To Unit Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>To</Text>
            <TouchableOpacity
              style={[
                styles.unitSelector,
                { borderColor: theme.border, backgroundColor: theme.subtle },
              ]}
              onPress={() => {
                setShowToUnits(!showToUnits);
                setShowFromUnits(false);
              }}
            >
              <Text style={[styles.unitText, { color: theme.text }]}>
                {getUnitName(toUnit)}
              </Text>
              <Ionicons
                name={showToUnits ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.resultContainer,
                {
                  backgroundColor: theme.subtle,
                  borderColor: theme.border,
                  opacity: animatedOpacity,
                  transform: [{ scale: animatedScale }],
                },
              ]}
            >
              {isLoading && categoryId === "currency" ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : (
                <Text
                  style={[styles.resultText, { color: theme.text }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatResult(result)}
                </Text>
              )}
            </Animated.View>
          </View>

          {/* Unit Selection Dropdown - To */}
          {showToUnits && (
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  shadowColor: isDark ? "#000" : "#888",
                },
              ]}
            >
              <ScrollView
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={false}
              >
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor:
                          toUnit === unit.id
                            ? theme.primary + "20"
                            : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setToUnit(unit.id);
                      setShowToUnits(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        {
                          color:
                            toUnit === unit.id ? theme.primary : theme.text,
                          fontWeight: toUnit === unit.id ? "600" : "400",
                        },
                      ]}
                    >
                      {unit.name}
                    </Text>
                    {toUnit === unit.id && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Formula Card */}
        <View style={[styles.formulaCard, { backgroundColor: theme.card }]}>
          <View style={styles.formulaHeader}>
            <Text style={[styles.formulaTitle, { color: theme.text }]}>
              Formula
            </Text>
            <View style={styles.formulaActions}>
              {categoryId === "currency" && (
                <TouchableOpacity
                  style={[styles.refreshButton, { marginRight: 10 }]}
                  onPress={handleRefreshRates}
                >
                  <Ionicons
                    name={
                      refreshStatus === "Refresh available now"
                        ? "refresh"
                        : "time-outline"
                    }
                    size={22}
                    color={
                      refreshStatus === "Refresh available now"
                        ? theme.primary
                        : theme.text + "80"
                    }
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={22}
                  color={isFavorite ? theme.warning : theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.formulaText, { color: theme.text + "CC" }]}>
            {categoryId === "currency" && currencyRates
              ? `1 ${getUnitName(fromUnit).split(" ")[0]} = ${(
                  currencyRates.rates[toUnit] / currencyRates.rates[fromUnit]
                ).toFixed(4)} ${getUnitName(toUnit).split(" ")[0]}`
              : getFormulaDescription(fromUnit, toUnit, categoryId)}
          </Text>

          {categoryId === "currency" && (
            <View style={styles.currencyInfo}>
              {lastUpdated && (
                <Text
                  style={[styles.lastUpdated, { color: theme.text + "80" }]}
                >
                  {lastUpdated}
                </Text>
              )}
              {refreshStatus && (
                <Text
                  style={[styles.refreshStatus, { color: theme.text + "80" }]}
                >
                  {refreshStatus}
                </Text>
              )}
              <Text style={[styles.apiNote, { color: theme.text + "60" }]}>
                Rates are updated weekly to minimize API calls
              </Text>
            </View>
          )}
        </View>

        {/* Recent Conversions - Placeholder for future implementation */}
        <View style={[styles.recentCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.recentTitle, { color: theme.text }]}>
            Recent Conversions
          </Text>
          <View style={styles.recentList}>
            <Text style={[styles.emptyText, { color: theme.text + "80" }]}>
              Your recent conversions will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  unitSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: "500",
  },
  resultContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    minHeight: 50,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "right",
  },
  swapButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  dropdown: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 80,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 250,
    zIndex: 100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownScroll: {
    padding: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  dropdownText: {
    fontSize: 16,
  },
  formulaCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  formulaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  formulaTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  formulaActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 4,
  },
  refreshButton: {
    padding: 4,
  },
  formulaText: {
    fontSize: 16,
    lineHeight: 24,
  },
  currencyInfo: {
    marginTop: 12,
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 4,
  },
  refreshStatus: {
    fontSize: 12,
    marginBottom: 4,
  },
  apiNote: {
    fontSize: 11,
    fontStyle: "italic",
  },
  recentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  recentList: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
