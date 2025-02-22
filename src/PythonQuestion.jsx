function PythonQuestion(number) {
  const pythonQuestions = {
    easy: [1, 2, 3, 4, 13, 14, 16, 17, 21, 26, 28],
    medium: [5, 6, 7, 8, 9, 10, 12, 15, 18, 19, 20, 22, 23, 24, 25, 27, 29],
    hard: [11],
    1: {
      code: "def get_sum_of_list(lst):\n    total = 0\n    # Your code here\n    return total",
      question:
        "Complete the function to return the sum of all numbers in the input list.",
      editableLines: [2],
      testCases: [
        { input: [[1, 2, 3, 4, 5]], output: 15 },
        { input: [[-1, -2, 5, 8]], output: 10 },
        { input: [[]], output: 0 },
      ],
      functionName: "get_sum_of_list",
      tags: ["loops", "list manipulation", "basic arithmetic"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    2: {
      code: "def find_max(lst):\n    if not lst:\n        return None\n    maximum = lst[0]\n    # Your code here\n    return maximum",
      question:
        "Complete the function to find the maximum value in the list without using built-in max() function.",
      editableLines: [4],
      testCases: [
        { input: [[1, 5, 2, 8, 3]], output: 8 },
        { input: [[-10, -5, -2, -1]], output: -1 },
        { input: [[42]], output: 42 },
      ],
      functionName: "find_max",
      tags: ["loops", "list manipulation", "comparison"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    3: {
      code: 'def is_palindrome(s):\n    # Remove non-alphanumeric characters and convert to lowercase\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    # Your code here\n    return True',
      question:
        "Complete the function to check if the input string is a palindrome (reads the same forwards and backwards). The function should ignore spaces, punctuation, and case.",
      editableLines: [3],
      testCases: [
        { input: ["A man, a plan, a canal: Panama"], output: "True" },
        { input: ["race a car"], output: "False" },
        { input: ["Was it a car or a cat I saw?"], output: "True" },
      ],
      functionName: "is_palindrome",
      tags: ["strings", "comparison"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    4: {
      code: 'def count_vowels(text):\n    vowels = "aeiouAEIOU"\n    count = 0\n    # Your code here\n    return count',
      question:
        "Complete the function to count the number of vowels in the input string.",
      editableLines: [3],
      testCases: [
        { input: ["Hello World"], output: 3 },
        { input: ["Python Programming"], output: 4 },
        { input: ["aEiOu"], output: 5 },
      ],
      functionName: "count_vowels",
      tags: ["strings", "loops", "counting"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    5: {
      code: "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    sequence = [0, 1]\n    # Your code here\n    return sequence",
      question:
        "Complete the function to generate a Fibonacci sequence of length n.",
      editableLines: [6],
      testCases: [
        { input: [5], output: [0, 1, 1, 2, 3] },
        { input: [8], output: [0, 1, 1, 2, 3, 5, 8, 13] },
        { input: [2], output: [0, 1] },
      ],
      functionName: "fibonacci",
      tags: ["loops", "list manipulation", "mathematics"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    6: {
      code: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    # Your code here\n    # Your code here\n    # Your code here\n    return -1",
      question:
        "Complete the function to implement binary search. Return the index of the target if found, otherwise return -1.",
      editableLines: [2, 3, 4],
      testCases: [
        { input: [[1, 2, 3, 4, 5], 3], output: 2 },
        { input: [[1, 3, 5, 7, 9], 8], output: -1 },
        { input: [[1], 1], output: 0 },
      ],
      functionName: "binary_search",
      tags: ["binary search", "arrays", "algorithms"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    7: {
      code: "def merge_sorted_arrays(arr1, arr2):\n    result = []\n    i = j = 0\n    # Your code here\n    # Your code here\n    # Your code here\n    return result",
      question:
        "Complete the function to merge two sorted arrays into a single sorted array.",
      editableLines: [3, 4, 5],
      testCases: [
        {
          input: [
            [1, 3, 5],
            [2, 4, 6],
          ],
          output: [1, 2, 3, 4, 5, 6],
        },
        { input: [[1, 2, 3], []], output: [1, 2, 3] },
        { input: [[], [1, 2, 3]], output: [1, 2, 3] },
      ],
      functionName: "merge_sorted_arrays",
      tags: ["arrays", "two pointers", "sorting"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    8: {
      code: "def rotate_array(nums, k):\n    n = len(nums)\n    k = k % n\n    # Your code here\n    # Your code here\n    return nums",
      question:
        "Complete the function to rotate the array to the right by k steps.",
      editableLines: [3, 4],
      testCases: [
        { input: [[1, 2, 3, 4, 5, 6, 7], 3], output: [5, 6, 7, 1, 2, 3, 4] },
        { input: [[-1, -100, 3, 99], 2], output: [3, 99, -1, -100] },
        { input: [[1], 0], output: [1] },
      ],
      functionName: "rotate_array",
      tags: ["arrays", "mathematics"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    9: {
      code: 'def valid_parentheses(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    # Your code here\n    # Your code here\n    return len(stack) == 0',
      question:
        "Complete the function to determine if the input string has valid parentheses.",
      editableLines: [3, 4],
      testCases: [
        { input: ["()"], output: "True" },
        { input: ["()[]{}"], output: "True" },
        { input: ["(]"], output: "False" },
      ],
      functionName: "valid_parentheses",
      tags: ["strings", "stack", "validation"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    10: {
      code: "def pascal_triangle(n):\n    if n <= 0:\n        return []\n    triangle = [[1]]\n    # Your code here\n    # Your code here\n    # Your code here\n    return triangle",
      question:
        "Complete the function to generate Pascal's triangle up to n rows.",
      editableLines: [4, 5, 6],
      testCases: [
        { input: [3], output: [[1], [1, 1], [1, 2, 1]] },
        { input: [1], output: [[1]] },
        {
          input: [5],
          output: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]],
        },
      ],
      functionName: "pascal_triangle",
      tags: ["arrays", "dynamic programming", "mathematics"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    11: {
      code: "def count_islands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def flood_fill(i, j):\n        # Your code here\n        # Your code here\n        # Your code here\n    # Your code here\n    return count",
      question:
        "Complete the function to count the number of islands in a binary grid. An island is surrounded by water (0) and formed by connecting adjacent lands (1) horizontally or vertically.",
      editableLines: [6, 7, 8, 9],
      testCases: [
        {
          input: [
            [
              [1, 1, 0],
              [1, 0, 0],
              [0, 0, 1],
            ],
          ],
          output: 2,
        },
        {
          input: [
            [
              [1, 1, 1],
              [1, 1, 1],
              [1, 1, 1],
            ],
          ],
          output: 1,
        },
        {
          input: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          output: 0,
        },
      ],
      functionName: "count_islands",
      tags: ["depth-first search", "matrix", "recursion"],
      difficulty: "hard",
      questionType: "fill in the blank",
    },
    12: {
      code: "def reverse_linked_list(head):\n    prev = None\n    current = head\n    # Your code here\n    # Your code here\n    return prev",
      question:
        "Complete the function to reverse a singly linked list iteratively.",
      editableLines: [3, 4],
      testCases: [
        { input: [[1, 2, 3, 4, 5]], output: [5, 4, 3, 2, 1] },
        { input: [[1, 2]], output: [2, 1] },
        { input: [[]], output: [] },
      ],
      functionName: "reverse_linked_list",
      tags: ["linked list", "pointers"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    13: {
      code: "def find_first_unique(s):\n    char_count = {}\n    # Your code here\n    # Your code here\n    # Your code here\n    return -1",
      question:
        "Complete the function to find the index of the first non-repeating character in the string. Return -1 if no unique character exists.",
      editableLines: [2, 3, 4],
      testCases: [
        { input: ["leetcode"], output: 0 },
        { input: ["loveleetcode"], output: 2 },
        { input: ["aabb"], output: -1 },
      ],
      functionName: "find_first_unique",
      tags: ["strings", "hash tables"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    14: {
      code: "def missing_number(nums):\n    n = len(nums)\n    expected_sum = (n * (n + 1)) // 2\n    # Your code here\n    return expected_sum - actual_sum",
      question:
        "Complete the function to find the missing number in a sequence from 0 to n.",
      editableLines: [3],
      testCases: [
        { input: [[3, 0, 1]], output: 2 },
        { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], output: 8 },
        { input: [[0]], output: 1 },
      ],
      functionName: "missing_number",
      tags: ["arrays", "mathematics"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    15: {
      code: "def climb_stairs(n):\n    if n <= 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    dp[2] = 2\n    # Your code here\n    return dp[n]",
      question:
        "Complete the function to count the number of ways to climb n stairs, taking either 1 or 2 steps at a time.",
      editableLines: [6],
      testCases: [
        { input: [3], output: 3 },
        { input: [4], output: 5 },
        { input: [5], output: 8 },
      ],
      functionName: "climb_stairs",
      tags: ["dynamic programming"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    16: {
      code: "def bubble_sort(arr):\n    n = len(arr)\n    # Your code here\n    # Your code here\n    # Your code here\n    return arr",
      question: "Complete the function to implement bubble sort algorithm.",
      editableLines: [2, 3, 4],
      testCases: [
        {
          input: [[64, 34, 25, 12, 22, 11, 90]],
          output: [11, 12, 22, 25, 34, 64, 90],
        },
        { input: [[5, 2, 3, 1]], output: [1, 2, 3, 5] },
        { input: [[1]], output: [1] },
      ],
      functionName: "bubble_sort",
      tags: ["sorting", "arrays"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    17: {
      code: 'def longest_common_prefix(strs):\n    if not strs:\n        return ""\n    shortest = min(strs, key=len)\n    # Your code here\n    # Your code here\n    # Your code here\n    return shortest[:i]',
      question:
        "Complete the function to find the longest common prefix string amongst an array of strings.",
      editableLines: [4, 5, 6],
      testCases: [
        { input: [["flower", "flow", "flight"]], output: "fl" },
        { input: [["dog", "racecar", "car"]], output: "" },
        { input: [["", "b"]], output: "" },
      ],
      functionName: "longest_common_prefix",
      tags: ["strings"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    18: {
      code: "def power(x, n):\n    if n == 0:\n        return 1\n    # Your code here\n    # Your code here\n    # Your code here\n    return result",
      question:
        "Complete the function to implement power(x, n) which calculates x raised to the power n without using built-in power functions.",
      editableLines: [3, 4, 5],
      testCases: [
        { input: [2, 3], output: 8 },
        { input: [2, -2], output: 0.25 },
        { input: [5, 0], output: 1 },
      ],
      functionName: "power",
      tags: ["mathematics", "recursion"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    19: {
      code: "def rotate_matrix(matrix):\n    n = len(matrix)\n    # First transpose the matrix\n    for i in range(n):\n        for j in range(i, n):\n            # Your code here\n    # Then reverse each row\n    for i in range(n):\n        # Your code here\n    return matrix",
      question:
        "Complete the function to rotate the matrix 90 degrees clockwise in-place.",
      editableLines: [5, 8],
      testCases: [
        {
          input: [
            [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
            ],
          ],
          output: "[[7,4,1],[8,5,2],[9,6,3]]",
        },
        { input: [[[1]]], output: "[[1]]" },
        {
          input: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
          output: "[[3,1],[4,2]]",
        },
      ],
      functionName: "rotate_matrix",
      tags: ["matrix", "arrays"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    20: {
      code: 'def validate_bst(root):\n    def is_valid(node, min_val, max_val):\n        if not node:\n            return True\n        # Your code here\n        # Your code here\n        # Your code here\n    return is_valid(root, float("-inf"), float("inf"))',
      question:
        "Complete the helper function to validate if a binary tree is a valid binary search tree (BST).",
      editableLines: [4, 5, 6],
      testCases: [
        { input: [[2, 1, 3]], output: "True" },
        { input: [[5, 1, 4, null, null, 3, 6]], output: "False" },
        { input: [[1]], output: "True" },
      ],
      functionName: "validate_bst",
      tags: ["binary trees", "recursion"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    21: {
      code: "def is_anagram(s1, s2):\n    if len(s1) != len(s2):\n        return False\n    char_count = {}\n    # Your code here\n    # Your code here\n    return True",
      question:
        "Complete the function to determine if two strings are anagrams of each other.",
      editableLines: [4, 5],
      testCases: [
        { input: ["listen", "silent"], output: "True" },
        { input: ["hello", "world"], output: "False" },
        { input: ["", ""], output: "True" },
      ],
      functionName: "is_anagram",
      tags: ["strings", "hash tables"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    22: {
      code: "def kadane_max_sum(arr):\n    if not arr:\n        return 0\n    current_sum = max_sum = arr[0]\n    # Your code here\n    # Your code here\n    return max_sum",
      question:
        "Complete the function to find the maximum sum of a contiguous subarray within the array (Kadane's algorithm).",
      editableLines: [4, 5],
      testCases: [
        { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], output: 6 },
        { input: [[1]], output: 1 },
        { input: [[-1]], output: -1 },
      ],
      functionName: "kadane_max_sum",
      tags: ["arrays", "dynamic programming"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    23: {
      code: "def group_anagrams(words):\n    anagram_groups = {}\n    # Your code here\n    # Your code here\n    # Your code here\n    return list(anagram_groups.values())",
      question:
        "Complete the function to group anagrams together from a list of words.",
      editableLines: [2, 3, 4],
      testCases: [
        {
          input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
          output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
        },
        { input: [[""]], output: [[""]] },
        { input: [["a"]], output: [["a"]] },
      ],
      functionName: "group_anagrams",
      tags: ["strings", "hash tables", "sorting"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    24: {
      code: "def jump_game(nums):\n    max_reach = 0\n    # Your code here\n    # Your code here\n    return max_reach >= len(nums) - 1",
      question:
        "Complete the function to determine if you can reach the last index of the array. Each element represents the maximum jump length at that position.",
      editableLines: [2, 3],
      testCases: [
        { input: [[2, 3, 1, 1, 4]], output: "True" },
        { input: [[3, 2, 1, 0, 4]], output: "False" },
        { input: [[0]], output: "True" },
      ],
      functionName: "jump_game",
      tags: ["arrays", "greedy"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    25: {
      code: "def longest_substring_without_repeats(s):\n    char_index = {}\n    max_length = start = 0\n    # Your code here\n    # Your code here\n    # Your code here\n    return max_length",
      question:
        "Complete the function to find the length of the longest substring without repeating characters.",
      editableLines: [3, 4, 5],
      testCases: [
        { input: ["abcabcbb"], output: 3 },
        { input: ["bbbbb"], output: 1 },
        { input: ["pwwkew"], output: 3 },
      ],
      functionName: "longest_substring_without_repeats",
      tags: ["strings", "sliding window", "hash tables"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    26: {
      code: "def selection_sort(arr):\n    n = len(arr)\n    # Your code here\n    # Your code here\n    # Your code here\n    return arr",
      question:
        "Complete the function to implement the selection sort algorithm.",
      editableLines: [2, 3, 4],
      testCases: [
        { input: [[64, 25, 12, 22, 11]], output: [11, 12, 22, 25, 64] },
        { input: [[5, 2, 3, 1]], output: [1, 2, 3, 5] },
        { input: [[1]], output: [1] },
      ],
      functionName: "selection_sort",
      tags: ["sorting", "arrays"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    27: {
      code: "def matrix_spiral_order(matrix):\n    if not matrix:\n        return []\n    result = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    # Your code here\n    # Your code here\n    # Your code here\n    return result",
      question:
        "Complete the function to return all elements of the matrix in spiral order.",
      editableLines: [6, 7, 8],
      testCases: [
        {
          input: [
            [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
            ],
          ],
          output: [1, 2, 3, 6, 9, 8, 7, 4, 5],
        },
        {
          input: [
            [
              [1, 2, 3, 4],
              [5, 6, 7, 8],
              [9, 10, 11, 12],
            ],
          ],
          output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
        },
        { input: [[[1]]], output: [1] },
      ],
      functionName: "matrix_spiral_order",
      tags: ["matrix", "arrays"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
    28: {
      code: "def insertion_sort(arr):\n    # Your code here\n    # Your code here\n    # Your code here\n    return arr",
      question:
        "Complete the function to implement the insertion sort algorithm.",
      editableLines: [1, 2, 3],
      testCases: [
        { input: [[12, 11, 13, 5, 6]], output: [5, 6, 11, 12, 13] },
        { input: [[4, 3, 2, 1]], output: [1, 2, 3, 4] },
        { input: [[1]], output: [1] },
      ],
      functionName: "insertion_sort",
      tags: ["sorting", "arrays"],
      difficulty: "easy",
      questionType: "fill in the blank",
    },
    29: {
      code: "def valid_sudoku(board):\n    rows = [set() for _ in range(9)]\n    cols = [set() for _ in range(9)]\n    boxes = [set() for _ in range(9)]\n    # Your code here\n    return True",
      question:
        "Complete the function to determine if a 9x9 Sudoku board is valid. Each row, column, and 3x3 box should contain digits 1-9 without repetition.",
      editableLines: [4],
      testCases: [
        {
          input: [
            [
              ["5", "3", ".", ".", "7", ".", ".", ".", "."],
              ["6", ".", ".", "1", "9", "5", ".", ".", "."],
              [".", "9", "8", ".", ".", ".", ".", "6", "."],
              ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
              ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
              ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
              [".", "6", ".", ".", ".", ".", "2", "8", "."],
              [".", ".", ".", "4", "1", "9", ".", ".", "5"],
              [".", ".", ".", ".", "8", ".", ".", "7", "9"],
            ],
          ],
          output: true,
        },
        {
          input: [
            [
              ["8", "3", ".", ".", "7", ".", ".", ".", "."],
              ["6", ".", ".", "1", "9", "5", ".", ".", "."],
              [".", "9", "8", ".", ".", ".", ".", "6", "."],
              ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
              ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
              ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
              [".", "6", ".", ".", ".", ".", "2", "8", "."],
              [".", ".", ".", "4", "1", "9", ".", ".", "5"],
              [".", ".", ".", ".", "8", ".", ".", "7", "9"],
            ],
          ],
          output: false,
        },
        {
          input: [
            [
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
              [".", ".", ".", ".", ".", ".", ".", ".", "."],
            ],
          ],
          output: true,
        },
      ],
      functionName: "valid_sudoku",
      tags: ["matrix", "hash tables", "validation"],
      difficulty: "medium",
      questionType: "fill in the blank",
    },
  };

  const selectedQuestion = pythonQuestions[number];
  if (!selectedQuestion) {
    throw new Error(`Question ${number} not found`);
  }

  return selectedQuestion;
}

export default PythonQuestion;
