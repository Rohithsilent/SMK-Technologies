import type { CodeTestCase, SupportedLanguage } from "./codeRunner"

export type OaTier = "Service / Core IT" | "Product Engineering"

export interface OaProblem {
  id: string
  assessmentId: string
  title: string
  tier: OaTier
  companyStyle: string
  difficulty: "Easy" | "Medium" | "Hard"
  durationMinutes: number
  statement: string
  constraints: string[]
  optimalTime: string
  optimalSpace: string
  complexityNotes: string
  roadmapSlug: "python" | "dsa"
  roadmapStageId: string
  roadmapTopicLabel: string
  functionNames: Record<SupportedLanguage, string>
  starterCode: Record<SupportedLanguage, string>
  testCases: CodeTestCase[]
}

export const OA_PROBLEMS: OaProblem[] = [
  {
    id: "oa-two-sum",
    assessmentId: "oa-service-01",
    title: "Pair Sum Index Finder",
    tier: "Service / Core IT",
    companyStyle: "TCS NQT / Infosys SP Pattern",
    difficulty: "Easy",
    durationMinutes: 30,
    statement:
      "Given an unsorted array of integers `nums` and an integer `target`, return the indices `[i, j]` (`i < j`) of the two distinct elements that add up to `target`. Exactly one valid pair exists.",
    constraints: ["2 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "Target Complexity: O(N) time"],
    optimalTime: "O(N)",
    optimalSpace: "O(N)",
    complexityNotes:
      "A single linear scan with a hash table checks whether `target - num` has been seen before storing the current index, preventing self-pairing.",
    roadmapSlug: "python",
    roadmapStageId: "py-s3",
    roadmapTopicLabel: "Dictionaries & Sets (Hash Maps)",
    functionNames: {
      python: "two_sum",
      cpp: "twoSum",
      java: "twoSum",
      javascript: "twoSum",
    },
    starterCode: {
      python: `def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    need = target - num
    if need in seen:
      return [seen[need], i]
    seen[num] = i
  return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> seen;
  for (int i = 0; i < nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) {
      return {seen[need], i};
    }
    seen[nums[i]] = i;
  }
  return {};
}`,
      java: `public int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) {
      return new int[]{seen.get(need), i};
    }
    seen.put(nums[i], i);
  }
  return new int[]{};
}`,
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    },
    testCases: [
      { id: "ts-1", label: "Sample 1: [2, 7, 11, 15], target 9", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { id: "ts-2", label: "Sample 2: [3, 2, 4], target 6", args: [[3, 2, 4], 6], expected: [1, 2] },
      { id: "ts-3", label: "Hidden Edge: Duplicate values [3, 3], target 6", args: [[3, 3], 6], expected: [0, 1], hidden: true },
      { id: "ts-4", label: "Hidden Edge: Negatives [-5, 4, 9, -2], target 2", args: [[-5, 4, 9, -2], 2], expected: [1, 3], hidden: true },
      { id: "ts-5", label: "Hidden Edge: Zero sum [0, 4, 3, 0], target 0", args: [[0, 4, 3, 0], 0], expected: [0, 3], hidden: true },
    ],
  },
  {
    id: "oa-max-subarray",
    assessmentId: "oa-service-02",
    title: "Maximum Contiguous Subarray Profit",
    tier: "Service / Core IT",
    companyStyle: "Accenture / Cognizant GenC Pattern",
    difficulty: "Easy",
    durationMinutes: 30,
    statement:
      "Given an integer array `nums` representing daily net gains/losses (which may all be negative), find the contiguous non-empty subarray with the largest sum and return its sum.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target Complexity: O(N) time, O(1) space"],
    optimalTime: "O(N)",
    optimalSpace: "O(1)",
    complexityNotes:
      "Kadane's Algorithm decides at each index whether to extend the previous running subarray or start fresh at `nums[i]`.",
    roadmapSlug: "dsa",
    roadmapStageId: "dsa-s2",
    roadmapTopicLabel: "Prefix Sums & Kadane's Algorithm",
    functionNames: {
      python: "max_subarray",
      cpp: "maxSubArray",
      java: "maxSubArray",
      javascript: "maxSubArray",
    },
    starterCode: {
      python: `def max_subarray(nums):
  best = nums[0]
  curr = nums[0]
  for i in range(1, len(nums)):
    curr = max(nums[i], curr + nums[i])
    best = max(best, curr)
  return best`,
      cpp: `int maxSubArray(vector<int>& nums) {
  int best = nums[0];
  int curr = nums[0];
  for (int i = 1; i < nums.size(); i++) {
    curr = max(nums[i], curr + nums[i]);
    best = max(best, curr);
  }
  return best;
}`,
      java: `public int maxSubArray(int[] nums) {
  int best = nums[0];
  int curr = nums[0];
  for (int i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    best = Math.max(best, curr);
  }
  return best;
}`,
      javascript: `function maxSubArray(nums) {
  let best = nums[0];
  let curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    best = Math.max(best, curr);
  }
  return best;
}`,
    },
    testCases: [
      { id: "ms-1", label: "Sample 1: [-2, 1, -3, 4, -1, 2, 1, -5, 4]", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { id: "ms-2", label: "Sample 2: [5, 4, -1, 7, 8]", args: [[5, 4, -1, 7, 8]], expected: 23 },
      { id: "ms-3", label: "Hidden Edge: All negatives [-8, -3, -6, -2, -5]", args: [[-8, -3, -6, -2, -5]], expected: -2, hidden: true },
      { id: "ms-4", label: "Hidden Edge: Single element [-7]", args: [[-7]], expected: -7, hidden: true },
    ],
  },
  {
    id: "oa-subarray-sum-k",
    assessmentId: "oa-product-01",
    title: "Subarray Sum Equals K (With Negatives)",
    tier: "Product Engineering",
    companyStyle: "Amazon / Flipkart / Atlassian OA",
    difficulty: "Medium",
    durationMinutes: 45,
    statement:
      "Given an integer array `nums` (including negative values and zeros) and an integer `k`, return the total number of contiguous subarrays whose sum equals `k`.",
    constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "Target Complexity: O(N) time"],
    optimalTime: "O(N)",
    optimalSpace: "O(N)",
    complexityNotes:
      "Store prefix sum frequencies starting with `{0: 1}`. Whenever `prefix - k` appears in the map, add its frequency to the answer.",
    roadmapSlug: "dsa",
    roadmapStageId: "dsa-s3",
    roadmapTopicLabel: "Prefix Sum + HashMap Subarrays",
    functionNames: {
      python: "subarray_sum",
      cpp: "subarraySum",
      java: "subarraySum",
      javascript: "subarraySum",
    },
    starterCode: {
      python: `def subarray_sum(nums, k):
  freq = {0: 1}
  prefix = 0
  count = 0
  for num in nums:
    prefix += num
    count += freq.get(prefix - k, 0)
    freq[prefix] = freq.get(prefix, 0) + 1
  return count`,
      cpp: `int subarraySum(vector<int>& nums, int k) {
  unordered_map<int, int> freq;
  freq[0] = 1;
  int prefix = 0;
  int count = 0;
  for (int i = 0; i < nums.size(); i++) {
    prefix += nums[i];
    if (freq.count(prefix - k)) {
      count += freq[prefix - k];
    }
    freq[prefix] = freq[prefix] + 1;
  }
  return count;
}`,
      java: `public int subarraySum(int[] nums, int k) {
  Map<Integer, Integer> freq = new HashMap<>();
  freq.put(0, 1);
  int prefix = 0;
  int count = 0;
  for (int i = 0; i < nums.length; i++) {
    prefix += nums[i];
    count += freq.getOrDefault(prefix - k, 0);
    freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);
  }
  return count;
}`,
      javascript: `function subarraySum(nums, k) {
  const freq = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const num of nums) {
    prefix += num;
    count += freq.get(prefix - k) || 0;
    freq.set(prefix, (freq.get(prefix) || 0) + 1);
  }
  return count;
}`,
    },
    testCases: [
      { id: "sk-1", label: "Sample 1: [1, 1, 1], k = 2", args: [[1, 1, 1], 2], expected: 2 },
      { id: "sk-2", label: "Sample 2: [1, 2, 3], k = 3", args: [[1, 2, 3], 3], expected: 2 },
      { id: "sk-3", label: "Hidden Edge: Negatives [3, -1, 2, -2, 4], k = 2", args: [[3, -1, 2, -2, 4], 2], expected: 4, hidden: true },
      { id: "sk-4", label: "Hidden Edge: Zeros [0, 0, 0], k = 0", args: [[0, 0, 0], 0], expected: 6, hidden: true },
    ],
  },
  {
    id: "oa-longest-unique-substr",
    assessmentId: "oa-product-02",
    title: "Longest Substring Without Repeating Characters",
    tier: "Product Engineering",
    companyStyle: "Razorpay / Swiggy / Microsoft OA",
    difficulty: "Medium",
    durationMinutes: 45,
    statement:
      "Given a string `s`, return the length of the longest contiguous substring that contains no duplicate characters.",
    constraints: ["0 <= s.length <= 5 * 10^4", "ASCII characters", "Target Complexity: O(N) time"],
    optimalTime: "O(N)",
    optimalSpace: "O(min(N, Σ))",
    complexityNotes:
      "Maintain a variable sliding window tracking each character's last seen index; jump `left` directly past duplicates instead of restarting.",
    roadmapSlug: "dsa",
    roadmapStageId: "dsa-s2",
    roadmapTopicLabel: "Fixed & Variable Sliding Window",
    functionNames: {
      python: "longest_unique",
      cpp: "longestUnique",
      java: "longestUnique",
      javascript: "longestUnique",
    },
    starterCode: {
      python: `def longest_unique(s):
  last = {}
  left = 0
  best = 0
  for right, ch in enumerate(s):
    if ch in last and last[ch] >= left:
      left = last[ch] + 1
    last[ch] = right
    best = max(best, right - left + 1)
  return best`,
      cpp: `int longestUnique(string s) {
  unordered_map<char, int> lastSeen;
  int left = 0;
  int best = 0;
  for (int right = 0; right < s.size(); right++) {
    char ch = s[right];
    if (lastSeen.count(ch) && lastSeen[ch] >= left) {
      left = lastSeen[ch] + 1;
    }
    lastSeen[ch] = right;
    best = max(best, right - left + 1);
  }
  return best;
}`,
      java: `public int longestUnique(String s) {
  Map<Character, Integer> lastSeen = new HashMap<>();
  int left = 0;
  int best = 0;
  for (int right = 0; right < s.length(); right++) {
    char ch = s.charAt(right);
    if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.put(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      javascript: `function longestUnique(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    },
    testCases: [
      { id: "lu-1", label: 'Sample 1: "abcabcbb"', args: ["abcabcbb"], expected: 3 },
      { id: "lu-2", label: 'Sample 2: "pwwkew"', args: ["pwwkew"], expected: 3 },
      { id: "lu-3", label: 'Hidden Edge: Empty string ""', args: [""], expected: 0, hidden: true },
      { id: "lu-4", label: 'Hidden Edge: All identical "bbbbbb"', args: ["bbbbbb"], expected: 1, hidden: true },
      { id: "lu-5", label: 'Hidden Edge: Non-monotonic jump "abba"', args: ["abba"], expected: 2, hidden: true },
    ],
  },
]
