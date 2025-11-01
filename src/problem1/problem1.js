var sum_to_n_a = function (n) {
  // Approach 1: Mathematical formula
  // Time: O(1), Space: O(1)
  // Handles both positive and negative integers
  // For n > 0: sum = 1 + 2 + ... + n = n(n+1)/2
  // For n <= 0: calculate n(n+1)/2, negate it, then add 1

  // Example if n is negative:
  // n = -3
  // so it is the sum of 1 to -3
  // which is 1 + 0 + (-1) + (-2) + (-3) = -5

  if (n > 0) {
    return (n * (n + 1)) / 2;
  } else {
    return 1 - (Math.abs(n) * (Math.abs(n) + 1)) / 2;
  }
};

var sum_to_n_b = function (n) {
  // Approach 2: Recursive approach
  // Time: O(n), Space: O(n) due to call stack
  // Demonstrates recursive thinking, but limited by stack size
  // Handles both positive and negative integers

  if (n > 10000 || n < -10000) {
    throw new Error('N too large for recursive approach! Use sum_to_n_a instead.');
  }

  // Base case for positive numbers
  if (n === 1) return 1;

  // Base case: when we reach 0, the sum from 1 to 0 includes 1 and 0
  // Sequence: 1, 0, so sum = 1
  if (n === 0) return 1;

  // Recursive case
  if (n > 1) {
    return n + sum_to_n_b(n - 1);
  } else {
    return n + sum_to_n_b(n + 1);
  }
};

var sum_to_n_c = function (n) {
  // Approach 3: Iterative loop (for demonstration only)
  // Time: O(n), Space: O(1)
  // Not practical for large n, but useful for understanding the concept
  // Handles both positive and negative integers

  if (Math.abs(n) > 10000000) {
    throw new Error('N too large for iterative approach! Use sum_to_n_a or sum_to_n_b instead.');
  }

  if (n > 0) {
    // Positive: sum from 1 to n
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  } else {
    // Negative or zero: sum 1 + 0 + (-1) + (-2) + ... + n
    // Sequence: 1, 0, -1, -2, ..., n
    let sum = 1; // Start with 1
    sum += 0; // Add 0
    // Then add all numbers from -1 down to n
    for (let i = -1; i >= n; i--) {
      sum += i;
    }
    return sum;
  }
};
