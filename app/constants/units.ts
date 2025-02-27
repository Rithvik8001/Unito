// Unit conversion data for different categories

// Length units
export const lengthUnits = [
  { id: "mm", name: "Millimeters (mm)" },
  { id: "cm", name: "Centimeters (cm)" },
  { id: "m", name: "Meters (m)" },
  { id: "km", name: "Kilometers (km)" },
  { id: "in", name: "Inches (in)" },
  { id: "ft", name: "Feet (ft)" },
  { id: "yd", name: "Yards (yd)" },
  { id: "mi", name: "Miles (mi)" },
];

// Weight units
export const weightUnits = [
  { id: "mg", name: "Milligrams (mg)" },
  { id: "g", name: "Grams (g)" },
  { id: "kg", name: "Kilograms (kg)" },
  { id: "oz", name: "Ounces (oz)" },
  { id: "lb", name: "Pounds (lb)" },
  { id: "st", name: "Stone (st)" },
  { id: "t", name: "Metric Tons (t)" },
];

// Temperature units
export const temperatureUnits = [
  { id: "c", name: "Celsius (°C)" },
  { id: "f", name: "Fahrenheit (°F)" },
  { id: "k", name: "Kelvin (K)" },
];

// Currency units
export const currencyUnits = [
  { id: "usd", name: "US Dollar ($)" },
  { id: "eur", name: "Euro (€)" },
  { id: "gbp", name: "British Pound (£)" },
  { id: "jpy", name: "Japanese Yen (¥)" },
  { id: "cny", name: "Chinese Yuan (¥)" },
  { id: "inr", name: "Indian Rupee (₹)" },
  { id: "cad", name: "Canadian Dollar (C$)" },
  { id: "aud", name: "Australian Dollar (A$)" },
  { id: "chf", name: "Swiss Franc (Fr)" },
  { id: "hkd", name: "Hong Kong Dollar (HK$)" },
];

// Time units
export const timeUnits = [
  { id: "ms", name: "Milliseconds (ms)" },
  { id: "s", name: "Seconds (s)" },
  { id: "min", name: "Minutes (min)" },
  { id: "h", name: "Hours (h)" },
  { id: "d", name: "Days (d)" },
  { id: "wk", name: "Weeks (wk)" },
  { id: "mo", name: "Months (mo)" },
  { id: "yr", name: "Years (yr)" },
];

// Area units
export const areaUnits = [
  { id: "mm2", name: "Square Millimeters (mm²)" },
  { id: "cm2", name: "Square Centimeters (cm²)" },
  { id: "m2", name: "Square Meters (m²)" },
  { id: "ha", name: "Hectares (ha)" },
  { id: "km2", name: "Square Kilometers (km²)" },
  { id: "in2", name: "Square Inches (in²)" },
  { id: "ft2", name: "Square Feet (ft²)" },
  { id: "ac", name: "Acres (ac)" },
  { id: "mi2", name: "Square Miles (mi²)" },
];

// Volume units
export const volumeUnits = [
  { id: "ml", name: "Milliliters (ml)" },
  { id: "l", name: "Liters (l)" },
  { id: "m3", name: "Cubic Meters (m³)" },
  { id: "tsp", name: "Teaspoons (tsp)" },
  { id: "tbsp", name: "Tablespoons (tbsp)" },
  { id: "fl_oz", name: "Fluid Ounces (fl oz)" },
  { id: "cup", name: "Cups (cup)" },
  { id: "pt", name: "Pints (pt)" },
  { id: "qt", name: "Quarts (qt)" },
  { id: "gal", name: "Gallons (gal)" },
];

// Data units
export const dataUnits = [
  { id: "b", name: "Bytes (B)" },
  { id: "kb", name: "Kilobytes (KB)" },
  { id: "mb", name: "Megabytes (MB)" },
  { id: "gb", name: "Gigabytes (GB)" },
  { id: "tb", name: "Terabytes (TB)" },
  { id: "pb", name: "Petabytes (PB)" },
  { id: "bit", name: "Bits (bit)" },
  { id: "kbit", name: "Kilobits (Kbit)" },
  { id: "mbit", name: "Megabits (Mbit)" },
  { id: "gbit", name: "Gigabits (Gbit)" },
];

// Speed units
export const speedUnits = [
  { id: "mps", name: "Meters per Second (m/s)" },
  { id: "kph", name: "Kilometers per Hour (km/h)" },
  { id: "mph", name: "Miles per Hour (mph)" },
  { id: "fps", name: "Feet per Second (ft/s)" },
  { id: "knot", name: "Knots (kn)" },
];

// Get units by category
export const getUnitsByCategory = (category: string) => {
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
