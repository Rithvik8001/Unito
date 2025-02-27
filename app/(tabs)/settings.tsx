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
  StatusBar,
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
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
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Profile
          </Text>
        </View>

        <View style={styles.profileContainer}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
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
                        backgroundColor: theme.subtle,
                      },
                    ]}
                    value={tempUsername}
                    onChangeText={setTempUsername}
                    autoFocus
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[
                        styles.editButton,
                        { backgroundColor: theme.error },
                      ]}
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
                  <TouchableOpacity
                    style={styles.editIconButton}
                    onPress={() => setIsEditing(true)}
                  >
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
        </View>
      </View>

      {/* Appearance Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={22}
              color={isDark ? theme.primary : theme.warning}
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
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      {/* Data Management Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Data Management
          </Text>
        </View>

        <TouchableOpacity style={styles.settingRow} onPress={clearHistory}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="trash-outline"
              size={22}
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
            color={theme.text + "50"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={clearFavorites}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="star-outline"
              size={22}
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
            color={theme.text + "50"}
          />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Version
          </Text>
          <Text style={[styles.settingValue, { color: theme.text + "80" }]}>
            1.0.0
          </Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Build
          </Text>
          <Text style={[styles.settingValue, { color: theme.text + "80" }]}>
            2023.1
          </Text>
        </View>

        <View style={styles.appInfoContainer}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: theme.primary + "10" },
            ]}
          >
            <Text style={[styles.logoText, { color: theme.primary }]}>
              Unito
            </Text>
          </View>
          <Text style={[styles.appDescription, { color: theme.text + "80" }]}>
            A beautiful unit converter app with multiple categories, offline
            support, and dark mode.
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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  section: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#00000015",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileContainer: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#00000015",
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIconButton: {
    padding: 4,
    marginLeft: 8,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
  },
  editButtons: {
    flexDirection: "row",
    marginLeft: 8,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  appInfoContainer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#00000015",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  appDescription: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
});
