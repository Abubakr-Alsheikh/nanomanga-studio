import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a JSON object from a string that might be wrapped in markdown code blocks
 * or other text.
 * @param str The string to parse.
 * @returns The cleaned JSON string, or null if no valid JSON object is found.
 */
export function extractJson(str: string): string | null {
  const jsonRegex = /\{[\s\S]*\}/;
  const match = str.match(jsonRegex);

  if (match) {
    return match[0];
  }

  return null;
}
