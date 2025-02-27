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
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Placeholder for conversion logic - will be implemented in Phase 2
const performConversion = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // This is just a placeholder - actual conversion logic will be implemented later
  return value * 2.54; // Example: inches to cm
};

// Sample units for length category - will be moved to constants in Phase 2
const lengthUnits = [
  { id: "mm", name: "Millimeters (mm)" },
  { id: "cm", name: "Centimeters (cm)" },
  { id: "m", name: "Meters (m)" },
  { id: "km", name: "Kilometers (km)" },
  { id: "in", name: "Inches (in)" },
  { id: "ft", name: "Feet (ft)" },
  { id: "yd", name: "Yards (yd)" },
  { id: "mi", name: "Miles (mi)" },
];

export default function ConvertScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const categoryId = (params.category as string) || "length";

  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("in");
  const [toUnit, setToUnit] = useState("cm");
  const [result, setResult] = useState("2.54");
  const [showFromUnits, setShowFromUnits] = useState(false);
  const [showToUnits, setShowToUnits] = useState(false);

  // Get the appropriate units based on category
  const getUnitsForCategory = () => {
    // This will be expanded in Phase 2 with more categories
    return lengthUnits;
  };

  const units = getUnitsForCategory();

  // Update result when inputs change
  useEffect(() => {
    if (inputValue) {
      const value = parseFloat(inputValue);
      if (!isNaN(value)) {
        const convertedValue = performConversion(value, fromUnit, toUnit);
        setResult(convertedValue.toString());
      }
    }
  }, [inputValue, fromUnit, toUnit]);

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Converter
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* From Unit Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>From</Text>
            <TouchableOpacity
              style={[styles.unitSelector, { borderColor: theme.border }]}
              onPress={() => setShowFromUnits(!showFromUnits)}
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
                { color: theme.text, borderColor: theme.border },
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
                { backgroundColor: theme.card, borderColor: theme.border },
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
                    <Text style={[styles.dropdownText, { color: theme.text }]}>
                      {unit.name}
                    </Text>
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
              style={[styles.unitSelector, { borderColor: theme.border }]}
              onPress={() => setShowToUnits(!showToUnits)}
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

            <View
              style={[styles.resultContainer, { borderColor: theme.border }]}
            >
              <Text style={[styles.resultText, { color: theme.text }]}>
                {result}
              </Text>
            </View>
          </View>

          {/* Unit Selection Dropdown - To */}
          {showToUnits && (
            <View
              style={[
                styles.dropdown,
                { backgroundColor: theme.card, borderColor: theme.border },
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
                    <Text style={[styles.dropdownText, { color: theme.text }]}>
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Formula Info */}
          <View style={styles.formulaContainer}>
            <Text style={[styles.formulaText, { color: theme.text + "80" }]}>
              Formula: 1 inch = 2.54 centimeters
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  unitText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
  },
  resultContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  resultText: {
    fontSize: 18,
  },
  swapButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 20,
    maxHeight: 200,
  },
  dropdownScroll: {
    padding: 8,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  formulaContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  formulaText: {
    fontSize: 14,
  },
});
