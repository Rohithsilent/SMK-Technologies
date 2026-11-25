import type { RoadmapTopic } from "@/data/roadmaps"

export interface TopicMicroChallenge {
  question: string
  codeHint?: string
  options: { id: string; label: string }[]
  correctId: string
  explanation: string
}

const CURATED_CHALLENGES: Record<string, TopicMicroChallenge> = {
  "py-s1-t1": {
    question: "If `a = [1, 2]` and `b = a`, followed by `b.append(3)`, what is `len(a)`?",
    codeHint: "a = [1, 2]\nb = a\nb.append(3)",
    options: [
      { id: "a", label: "2 — lists copy by value on assignment" },
      { id: "b", label: "3 — both names bind to the same mutable list object" },
      { id: "c", label: "Raises TypeError" },
    ],
    correctId: "b",
    explanation: "Python binds names to references. Mutating `b` mutates the same underlying list referenced by `a`.",
  },
  "py-s3-t2": {
    question: "Which Python structure gives O(1) average membership checks for `token in container`?",
    options: [
      { id: "a", label: "list — scans sequentially" },
      { id: "b", label: "set or dict — uses hash table buckets" },
      { id: "c", label: "tuple — immutable linear buffer" },
    ],
    correctId: "b",
    explanation: "Sets and dicts compute hashes to index directly in O(1) average time.",
  },
  "dsa-s1-t1": {
    question: "For N = 10⁵ with a 1-second limit, which complexity avoids Time Limit Exceeded?",
    options: [
      { id: "a", label: "O(N²)" },
      { id: "b", label: "O(N log N) or O(N)" },
      { id: "c", label: "O(2^N)" },
    ],
    correctId: "b",
    explanation: "10⁵ squared is 10¹⁰ ops (TLE), while N log N (~1.7 × 10⁶) easily passes within 10⁸ ops/sec.",
  },
  "dsa-s2-t1": {
    question: "In sorted Two Sum `[2, 7, 11, 15]` with `target = 9`, when `nums[L] + nums[R] = 17 > 9`, which pointer moves?",
    options: [
      { id: "a", label: "Move L right to increase sum" },
      { id: "b", label: "Move R left to decrease sum" },
      { id: "c", label: "Reset both pointers" },
    ],
    correctId: "b",
    explanation: "Because the array is sorted ascending, decreasing R strictly lowers the pair sum toward the target.",
  },
  "dsa-s2-t2": {
    question: "Why can variable Sliding Window fail on Subarray Sum == K when negative numbers exist?",
    options: [
      { id: "a", label: "Hash maps cannot store negative keys" },
      { id: "b", label: "Shrinking left no longer guarantees the window sum decreases monotonically" },
      { id: "c", label: "Arrays with negatives cannot be indexed from 0" },
    ],
    correctId: "b",
    explanation: "Sliding window relies on monotonic expansion/shrinking; negatives break that invariant.",
  },
  "dsa-s3-t2": {
    question: "Why initialize `prefixCount = {0: 1}` before scanning in Subarray Sum Equals K?",
    options: [
      { id: "a", label: "To count valid subarrays that start at index 0" },
      { id: "b", label: "To prevent integer overflow" },
      { id: "c", label: "To sort prefix sums automatically" },
    ],
    correctId: "a",
    explanation: "When `runningSum == k`, `runningSum - k == 0` hits `{0: 1}` and counts the prefix subarray `[0..i]`.",
  },
}

export function getMicroChallengeForTopic(topic: RoadmapTopic): TopicMicroChallenge {
  const curated = CURATED_CHALLENGES[topic.id]
  if (curated) return curated

  const keyPoint = topic.keyPoints[0] ?? topic.brief
  const secondPoint = topic.keyPoints[1] ?? topic.explanation.slice(0, 90)
  return {
    question: `Which engineering practice accurately reflects "${topic.title}" during an interview or production review?`,
    options: [
      {
        id: "a",
        label: `Ignore edge cases and skip analyzing: ${secondPoint.slice(0, 72)}`,
      },
      {
        id: "b",
        label: keyPoint,
      },
      {
        id: "c",
        label: "Always prefer brute-force nested scans regardless of input constraints",
      },
    ],
    correctId: "b",
    explanation: topic.practicalTip,
  }
}
