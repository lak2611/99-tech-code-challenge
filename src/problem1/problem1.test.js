// Test cases for sum_to_n functions
// Load the functions from problem1.js
const fs = require('fs');
const vm = require('vm');

// Read and execute problem1.js to get the functions in scope
const code = fs.readFileSync(__dirname + '/problem1.js', 'utf8');
const context = { console, require, module, exports, __dirname, __filename };
vm.createContext(context);
vm.runInContext(code, context);

// Extract the functions
const sum_to_n_a = context.sum_to_n_a;
const sum_to_n_b = context.sum_to_n_b;
const sum_to_n_c = context.sum_to_n_c;

// Test Case 1: Small positive number (n = 5)
// Expected: 1 + 2 + 3 + 4 + 5 = 15
console.log('Test 1: n = 5');
console.log('sum_to_n_a(5) =', sum_to_n_a(5), 'Expected: 15');
console.log('sum_to_n_b(5) =', sum_to_n_b(5), 'Expected: 15');
console.log('sum_to_n_c(5) =', sum_to_n_c(5), 'Expected: 15');
console.log('All match:', sum_to_n_a(5) === sum_to_n_b(5) && sum_to_n_b(5) === sum_to_n_c(5) && sum_to_n_a(5) === 15);
console.log('---');

// Test Case 2: Edge case - n = 1
// Expected: 1
console.log('Test 2: n = 1');
console.log('sum_to_n_a(1) =', sum_to_n_a(1), 'Expected: 1');
console.log('sum_to_n_b(1) =', sum_to_n_b(1), 'Expected: 1');
console.log('sum_to_n_c(1) =', sum_to_n_c(1), 'Expected: 1');
console.log('All match:', sum_to_n_a(1) === sum_to_n_b(1) && sum_to_n_b(1) === sum_to_n_c(1) && sum_to_n_a(1) === 1);
console.log('---');

// Test Case 3: Zero (n = 0)
// Expected: 1 (since sum from 1 to 0 includes 1 and 0)
console.log('Test 3: n = 0');
console.log('sum_to_n_a(0) =', sum_to_n_a(0), 'Expected: 1');
console.log('sum_to_n_b(0) =', sum_to_n_b(0), 'Expected: 1');
console.log('sum_to_n_c(0) =', sum_to_n_c(0), 'Expected: 1');
console.log('All match:', sum_to_n_a(0) === sum_to_n_b(0) && sum_to_n_b(0) === sum_to_n_c(0) && sum_to_n_a(0) === 1);
console.log('---');

// Test Case 4: Small negative number (n = -3)
// Formula: 1 - (-3 * (-3 + 1) / 2) = 1 - (-3 * -2 / 2) = 1 - 3 = -2
console.log('Test 4: n = -3');
const result4a = sum_to_n_a(-3);
const result4b = sum_to_n_b(-3);
const result4c = sum_to_n_c(-3);
console.log('sum_to_n_a(-3) =', result4a);
console.log('sum_to_n_b(-3) =', result4b);
console.log('sum_to_n_c(-3) =', result4c);
console.log('All match:', result4a === result4b && result4b === result4c);
console.log('---');

// Test Case 5: Another negative number (n = -4)
// Expected based on formula
console.log('Test 5: n = -4');
const result5a = sum_to_n_a(-4);
const result5b = sum_to_n_b(-4);
const result5c = sum_to_n_c(-4);
console.log('sum_to_n_a(-4) =', result5a);
console.log('sum_to_n_b(-4) =', result5b);
console.log('sum_to_n_c(-4) =', result5c);
console.log('All match:', result5a === result5b && result5b === result5c);
console.log('---');

// Test Case 6: Edge case - n = -1
// Expected: 1 + 0 + (-1) = 0
console.log('Test 6: n = -1');
const result6a = sum_to_n_a(-1);
const result6b = sum_to_n_b(-1);
const result6c = sum_to_n_c(-1);
console.log('sum_to_n_a(-1) =', result6a);
console.log('sum_to_n_b(-1) =', result6b);
console.log('sum_to_n_c(-1) =', result6c);
console.log('All match:', result6a === result6b && result6b === result6c);
console.log('---');

// Test Case 7: Large positive number (n = 100)
// Expected: 100 * 101 / 2 = 5050
console.log('Test 7: n = 100');
console.log('sum_to_n_a(100) =', sum_to_n_a(100), 'Expected: 5050');
console.log('sum_to_n_b(100) =', sum_to_n_b(100), 'Expected: 5050');
console.log('sum_to_n_c(100) =', sum_to_n_c(100), 'Expected: 5050');
console.log('All match:', sum_to_n_a(100) === sum_to_n_b(100) && sum_to_n_b(100) === sum_to_n_c(100) && sum_to_n_a(100) === 5050);
console.log('---');

// Test Case 8: Medium negative number (n = -10)
console.log('Test 8: n = -10');
const result8a = sum_to_n_a(-10);
const result8b = sum_to_n_b(-10);
const result8c = sum_to_n_c(-10);
console.log('sum_to_n_a(-10) =', result8a);
console.log('sum_to_n_b(-10) =', result8b);
console.log('sum_to_n_c(-10) =', result8c);
console.log('All match:', result8a === result8b && result8b === result8c);
console.log('---');

// Test Case 9: Very large number that should work with formula but fail with recursive
// n = 10001 (should throw error for recursive approach)
console.log('Test 9: n = 10001 (testing error handling for recursive)');
try {
  const result9a = sum_to_n_a(10001);
  console.log('sum_to_n_a(10001) =', result9a, '✓');

  try {
    const result9b = sum_to_n_b(10001);
    console.log('sum_to_n_b(10001) =', result9b, '✗ (should have thrown error)');
  } catch (e) {
    console.log('sum_to_n_b(10001) correctly threw error:', e.message);
  }

  const result9c = sum_to_n_c(10001);
  console.log('sum_to_n_c(10001) =', result9c, '✓');
} catch (e) {
  console.log('Unexpected error:', e.message);
}
console.log('---');

// Test Case 10: Negative number at recursive limit (n = -10001)
console.log('Test 10: n = -10001 (testing error handling for recursive)');
try {
  const result10a = sum_to_n_a(-10001);
  console.log('sum_to_n_a(-10001) =', result10a, '✓');

  try {
    const result10b = sum_to_n_b(-10001);
    console.log('sum_to_n_b(-10001) =', result10b, '✗ (should have thrown error)');
  } catch (e) {
    console.log('sum_to_n_b(-10001) correctly threw error:', e.message);
  }

  const result10c = sum_to_n_c(-10001);
  console.log('sum_to_n_c(-10001) =', result10c, '✓');
} catch (e) {
  console.log('Unexpected error:', e.message);
}
console.log('---');

console.log('\nAll test cases completed!');
