/**
 * NutriVita Backend Date & Age Calculation Utilities
 * 
 * Safely parses and calculates age from 'YYYY-MM-DD' date of birth strings.
 * Uses integer calendar year/month/day comparisons to completely avoid
 * timezone drift, DST variations, and off-by-one calendar bugs.
 */

export const calculateAgeFromDob = (dobString, referenceDate = new Date()) => {
  if (!dobString || typeof dobString !== 'string') {
    return { age: null, error: null };
  }

  const trimmed = dobString.trim();
  if (!trimmed) {
    return { age: null, error: null };
  }

  const parts = trimmed.split('-');
  if (parts.length !== 3) {
    return { age: null, error: 'Invalid date format (expected YYYY-MM-DD).' };
  }

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10);
  const birthDay = parseInt(parts[2], 10);

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

  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
  if (birthDay > daysInMonth) {
    return { age: null, error: 'Invalid day for the selected month.' };
  }

  const now = referenceDate instanceof Date ? referenceDate : new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (
    birthYear > currentYear ||
    (birthYear === currentYear && birthMonth > currentMonth) ||
    (birthYear === currentYear && birthMonth === currentMonth && birthDay > currentDay)
  ) {
    return { age: null, error: 'Date of birth cannot be in the future.' };
  }

  let age = currentYear - birthYear;
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

export const getTodayDateString = (refDate = new Date()) => {
  const year = refDate.getFullYear();
  const month = String(refDate.getMonth() + 1).padStart(2, '0');
  const day = String(refDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
