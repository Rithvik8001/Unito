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
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUnitsByCategory } from "@/app/constants/units";
import { BlurView } from "expo-blur";

// Placeholder for conversion logic - will be implemented in Phase 2
const performConversion = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string
): number => {
  // This is just a placeholder - actual conversion logic will be implemented later
  if (category === "length" && fromUnit === "in" && toUnit === "cm") {
    return value * 2.54;
  } else if (
    category === "currency" &&
    fromUnit === "usd" &&
    toUnit === "eur"
  ) {
    return value * 0.92; // Example exchange rate
  }
  return value; // Default fallback
};

// Get formula description based on units
const getFormulaDescription = (
  fromUnit: string,
  toUnit: string,
  category: string
): string => {
  if (category === "length" && fromUnit === "in" && toUnit === "cm") {
    return "1 inch = 2.54 centimeters";
  } else if (
    category === "currency" &&
    fromUnit === "usd" &&
    toUnit === "eur"
  ) {
    return "1 USD ≈ 0.92 EUR (example rate)";
  }
  return "Conversion formula will be shown here";
};

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
    } else if (categoryId === "temperature") {
      setFromUnit("c");
      setToUnit("f");
    } else if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
  }, [categoryId, units]);

  // Update result when inputs change
  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      const value = parseFloat(inputValue);
      if (!isNaN(value)) {
        const convertedValue = performConversion(
          value,
          fromUnit,
          toUnit,
          categoryId
        );
        setResult(convertedValue.toString());

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
  }, [inputValue, fromUnit, toUnit, categoryId]);

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
                nestedScrollEnabled={true}
              >
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.dropdownItem,
                      fromUnit === unit.id && {
                        backgroundColor: theme.primary + "20",
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
                          color: theme.text,
                          fontWeight: fromUnit === unit.id ? "600" : "normal",
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
            <Ionicons name="swap-vertical" size={24} color="white" />
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
                  borderColor: theme.border,
                  backgroundColor: theme.subtle,
                  opacity: animatedOpacity,
                  transform: [{ scale: animatedScale }],
                },
              ]}
            >
              <Text style={[styles.resultText, { color: theme.text }]}>
                {result}
              </Text>
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
                nestedScrollEnabled={true}
              >
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.dropdownItem,
                      toUnit === unit.id && {
                        backgroundColor: theme.primary + "20",
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
                          color: theme.text,
                          fontWeight: toUnit === unit.id ? "600" : "normal",
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

          {/* Formula Info */}
          <View style={styles.formulaContainer}>
            <Text style={[styles.formulaText, { color: theme.text + "80" }]}>
              {getFormulaDescription(fromUnit, toUnit, categoryId)}
            </Text>
          </View>
        </View>

        {/* Save to Favorites Button */}
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="star-outline" size={20} color={theme.warning} />
          <Text style={[styles.favoriteButtonText, { color: theme.text }]}>
            Save to Favorites
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  unitSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: "500",
  },
  resultContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "right",
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 24,
    maxHeight: 240,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownScroll: {
    padding: 8,
  },
  dropdownItem: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
  },
  formulaContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  formulaText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
