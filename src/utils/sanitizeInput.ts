/**
 * Strips carriage return, newline, and other control characters from a string.
 * Prevents PostgreSQL JSON parse errors (e.g. 22P02) when sending user input
 * to Supabase.
 */
export function sanitizeInput(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Recursively applies sanitizeInput to all string values in an object.
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      result[key] = sanitizeInput(val);
    } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = sanitizeObject(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}
