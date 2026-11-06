// All conversion factors are relative to a chosen BASE unit per category.
// value_in_base = value * factor
// Temperature is handled separately in utils/converter.js (not linear from 0).

export const categories = {
  length: {
    label: "Length",
    icon: "📏",
    baseUnit: "meter",
    units: {
      millimeter: { label: "Millimeter", symbol: "mm", factor: 0.001 },
      centimeter: { label: "Centimeter", symbol: "cm", factor: 0.01 },
      meter: { label: "Meter", symbol: "m", factor: 1 },
      kilometer: { label: "Kilometer", symbol: "km", factor: 1000 },
      inch: { label: "Inch", symbol: "in", factor: 0.0254 },
      foot: { label: "Foot", symbol: "ft", factor: 0.3048 },
      yard: { label: "Yard", symbol: "yd", factor: 0.9144 },
      mile: { label: "Mile", symbol: "mi", factor: 1609.34 },
    },
  },
  weight: {
    label: "Weight / Mass",
    icon: "⚖️",
    baseUnit: "gram",
    units: {
      milligram: { label: "Milligram", symbol: "mg", factor: 0.001 },
      gram: { label: "Gram", symbol: "g", factor: 1 },
      kilogram: { label: "Kilogram", symbol: "kg", factor: 1000 },
      tonne: { label: "Tonne", symbol: "t", factor: 1000000 },
      ounce: { label: "Ounce", symbol: "oz", factor: 28.3495 },
      pound: { label: "Pound", symbol: "lb", factor: 453.592 },
    },
  },
  temperature: {
    label: "Temperature",
    icon: "🌡️",
    baseUnit: "celsius",
    isTemperature: true,
    units: {
      celsius: { label: "Celsius", symbol: "°C" },
      fahrenheit: { label: "Fahrenheit", symbol: "°F" },
      kelvin: { label: "Kelvin", symbol: "K" },
    },
  },
  area: {
    label: "Area",
    icon: "▦",
    baseUnit: "sqMeter",
    units: {
      sqMillimeter: { label: "Square Millimeter", symbol: "mm²", factor: 0.000001 },
      sqCentimeter: { label: "Square Centimeter", symbol: "cm²", factor: 0.0001 },
      sqMeter: { label: "Square Meter", symbol: "m²", factor: 1 },
      sqKilometer: { label: "Square Kilometer", symbol: "km²", factor: 1000000 },
      sqInch: { label: "Square Inch", symbol: "in²", factor: 0.00064516 },
      sqFoot: { label: "Square Foot", symbol: "ft²", factor: 0.092903 },
      sqYard: { label: "Square Yard", symbol: "yd²", factor: 0.836127 },
      acre: { label: "Acre", symbol: "ac", factor: 4046.86 },
      hectare: { label: "Hectare", symbol: "ha", factor: 10000 },
    },
  },
  volume: {
    label: "Volume",
    icon: "🧪",
    baseUnit: "liter",
    units: {
      milliliter: { label: "Milliliter", symbol: "mL", factor: 0.001 },
      liter: { label: "Liter", symbol: "L", factor: 1 },
      cubicMeter: { label: "Cubic Meter", symbol: "m³", factor: 1000 },
      cubicCentimeter: { label: "Cubic Centimeter", symbol: "cm³", factor: 0.001 },
      gallon: { label: "Gallon", symbol: "gal", factor: 3.78541 },
      quart: { label: "Quart", symbol: "qt", factor: 0.946353 },
      pint: { label: "Pint", symbol: "pt", factor: 0.473176 },
      cup: { label: "Cup", symbol: "cup", factor: 0.24 },
    },
  },
  time: {
    label: "Time",
    icon: "⏱️",
    baseUnit: "second",
    units: {
      millisecond: { label: "Millisecond", symbol: "ms", factor: 0.001 },
      second: { label: "Second", symbol: "s", factor: 1 },
      minute: { label: "Minute", symbol: "min", factor: 60 },
      hour: { label: "Hour", symbol: "hr", factor: 3600 },
      day: { label: "Day", symbol: "day", factor: 86400 },
      week: { label: "Week", symbol: "wk", factor: 604800 },
      month: { label: "Month", symbol: "mo", factor: 2629800 }, // 30.4375 days avg
      year: { label: "Year", symbol: "yr", factor: 31557600 }, // 365.25 days
    },
  },
  speed: {
    label: "Speed",
    icon: "🚀",
    baseUnit: "mps",
    units: {
      mps: { label: "Meter/second", symbol: "m/s", factor: 1 },
      kmph: { label: "Kilometer/hour", symbol: "km/h", factor: 0.277778 },
      mph: { label: "Mile/hour", symbol: "mph", factor: 0.44704 },
      fps: { label: "Foot/second", symbol: "ft/s", factor: 0.3048 },
      knot: { label: "Knot", symbol: "kn", factor: 0.514444 },
    },
  },
  data: {
    label: "Data Storage",
    icon: "💾",
    baseUnit: "byte",
    units: {
      bit: { label: "Bit", symbol: "b", factor: 0.125 },
      byte: { label: "Byte", symbol: "B", factor: 1 },
      kilobyte: { label: "Kilobyte", symbol: "KB", factor: 1000 },
      megabyte: { label: "Megabyte", symbol: "MB", factor: 1000 ** 2 },
      gigabyte: { label: "Gigabyte", symbol: "GB", factor: 1000 ** 3 },
      terabyte: { label: "Terabyte", symbol: "TB", factor: 1000 ** 4 },
      petabyte: { label: "Petabyte", symbol: "PB", factor: 1000 ** 5 },
      kibibyte: { label: "Kibibyte", symbol: "KiB", factor: 1024 },
      mebibyte: { label: "Mebibyte", symbol: "MiB", factor: 1024 ** 2 },
      gibibyte: { label: "Gibibyte", symbol: "GiB", factor: 1024 ** 3 },
      tebibyte: { label: "Tebibyte", symbol: "TiB", factor: 1024 ** 4 },
    },
  },
  pressure: {
    label: "Pressure",
    icon: "🎈",
    baseUnit: "pascal",
    units: {
      pascal: { label: "Pascal", symbol: "Pa", factor: 1 },
      kilopascal: { label: "Kilopascal", symbol: "kPa", factor: 1000 },
      bar: { label: "Bar", symbol: "bar", factor: 100000 },
      psi: { label: "PSI", symbol: "psi", factor: 6894.76 },
      atmosphere: { label: "Atmosphere", symbol: "atm", factor: 101325 },
      torr: { label: "Torr", symbol: "Torr", factor: 133.322 },
    },
  },
  energy: {
    label: "Energy",
    icon: "🔋",
    baseUnit: "joule",
    units: {
      joule: { label: "Joule", symbol: "J", factor: 1 },
      kilojoule: { label: "Kilojoule", symbol: "kJ", factor: 1000 },
      calorie: { label: "Calorie", symbol: "cal", factor: 4.184 },
      kilocalorie: { label: "Kilocalorie", symbol: "kcal", factor: 4184 },
      wattHour: { label: "Watt-hour", symbol: "Wh", factor: 3600 },
      kilowattHour: { label: "Kilowatt-hour", symbol: "kWh", factor: 3600000 },
    },
  },
  power: {
    label: "Power",
    icon: "⚡",
    baseUnit: "watt",
    units: {
      watt: { label: "Watt", symbol: "W", factor: 1 },
      kilowatt: { label: "Kilowatt", symbol: "kW", factor: 1000 },
      megawatt: { label: "Megawatt", symbol: "MW", factor: 1000000 },
      horsepower: { label: "Horsepower", symbol: "hp", factor: 745.7 },
    },
  },
  angle: {
    label: "Angle",
    icon: "📐",
    baseUnit: "degree",
    units: {
      degree: { label: "Degree", symbol: "°", factor: 1 },
      radian: { label: "Radian", symbol: "rad", factor: 57.29578 },
      gradian: { label: "Gradian", symbol: "grad", factor: 0.9 },
      arcminute: { label: "Arcminute", symbol: "'", factor: 0.0166667 },
      arcsecond: { label: "Arcsecond", symbol: '"', factor: 0.000277778 },
    },
  },
};

export const quickConversions = [
  { category: "length", from: "kilometer", to: "mile", value: 1, label: "1 km = 0.621371 mi" },
  { category: "weight", from: "kilogram", to: "pound", value: 1, label: "1 kg = 2.20462 lb" },
  { category: "time", from: "hour", to: "minute", value: 1, label: "1 hour = 60 minutes" },
  { category: "volume", from: "liter", to: "milliliter", value: 1, label: "1 liter = 1000 milliliters" },
  { category: "temperature", from: "celsius", to: "fahrenheit", value: 0, label: "0 °C = 32 °F" },
];

export const defaultFavorites = [
  { category: "length", from: "kilometer", to: "mile" },
  { category: "temperature", from: "celsius", to: "fahrenheit" },
  { category: "weight", from: "kilogram", to: "pound" },
];

// Flat list of every unit for global search
export function getAllUnitsFlat() {
  const list = [];
  Object.entries(categories).forEach(([catKey, cat]) => {
    Object.entries(cat.units).forEach(([unitKey, unit]) => {
      list.push({
        categoryKey: catKey,
        categoryLabel: cat.label,
        unitKey,
        label: unit.label,
        symbol: unit.symbol,
      });
    });
  });
  return list;
}
