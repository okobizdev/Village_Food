/**
 * Ensures undefined or "undefined" string values are converted to null
 * @param {any} value - The value to check
 * @returns {any|null} The value or null
 */
const ensureNullIfUndefined = (value) => {
  if (
    value === "undefined" ||
    value === undefined ||
    value === "" ||
    value === "null" ||
    value === null
  ) {
    return null;
  }
  return value;
};

/**
 * Safely parse JSON string
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Remove empty values from object
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => !isEmpty(value))
  );
};

module.exports = {
  ensureNullIfUndefined,
  safeJsonParse,
  isEmpty,
  removeEmptyValues,
};
