import { categories } from "../data/units";

// Converts temperature values between celsius, fahrenheit, kelvin
function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;

  // Convert source -> Celsius first
  let celsius;
  switch (fromUnit) {
    case "celsius":
      celsius = value;
      break;
    case "fahrenheit":
      celsius = ((value - 32) * 5) / 9;
      break;
    case "kelvin":
      celsius = value - 273.15;
      break;
    default:
      return null;
  }

  // Convert Celsius -> target
  switch (toUnit) {
    case "celsius":
      return celsius;
    case "fahrenheit":
      return (celsius * 9) / 5 + 32;
    case "kelvin":
      return celsius + 273.15;
    default:
      return null;
  }
}

/**
 * Converts a value from one unit to another within a category.
 * Returns a number, or null if the conversion is not possible.
 */
export function convert(categoryKey, fromUnit, toUnit, value) {
  const category = categories[categoryKey];
  if (!category) return null;
  if (value === "" || value === null || value === undefined) return null;

  const numericValue = typeof value === "number" ? value : parseFloat(value);
  if (Number.isNaN(numericValue)) return null;

  if (category.isTemperature) {
    return convertTemperature(numericValue, fromUnit, toUnit);
  }

  const from = category.units[fromUnit];
  const to = category.units[toUnit];
  if (!from || !to) return null;

  const baseValue = numericValue * from.factor;
  return baseValue / to.factor;
}

export function validateInput(rawValue, { allowNegative = true } = {}) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return { valid: false, error: null }; // empty is neutral, not an error yet
  }
  const num = Number(rawValue);
  if (Number.isNaN(num)) {
    return { valid: false, error: "Please enter a valid number." };
  }
  if (!allowNegative && num < 0) {
    return { valid: false, error: "Negative values aren't valid for this unit." };
  }
  if (!Number.isFinite(num)) {
    return { valid: false, error: "That number is too large to convert." };
  }
  return { valid: true, error: null };
}

// Units where negative values don't make physical sense
export const nonNegativeCategories = new Set([
  "length",
  "area",
  "volume",
  "data",
  "pressure",
  "energy",
  "power",
]);
