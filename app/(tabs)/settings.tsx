import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState("User");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  // Save username
  const saveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername);
      setIsEditing(false);
    } else {
      Alert.alert("Invalid Username", "Username cannot be empty");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  // Clear history (placeholder for Phase 3)
  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all conversion history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // This will be implemented in Phase 3 with AsyncStorage
            Alert.alert("Success", "History cleared successfully");
          },
        },
      ]
    );
  };

  // Clear favorites (placeholder for Phase 3)
  const clearFavorites = () => {
    Alert.alert(
      "Clear Favorites",
      "Are you sure you want to remove all favorite conversions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // This will be implemented in Phase 3 with AsyncStorage
            Alert.alert("Success", "Favorites cleared successfully");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Profile
        </Text>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Username
          </Text>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                ]}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: theme.error }]}
                  onPress={cancelEditing}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: theme.success },
                  ]}
                  onPress={saveUsername}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text style={[styles.settingValue, { color: theme.text }]}>
                {username}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={theme.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Appearance Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={20}
              color={theme.text}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: theme.primary + "80" }}
            thumbColor={isDark ? theme.primary : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Data Management Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Data Management
        </Text>

        <TouchableOpacity style={styles.settingRow} onPress={clearHistory}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.error}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Clear History
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.text + "80"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, styles.lastRow]}
          onPress={clearFavorites}
        >
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.warning}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Clear Favorites
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.text + "80"}
          />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Version
          </Text>
          <Text style={[styles.settingValue, { color: theme.text + "80" }]}>
            1.0.0
          </Text>
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Build
          </Text>
          <Text style={[styles.settingValue, { color: theme.text + "80" }]}>
            2023.1
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#00000020",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 120,
  },
  editButtons: {
    flexDirection: "row",
    marginLeft: 8,
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
});
