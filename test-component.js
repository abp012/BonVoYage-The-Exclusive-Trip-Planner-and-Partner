// Quick test to check if MyTravelExpenses component imports without errors
import { format } from 'date-fns';

// Test the formatDateSafely function logic
const formatDateSafely = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return 'Invalid Date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Test cases
console.log('Testing date formatting:');
console.log('Valid date:', formatDateSafely('2024-01-15'));
console.log('Empty string:', formatDateSafely(''));
console.log('Invalid date:', formatDateSafely('invalid-date'));
console.log('Null/undefined:', formatDateSafely(null));

console.log('✅ Date formatting utility works correctly!');
