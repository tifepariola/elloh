import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";
import * as countryCodesList from "country-codes-list";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, format: "short" | "long") {
  return moment(date).format(format === "short" ? "HH:mm" : "MMM D, YYYY, h:mm A");
}


export const countryCodes = Object.entries(countryCodesList.customList("countryCode", "{countryCallingCode}"))
    .map(([country, code]) => ({ country, code: code as string }));

/**
 * Splits a phone number into country code and local number
 * @param phoneNumber - The full phone number (e.g., "2348100908752")
 * @returns Object with countryCode and localNumber, or null if parsing fails
 */
export function splitPhoneNumber(phoneNumber: string): { countryCode: string; localNumber: string } | null {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return null;
  }

  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 7) {
    return null; // Too short to be a valid international number
  }

  // Try to match country codes from longest to shortest
  for (let i = 4; i >= 1; i--) {
    const potentialCode = cleanNumber.substring(0, i);
    if (countryCodes.map(c => c.code).includes(potentialCode)) {
      const localNumber = cleanNumber.substring(i);
      if (localNumber.length >= 7) { // Minimum local number length
        return {
          countryCode: potentialCode,
          localNumber: localNumber
        };
      }
    }
  }

  // If no country code found, assume it's a local number
  return {
    countryCode: '234',
    localNumber: cleanNumber
  };
}

/**
 * Formats a phone number for display
 * @param phoneNumber - The full phone number
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const split = splitPhoneNumber(phoneNumber);
  if (!split) return phoneNumber;
  
  if (split.countryCode) {
    return `+${split.countryCode}${split.localNumber}`;
  }
  return split.localNumber;
}