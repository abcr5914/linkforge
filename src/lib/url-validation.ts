/**
 * URL Validation Utility
 *
 * Validates that a given string is a properly formed HTTP or HTTPS URL.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Checks whether the input is a valid HTTP/HTTPS URL.
 * Returns a structured result with an error message if invalid.
 */
export function validateUrl(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: "URL cannot be empty." };
  }

  try {
    const url = new URL(input.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return { valid: false, error: "URL must use http or https protocol." };
    }

    // Ensure the hostname has at least one dot (e.g., "example.com")
    if (!url.hostname.includes(".")) {
      return { valid: false, error: "URL must have a valid domain name." };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }
}
