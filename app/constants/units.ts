// Unit conversion data for different categories

// Define interfaces for different unit types
interface BaseUnit {
  id: string;
  name: string;
}

interface ConversionUnit extends BaseUnit {
  toBase: number;
  fromBase: number;
}

interface CurrencyUnit extends BaseUnit {
  rate: number;
}

// Length units with conversion factors to meters
export const lengthUnits: ConversionUnit[] = [
  { id: "mm", name: "Millimeters (mm)", toBase: 0.001, fromBase: 1000 },
  { id: "cm", name: "Centimeters (cm)", toBase: 0.01, fromBase: 100 },
  { id: "m", name: "Meters (m)", toBase: 1, fromBase: 1 },
  { id: "km", name: "Kilometers (km)", toBase: 1000, fromBase: 0.001 },
  { id: "in", name: "Inches (in)", toBase: 0.0254, fromBase: 39.3701 },
  { id: "ft", name: "Feet (ft)", toBase: 0.3048, fromBase: 3.28084 },
  { id: "yd", name: "Yards (yd)", toBase: 0.9144, fromBase: 1.09361 },
  { id: "mi", name: "Miles (mi)", toBase: 1609.34, fromBase: 0.000621371 },
];

// Weight units with conversion factors to grams
export const weightUnits: ConversionUnit[] = [
  { id: "mg", name: "Milligrams (mg)", toBase: 0.001, fromBase: 1000 },
  { id: "g", name: "Grams (g)", toBase: 1, fromBase: 1 },
  { id: "kg", name: "Kilograms (kg)", toBase: 1000, fromBase: 0.001 },
  { id: "oz", name: "Ounces (oz)", toBase: 28.3495, fromBase: 0.035274 },
  { id: "lb", name: "Pounds (lb)", toBase: 453.592, fromBase: 0.00220462 },
  { id: "st", name: "Stone (st)", toBase: 6350.29, fromBase: 0.000157473 },
  { id: "t", name: "Metric Tons (t)", toBase: 1000000, fromBase: 0.000001 },
];

// Temperature units require special conversion formulas
export const temperatureUnits: BaseUnit[] = [
  { id: "c", name: "Celsius (°C)" },
  { id: "f", name: "Fahrenheit (°F)" },
  { id: "k", name: "Kelvin (K)" },
];

// Currency units - conversion rates would typically come from an API
export const currencyUnits: CurrencyUnit[] = [
  { id: "usd", name: "US Dollar ($)", rate: 1 },
  { id: "eur", name: "Euro (€)", rate: 0.93 },
  { id: "gbp", name: "British Pound (£)", rate: 0.79 },
  { id: "jpy", name: "Japanese Yen (¥)", rate: 151.67 },
  { id: "cny", name: "Chinese Yuan (¥)", rate: 7.24 },
  { id: "inr", name: "Indian Rupee (₹)", rate: 83.47 },
  { id: "cad", name: "Canadian Dollar (C$)", rate: 1.38 },
  { id: "aud", name: "Australian Dollar (A$)", rate: 1.53 },
  { id: "chf", name: "Swiss Franc (Fr)", rate: 0.9 },
  { id: "hkd", name: "Hong Kong Dollar (HK$)", rate: 7.81 },
];

// Time units with conversion factors to seconds
export const timeUnits: ConversionUnit[] = [
  { id: "ms", name: "Milliseconds (ms)", toBase: 0.001, fromBase: 1000 },
  { id: "s", name: "Seconds (s)", toBase: 1, fromBase: 1 },
  { id: "min", name: "Minutes (min)", toBase: 60, fromBase: 1 / 60 },
  { id: "h", name: "Hours (h)", toBase: 3600, fromBase: 1 / 3600 },
  { id: "d", name: "Days (d)", toBase: 86400, fromBase: 1 / 86400 },
  { id: "wk", name: "Weeks (wk)", toBase: 604800, fromBase: 1 / 604800 },
  { id: "mo", name: "Months (mo)", toBase: 2592000, fromBase: 1 / 2592000 }, // Approximation (30 days)
  { id: "yr", name: "Years (yr)", toBase: 31536000, fromBase: 1 / 31536000 }, // Approximation (365 days)
];

// Area units with conversion factors to square meters
export const areaUnits: ConversionUnit[] = [
  {
    id: "mm2",
    name: "Square Millimeters (mm²)",
    toBase: 0.000001,
    fromBase: 1000000,
  },
  {
    id: "cm2",
    name: "Square Centimeters (cm²)",
    toBase: 0.0001,
    fromBase: 10000,
  },
  { id: "m2", name: "Square Meters (m²)", toBase: 1, fromBase: 1 },
  { id: "ha", name: "Hectares (ha)", toBase: 10000, fromBase: 0.0001 },
  {
    id: "km2",
    name: "Square Kilometers (km²)",
    toBase: 1000000,
    fromBase: 0.000001,
  },
  {
    id: "in2",
    name: "Square Inches (in²)",
    toBase: 0.00064516,
    fromBase: 1550,
  },
  { id: "ft2", name: "Square Feet (ft²)", toBase: 0.092903, fromBase: 10.7639 },
  { id: "ac", name: "Acres (ac)", toBase: 4046.86, fromBase: 0.000247105 },
  {
    id: "mi2",
    name: "Square Miles (mi²)",
    toBase: 2589988.11,
    fromBase: 3.861e-7,
  },
];

// Volume units with conversion factors to liters
export const volumeUnits: ConversionUnit[] = [
  { id: "ml", name: "Milliliters (ml)", toBase: 0.001, fromBase: 1000 },
  { id: "l", name: "Liters (l)", toBase: 1, fromBase: 1 },
  { id: "m3", name: "Cubic Meters (m³)", toBase: 1000, fromBase: 0.001 },
  { id: "tsp", name: "Teaspoons (tsp)", toBase: 0.00492892, fromBase: 202.884 },
  {
    id: "tbsp",
    name: "Tablespoons (tbsp)",
    toBase: 0.0147868,
    fromBase: 67.628,
  },
  {
    id: "fl_oz",
    name: "Fluid Ounces (fl oz)",
    toBase: 0.0295735,
    fromBase: 33.814,
  },
  { id: "cup", name: "Cups (cup)", toBase: 0.236588, fromBase: 4.22675 },
  { id: "pt", name: "Pints (pt)", toBase: 0.473176, fromBase: 2.11338 },
  { id: "qt", name: "Quarts (qt)", toBase: 0.946353, fromBase: 1.05669 },
  { id: "gal", name: "Gallons (gal)", toBase: 3.78541, fromBase: 0.264172 },
];

// Data units with conversion factors to bytes
export const dataUnits: ConversionUnit[] = [
  { id: "b", name: "Bytes (B)", toBase: 1, fromBase: 1 },
  { id: "kb", name: "Kilobytes (KB)", toBase: 1024, fromBase: 1 / 1024 },
  { id: "mb", name: "Megabytes (MB)", toBase: 1048576, fromBase: 1 / 1048576 },
  {
    id: "gb",
    name: "Gigabytes (GB)",
    toBase: 1073741824,
    fromBase: 1 / 1073741824,
  },
  {
    id: "tb",
    name: "Terabytes (TB)",
    toBase: 1099511627776,
    fromBase: 1 / 1099511627776,
  },
  {
    id: "pb",
    name: "Petabytes (PB)",
    toBase: 1125899906842624,
    fromBase: 1 / 1125899906842624,
  },
  { id: "bit", name: "Bits (bit)", toBase: 0.125, fromBase: 8 },
  { id: "kbit", name: "Kilobits (Kbit)", toBase: 128, fromBase: 1 / 128 },
  { id: "mbit", name: "Megabits (Mbit)", toBase: 131072, fromBase: 1 / 131072 },
  {
    id: "gbit",
    name: "Gigabits (Gbit)",
    toBase: 134217728,
    fromBase: 1 / 134217728,
  },
];

// Speed units with conversion factors to meters per second
export const speedUnits: ConversionUnit[] = [
  { id: "mps", name: "Meters per Second (m/s)", toBase: 1, fromBase: 1 },
  {
    id: "kph",
    name: "Kilometers per Hour (km/h)",
    toBase: 0.277778,
    fromBase: 3.6,
  },
  {
    id: "mph",
    name: "Miles per Hour (mph)",
    toBase: 0.44704,
    fromBase: 2.23694,
  },
  {
    id: "fps",
    name: "Feet per Second (ft/s)",
    toBase: 0.3048,
    fromBase: 3.28084,
  },
  { id: "knot", name: "Knots (kn)", toBase: 0.514444, fromBase: 1.94384 },
];

// Type for unit arrays
type UnitArray = BaseUnit[] | ConversionUnit[] | CurrencyUnit[];

// Get units by category
export const getUnitsByCategory = (category: string): UnitArray => {
  switch (category) {
    case "length":
      return lengthUnits;
    case "weight":
      return weightUnits;
    case "temperature":
      return temperatureUnits;
    case "currency":
      return currencyUnits;
    case "time":
      return timeUnits;
    case "area":
      return areaUnits;
    case "volume":
      return volumeUnits;
    case "data":
      return dataUnits;
    case "speed":
      return speedUnits;
    default:
      return lengthUnits;
  }
};

// Conversion functions for each category
export const convertUnits = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string
): number => {
  if (isNaN(value)) return 0;

  // Special case for temperature
  if (category === "temperature") {
    return convertTemperature(value, fromUnit, toUnit);
  }

  // Special case for currency
  if (category === "currency") {
    return convertCurrency(value, fromUnit, toUnit);
  }

  // For other categories, use the conversion factors
  const units = getUnitsByCategory(category) as ConversionUnit[];
  const fromUnitData = units.find((unit) => unit.id === fromUnit);
  const toUnitData = units.find((unit) => unit.id === toUnit);

  if (!fromUnitData || !toUnitData) return 0;

  // Convert to base unit, then to target unit
  const valueInBaseUnit = value * fromUnitData.toBase;
  return valueInBaseUnit * toUnitData.fromBase;
};

// Temperature conversion function
export const convertTemperature = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to Celsius first (our base unit for temperature)
  let celsius;
  switch (fromUnit) {
    case "c":
      celsius = value;
      break;
    case "f":
      celsius = (value - 32) * (5 / 9);
      break;
    case "k":
      celsius = value - 273.15;
      break;
    default:
      return 0;
  }

  // Convert from Celsius to target unit
  switch (toUnit) {
    case "c":
      return celsius;
    case "f":
      return celsius * (9 / 5) + 32;
    case "k":
      return celsius + 273.15;
    default:
      return 0;
  }
};

// Currency conversion function
export const convertCurrency = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  const units = currencyUnits;
  const fromCurrency = units.find((unit) => unit.id === fromUnit);
  const toCurrency = units.find((unit) => unit.id === toUnit);

  if (!fromCurrency || !toCurrency) return 0;

  // Convert to USD first, then to target currency
  const valueInUSD = value / fromCurrency.rate;
  return valueInUSD * toCurrency.rate;
};

// Get formula description for conversion
export const getFormulaDescription = (
  fromUnit: string,
  toUnit: string,
  category: string
): string => {
  if (category === "temperature") {
    if (fromUnit === "c" && toUnit === "f") {
      return "°F = °C × (9/5) + 32";
    } else if (fromUnit === "c" && toUnit === "k") {
      return "K = °C + 273.15";
    } else if (fromUnit === "f" && toUnit === "c") {
      return "°C = (°F - 32) × (5/9)";
    } else if (fromUnit === "f" && toUnit === "k") {
      return "K = (°F - 32) × (5/9) + 273.15";
    } else if (fromUnit === "k" && toUnit === "c") {
      return "°C = K - 273.15";
    } else if (fromUnit === "k" && toUnit === "f") {
      return "°F = (K - 273.15) × (9/5) + 32";
    }
  }

  if (category === "currency") {
    const fromCurrency = currencyUnits.find((unit) => unit.id === fromUnit);
    const toCurrency = currencyUnits.find((unit) => unit.id === toUnit);

    if (fromCurrency && toCurrency) {
      const rate = toCurrency.rate / fromCurrency.rate;
      return `1 ${fromCurrency.name.split(" ")[0]} = ${rate.toFixed(4)} ${
        toCurrency.name.split(" ")[0]
      }`;
    }
  }

  if (
    ["length", "weight", "time", "area", "volume", "data", "speed"].includes(
      category
    )
  ) {
    const units = getUnitsByCategory(category) as ConversionUnit[];
    const fromUnitData = units.find((unit) => unit.id === fromUnit);
    const toUnitData = units.find((unit) => unit.id === toUnit);

    if (!fromUnitData || !toUnitData) return "";

    // For direct conversion between units
    const conversionFactor = (
      fromUnitData.toBase * toUnitData.fromBase
    ).toFixed(6);
    return `Multiply by ${conversionFactor}`;
  }

  return "";
};
