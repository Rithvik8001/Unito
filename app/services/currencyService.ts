import { Platform } from "react-native";
import Constants from "expo-constants";

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
 * Fetch latest currency rates from currencyapi.com
 * @param base Base currency code (default: USD)
 * @returns Promise with currency rates
 */
export const fetchLatestRates = async (
  base: string = "USD"
): Promise<CurrencyRates> => {
  try {
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

    return {
      base: base.toLowerCase(),
      lastUpdated: data.meta.last_updated_at,
      rates,
    };
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    // Return default rates in case of error
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
