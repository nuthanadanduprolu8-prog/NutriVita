/**
 * NutriVita Date & Age Calculation Utilities
 * 
 * Safely parses and calculates age from 'YYYY-MM-DD' date of birth strings.
 * Uses integer calendar year/month/day comparisons to completely avoid
 * timezone drift, DST variations, and off-by-one calendar bugs.
 */

/**
 * Calculates current age from a 'YYYY-MM-DD' date string.
 *
 * @param {string} dobString - Date of birth in 'YYYY-MM-DD' format
 * @param {Date} [referenceDate=new Date()] - Reference date (defaults to current local date)
 * @returns {{ age: number|null, error: string|null }}
 */
export const calculateAgeFromDob = (dobString, referenceDate = new Date()) => {
  if (!dobString || typeof dobString !== 'string') {
    return { age: null, error: null };
  }

  const trimmed = dobString.trim();
  if (!trimmed) {
    return { age: null, error: null };
  }

  // Parse YYYY-MM-DD format from <input type="date">
  const parts = trimmed.split('-');
  if (parts.length !== 3) {
    return { age: null, error: 'Invalid date format (expected YYYY-MM-DD).' };
  }

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10); // 1-12
  const birthDay = parseInt(parts[2], 10);   // 1-31

  if (
    isNaN(birthYear) ||
    isNaN(birthMonth) ||
    isNaN(birthDay) ||
    birthYear < 1900 ||
    birthMonth < 1 ||
    birthMonth > 12 ||
    birthDay < 1 ||
    birthDay > 31
  ) {
    return { age: null, error: 'Please enter a valid date of birth.' };
  }

  // Verify days in the specified month (accounting for leap years)
  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
  if (birthDay > daysInMonth) {
    return { age: null, error: 'Invalid day for the selected month.' };
  }

  const now = referenceDate instanceof Date ? referenceDate : new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  // Future date check
  if (
    birthYear > currentYear ||
    (birthYear === currentYear && birthMonth > currentMonth) ||
    (birthYear === currentYear && birthMonth === currentMonth && birthDay > currentDay)
  ) {
    return { age: null, error: 'Date of birth cannot be in the future.' };
  }

  let age = currentYear - birthYear;

  // Has the birthday occurred this year?
  // If current month is before birth month, or same month but current day is before birth day:
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }

  if (age < 0) {
    return { age: null, error: 'Date of birth cannot be in the future.' };
  }

  if (age > 120) {
    return { age: null, error: 'Age exceeds the maximum supported limit (120 years).' };
  }

  return { age, error: null };
};

/**
 * Returns today's date formatted as 'YYYY-MM-DD' in local time for max attribute on HTML date pickers.
 *
 * @param {Date} [refDate=new Date()]
 * @returns {string}
 */
export const getTodayDateString = (refDate = new Date()) => {
  const year = refDate.getFullYear();
  const month = String(refDate.getMonth() + 1).padStart(2, '0');
  const day = String(refDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
