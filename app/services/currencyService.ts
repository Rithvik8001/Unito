import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface for currency data from API
interface CurrencyApiResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [key: string]: {
      code: string;
      value: number;
    };
  };
}

// Interface for our simplified currency rates
export interface CurrencyRates {
  base: string;
  lastUpdated: string;
  rates: {
    [key: string]: number;
  };
}

// Storage keys
const STORAGE_KEYS = {
  CURRENCY_RATES: "unito_currency_rates",
  LAST_FETCHED: "unito_currency_last_fetched",
};

// Refresh interval in milliseconds (7 days)
const REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000;

// Get API key from environment variables
const getApiKey = (): string => {
  // For Expo, we need to use Constants.expoConfig.extra
  if (Platform.OS !== "web" && Constants.expoConfig?.extra?.currencyApiKey) {
    return Constants.expoConfig.extra.currencyApiKey;
  }

  // Fallback to process.env (works in development)
  return process.env.CURRENCY_API_KEY || "";
};

/**
 * Check if we need to refresh the currency rates
 * @returns Promise<boolean> True if rates need to be refreshed
 */
const shouldRefreshRates = async (): Promise<boolean> => {
  try {
    const lastFetchedStr = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_FETCHED
    );

    if (!lastFetchedStr) {
      return true; // No timestamp found, need to fetch
    }

    const lastFetched = parseInt(lastFetchedStr, 10);
    const now = Date.now();

    // Check if the refresh interval has passed
    return now - lastFetched > REFRESH_INTERVAL;
  } catch (error) {
    console.error("Error checking refresh status:", error);
    return true; // On error, fetch new rates to be safe
  }
};

/**
 * Save currency rates to local storage
 * @param rates The currency rates to save
 */
const saveRatesToStorage = async (rates: CurrencyRates): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CURRENCY_RATES,
      JSON.stringify(rates)
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_FETCHED,
      Date.now().toString()
    );
  } catch (error) {
    console.error("Error saving currency rates to storage:", error);
  }
};

/**
 * Get currency rates from local storage
 * @returns Promise with currency rates or null if not found
 */
const getRatesFromStorage = async (): Promise<CurrencyRates | null> => {
  try {
    const ratesStr = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY_RATES);

    if (!ratesStr) {
      return null;
    }

    return JSON.parse(ratesStr) as CurrencyRates;
  } catch (error) {
    console.error("Error getting currency rates from storage:", error);
    return null;
  }
};

/**
 * Fetch latest currency rates from currencyapi.com
 * @param base Base currency code (default: USD)
 * @param forceRefresh Force refresh regardless of time interval
 * @returns Promise with currency rates
 */
export const fetchLatestRates = async (
  base: string = "USD",
  forceRefresh: boolean = false
): Promise<CurrencyRates> => {
  try {
    // Check if we have rates in storage and if they're still valid
    if (!forceRefresh) {
      const needsRefresh = await shouldRefreshRates();

      if (!needsRefresh) {
        const storedRates = await getRatesFromStorage();

        if (storedRates) {
          console.log("Using cached currency rates from storage");
          return storedRates;
        }
      }
    }

    // If we need to refresh or don't have stored rates, fetch from API
    console.log("Fetching fresh currency rates from API");
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("Currency API key not found");
    }

    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?base_currency=${base}`,
      {
        headers: {
          apikey: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CurrencyApiResponse = await response.json();

    // Transform the API response to our simplified format
    const rates: { [key: string]: number } = {};

    Object.keys(data.data).forEach((currencyCode) => {
      rates[currencyCode.toLowerCase()] = data.data[currencyCode].value;
    });

    const currencyRates = {
      base: base.toLowerCase(),
      lastUpdated: data.meta.last_updated_at,
      rates,
    };

    // Save the rates to storage for future use
    await saveRatesToStorage(currencyRates);

    return currencyRates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);

    // Try to get rates from storage as fallback
    const storedRates = await getRatesFromStorage();

    if (storedRates) {
      return storedRates;
    }

    // Return default rates in case of error and no stored rates
    return {
      base: base.toLowerCase(),
      lastUpdated: new Date().toISOString(),
      rates: {
        usd: 1,
        eur: 0.93,
        gbp: 0.79,
        jpy: 151.67,
        cny: 7.24,
        inr: 83.47,
        cad: 1.38,
        aud: 1.53,
        chf: 0.9,
        hkd: 7.81,
      },
    };
  }
};

/**
 * Get the time remaining until the next refresh
 * @returns Promise with time remaining in milliseconds
 */
export const getTimeUntilNextRefresh = async (): Promise<number> => {
  try {
    const lastFetchedStr = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_FETCHED
    );

    if (!lastFetchedStr) {
      return 0; // No timestamp found, need to fetch now
    }

    const lastFetched = parseInt(lastFetchedStr, 10);
    const now = Date.now();
    const elapsed = now - lastFetched;

    if (elapsed >= REFRESH_INTERVAL) {
      return 0; // Refresh interval has passed
    }

    return REFRESH_INTERVAL - elapsed;
  } catch (error) {
    console.error("Error calculating time until next refresh:", error);
    return 0;
  }
};

/**
 * Format the time until next refresh in a human-readable format
 * @returns Promise with formatted time string
 */
export const getFormattedTimeUntilRefresh = async (): Promise<string> => {
  const timeRemaining = await getTimeUntilNextRefresh();

  if (timeRemaining <= 0) {
    return "Refresh available now";
  }

  const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );

  if (days > 0) {
    return `Next refresh in ${days} day${
      days > 1 ? "s" : ""
    } and ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const minutes = Math.floor(
      (timeRemaining % (60 * 60 * 1000)) / (60 * 1000)
    );
    return `Next refresh in ${hours} hour${
      hours > 1 ? "s" : ""
    } and ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
};

/**
 * Convert amount from one currency to another
 * @param amount Amount to convert
 * @param from Source currency code
 * @param to Target currency code
 * @param rates Currency rates object
 * @returns Converted amount
 */
export const convertCurrency = (
  amount: number,
  from: string,
  to: string,
  rates: { [key: string]: number }
): number => {
  // If we're converting to the same currency, return the amount
  if (from === to) return amount;

  // Get the rates for the currencies
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;

  // Convert to the target currency
  return (amount * toRate) / fromRate;
};
