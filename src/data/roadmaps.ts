import { BrainCircuit, Code2, PanelsTopLeft, Terminal } from "lucide-react"

export type TopicTag = "Core" | "Pattern" | "Architecture" | "Tooling" | "Deep Dive"

export type RoadmapTopic = {
  id: string
  title: string
  tag: TopicTag
  brief: string
  explanation: string
  keyPoints: string[]
  practicalTip: string
}

export type PracticeKind = "Problem" | "Build" | "Assessment"

export type RoadmapPracticeItem = {
  id: string
  title: string
  kind: PracticeKind
  detail: string
  focus: string
}

export type RoadmapStage = {
  id: string
  title: string
  duration: string
  summary: string
  topics: RoadmapTopic[]
  practiceLabel: string
  practice: RoadmapPracticeItem[]
  outcome: string
}

export type Program = {
  slug: string
  code: string
  name: string
  shortName: string
  duration: string
  problemsCount: string
  prerequisites: string
  target: string
  icon: typeof Code2
  intro: string
  destinationTitle: string
  destinationSummary: string
  stages: RoadmapStage[]
}

export const programs: Program[] = [
  {
    slug: "python",
    code: "00 / CORE PROGRAMMING",
    name: "Python Programming & Logic",
    shortName: "Python",
    duration: "6 Weeks · 45+ Hours",
    problemsCount: "120+ Challenges & Scripts",
    prerequisites: "Zero prior coding experience required",
    target: "Campus Coding Rounds & Automation",
    icon: Terminal,
    intro:
      "A step-by-step path from first-principles logic and memory references to Python collections, object-oriented architecture, and placement coding drills.",
    destinationTitle: "Placement-Ready Python Engineer",
    destinationSummary:
      "Write clean, modular Python with strong OOP design, automate real JSON/CSV workflows, and solve campus assessment rounds quickly.",
    stages: [
      {
        id: "py-s1",
        title: "Syntax, Memory Model & Control Flow",
        duration: "Week 1 · 7.5 Hours",
        summary:
          "Understand how Python executes code, binds variables to objects in memory, and evaluates conditional branches.",
        topics: [
          {
            id: "py-s1-t1",
            title: "Variables, Objects & Memory References",
            tag: "Core",
            brief: "How Python labels point to typed objects on the heap.",
            explanation:
              "Unlike C or Java where variables are fixed memory boxes, Python variables are names bound to object references. Grasping mutability vs immutability prevents subtle aliasing bugs early on.",
            keyPoints: [
              "Dynamic typing and inspecting object identity with id() and type()",
              "Mutable (list, dict, set) vs immutable (int, str, tuple) semantics",
              "Integer, float, boolean, and None representation",
            ],
            practicalTip:
              "Always draw reference arrows when learning nested lists so shallow-copy bugs never surprise you in interviews.",
          },
          {
            id: "py-s1-t2",
            title: "Operators & Expression Precedence",
            tag: "Core",
            brief: "Arithmetic, comparison, short-circuit logic, and bitwise basics.",
            explanation:
              "Clean expressions reduce branching clutter. Understanding floor division (//), modulo (%), chained comparisons, and boolean short-circuiting lets you write concise, bug-free conditions.",
            keyPoints: [
              "True division (/) vs floor division (//) and negative modulo behavior",
              "Chained comparisons (0 <= x < n) and truthiness rules",
              "Short-circuit evaluation with and / or for safe guard checks",
            ],
            practicalTip:
              "Use Python's chained comparison syntax in boundary checks—interviewers notice idiomatic clarity.",
          },
          {
            id: "py-s1-t3",
            title: "Conditionals & Structural Match-Case",
            tag: "Core",
            brief: "Branching paths with if-elif-else and Python 3.10+ pattern matching.",
            explanation:
              "Control flow turns linear scripts into decision-making programs. Ordering mutually exclusive branches and flattening nested conditions keeps logic easy to trace.",
            keyPoints: [
              "Guard clauses to avoid deep pyramid indentation",
              "Ternary conditional expressions for crisp value selection",
              "Structural pattern matching with match / case for command routing",
            ],
            practicalTip:
              "Check edge cases (empty input, zero, negative values) first with early guard conditions.",
          },
        ],
        practiceLabel: "FOUNDATION DRILLS",
        practice: [
          {
            id: "py-s1-p1",
            title: "Number Classification & Leap-Year Validator",
            kind: "Problem",
            detail: "Multi-condition edge-case validation without redundant checks.",
            focus: "Clean boolean precedence and guard conditions.",
          },
          {
            id: "py-s1-p2",
            title: "CLI Grade & Tax Bracket Calculator",
            kind: "Build",
            detail: "Interactive input parsing, validation, and formatted terminal output.",
            focus: "Input sanitization and formatted f-strings.",
          },
        ],
        outcome:
          "Read and trace Python execution line by line and write reliable branching logic without syntax guesswork.",
      },
      {
        id: "py-s2",
        title: "Loops, Strings & Algorithmic Patterns",
        duration: "Week 2 · 7.5 Hours",
        summary:
          "Build iteration fluency with nested loops, string slicing, and classic placement logic exercises.",
        topics: [
          {
            id: "py-s2-t1",
            title: "For/While Iteration & Loop Control",
            tag: "Core",
            brief: "range(), enumerate(), zip(), break, continue, and loop-else.",
            explanation:
              "Iteration is the engine of every algorithm. Mastering enumerate() and zip() eliminates off-by-one indexing mistakes common among beginners.",
            keyPoints: [
              "Iterating over sequences cleanly without manual index counters",
              "Using enumerate() for index-value pairs and zip() for parallel arrays",
              "Loop termination with break, skipping with continue, and for-else search patterns",
            ],
            practicalTip:
              "Prefer iterating directly over items with enumerate() instead of range(len(arr)) whenever possible.",
          },
          {
            id: "py-s2-t2",
            title: "String Slicing & Text Manipulation",
            tag: "Pattern",
            brief: "Negative indexing, slicing steps, immutability, and string methods.",
            explanation:
              "Campus coding rounds heavily test string parsing. Knowing slice syntax [start:stop:step] and O(n) string building with ''.join() keeps solutions both concise and fast.",
            keyPoints: [
              "Slice strides including quick reversal with s[::-1]",
              "Why repeated += string concatenation inside loops is O(n²)",
              "Essential methods: split(), join(), strip(), isalnum(), lower()",
            ],
            practicalTip:
              "Collect character fragments in a list and merge once with ''.join(parts) for linear-time performance.",
          },
          {
            id: "py-s2-t3",
            title: "Nested Loops & Mathematical Logic",
            tag: "Pattern",
            brief: "Pattern printing, prime sieves, GCD, and digit extraction.",
            explanation:
              "Nested loops build the spatial reasoning needed for 2D matrices and brute-force baselines before you learn to optimize them.",
            keyPoints: [
              "Translating row-column symmetry into star and number grids",
              "Digit decomposition with % 10 and // 10",
              "Euclidean GCD and square-root primality bounds",
            ],
            practicalTip:
              "Write down row index i and column count on paper for 3 rows before writing nested loop bounds.",
          },
        ],
        practiceLabel: "LOGIC CHALLENGES",
        practice: [
          {
            id: "py-s2-p1",
            title: "Prime Number Sieve & Euclidean GCD",
            kind: "Problem",
            detail: "Optimize prime generation from O(n√n) down to Sieve of Eratosthenes.",
            focus: "Loop boundaries and boolean marking arrays.",
          },
          {
            id: "py-s2-p2",
            title: "Palindrome, Anagram & Pattern Matrix Drills",
            kind: "Problem",
            detail: "15 classic campus-test string and loop symmetry challenges.",
            focus: "Two-index string checks and nested loop symmetry.",
          },
        ],
        outcome:
          "Translate plain-English logic problems into clean loops and manipulate strings with zero off-by-one bugs.",
      },
      {
        id: "py-s3",
        title: "Collections, Hashing & Comprehensions",
        duration: "Week 3 · 7.5 Hours",
        summary:
          "Harness Python's built-in Lists, Tuples, Dictionaries, and Sets while understanding their real time complexity.",
        topics: [
          {
            id: "py-s3-t1",
            title: "Lists, Tuples & Dynamic Array Complexity",
            tag: "Core",
            brief: "O(1) append/index vs O(n) insert/pop(0) under the hood.",
            explanation:
              "Python lists are contiguous dynamic arrays of pointers. Knowing which operations are constant time versus linear time stops accidental TLE (Time Limit Exceeded) errors in contests.",
            keyPoints: [
              "Amortized O(1) append() vs O(n) middle insertions and deletions",
              "Tuple packing, unpacking, and immutability guarantees",
              "Sorting with sorted() vs list.sort() and custom key lambdas",
            ],
            practicalTip:
              "Never use list.pop(0) as a queue in coding rounds—switch to collections.deque for O(1) popleft().",
          },
          {
            id: "py-s3-t2",
            title: "Dictionaries & Sets (Hash Maps)",
            tag: "Pattern",
            brief: "Average O(1) lookups, frequency counting, and deduplication.",
            explanation:
              "Dictionaries and sets are Python's superpower for turning O(n²) nested loops into O(n) single-pass algorithms.",
            keyPoints: [
              "Hashability rules: why lists cannot be dict keys, while tuples can",
              "Safe access with dict.get(), setdefault(), and membership in sets",
              "Set algebra: union (|), intersection (&), difference (-)",
            ],
            practicalTip:
              "Checking `x in my_set` is O(1), whereas `x in my_list` scans linearly in O(n).",
          },
          {
            id: "py-s3-t3",
            title: "Comprehensions & Generator Expressions",
            tag: "Architecture",
            brief: "Readable transformations and memory-lazy pipelines.",
            explanation:
              "List, dict, and set comprehensions replace verbose boilerplate loops, while generator expressions process large streams without allocating full lists in memory.",
            keyPoints: [
              "Filtering and transforming sequences with list/dict comprehensions",
              "When nested comprehensions hurt readability and should stay loops",
              "Lazy evaluation with generator expressions inside sum(), any(), all()",
            ],
            practicalTip:
              "Pass a generator expression directly to sum(x*x for x in nums) to save memory.",
          },
        ],
        practiceLabel: "COLLECTIONS PRACTICE",
        practice: [
          {
            id: "py-s3-p1",
            title: "Two-Sum & Frequency Counter in Python",
            kind: "Problem",
            detail: "Solve target-pair lookup and word frequencies in single O(n) passes.",
            focus: "Hash map lookups and collections.Counter.",
          },
          {
            id: "py-s3-p2",
            title: "Matrix Transpose & Flattening Utility",
            kind: "Build",
            detail: "Clean 2D transformations using zip(*matrix) and comprehensions.",
            focus: "Nested data structures and unpacking.",
          },
        ],
        outcome:
          "Choose the right collection for every problem and optimize quadratic loops into linear-time lookups.",
      },
      {
        id: "py-s4",
        title: "Functions, Modules & Defensive Code",
        duration: "Week 4 · 7.5 Hours",
        summary:
          "Architect reusable functions, understand variable scope, leverage the standard library, and handle runtime failures safely.",
        topics: [
          {
            id: "py-s4-t1",
            title: "Function Design, Scope & Arguments",
            tag: "Core",
            brief: "LEGB scope resolution, default pitfalls, *args, **kwargs, and lambdas.",
            explanation:
              "Well-factored functions make complex programs testable and readable. Avoiding mutable default arguments (like def f(x=[])) eliminates one of Python's classic bugs.",
            keyPoints: [
              "Local, Enclosing, Global, Built-in (LEGB) name lookup",
              "Positional, keyword, *args, and **kwargs parameter unpacking",
              "Why default arguments should use None instead of mutable lists",
            ],
            practicalTip:
              "Keep functions single-purpose with clear type hints so collaborators and interviewers immediately see your intent.",
          },
          {
            id: "py-s4-t2",
            title: "Standard Library Toolkit",
            tag: "Tooling",
            brief: "collections, itertools, math, datetime, and recursion basics.",
            explanation:
              "Python ships with 'batteries included'. Knowing Counter, defaultdict, deque, and itertools permutations/combinations dramatically speeds up problem solving.",
            keyPoints: [
              "collections.Counter, defaultdict, and deque for algorithmic code",
              "itertools.accumulate, product, permutations, and combinations",
              "Recursion base cases, call stack depth, and @lru_cache memoization",
            ],
            practicalTip:
              "defaultdict(list) removes annoying 'if key not in d' boilerplate when grouping items.",
          },
          {
            id: "py-s4-t3",
            title: "Exception Handling & Safe Recovery",
            tag: "Architecture",
            brief: "try-except-else-finally blocks and custom domain exceptions.",
            explanation:
              "Production scripts fail on malformed inputs or missing files. Catching specific exceptions instead of bare except keeps bugs visible while recovering gracefully.",
            keyPoints: [
              "Specific exception catching (ValueError, KeyError, FileNotFoundError)",
              "Using else for success-only code and finally for cleanup",
              "Raising meaningful errors with raise ValueError(...)",
            ],
            practicalTip:
              "Never write a bare `except:`—it swallows KeyboardInterrupt and hides typos.",
          },
        ],
        practiceLabel: "MODULARITY & RELIABILITY",
        practice: [
          {
            id: "py-s4-p1",
            title: "Recursive Fibonacci with Memoization",
            kind: "Problem",
            detail: "Compare naive O(2ⁿ) recursion vs O(n) dictionary/lru_cache memoization.",
            focus: "Call stack tracing and caching.",
          },
          {
            id: "py-s4-p2",
            title: "Fault-Tolerant JSON Config Validator",
            kind: "Build",
            detail: "Validate malformed records gracefully with structured error messages.",
            focus: "Targeted exception handling and helper decomposition.",
          },
        ],
        outcome:
          "Structure multi-function Python modules cleanly, use standard library utilities fluently, and handle edge-case errors safely.",
      },
      {
        id: "py-s5",
        title: "Object-Oriented Programming & Design",
        duration: "Week 5 · 7.5 Hours",
        summary:
          "Model real-world entities cleanly using classes, dunder methods, inheritance, composition, and clean encapsulation.",
        topics: [
          {
            id: "py-s5-t1",
            title: "Classes, State & Dunder Methods",
            tag: "Core",
            brief: "__init__, self, instance vs class attributes, and __repr__ / __eq__.",
            explanation:
              "Classes group data with the behaviors that operate on them. Implementing Python's dunder methods (__repr__, __len__, __eq__) makes custom objects feel native to the language.",
            keyPoints: [
              "Understanding `self` as the bound instance reference",
              "Class attributes shared across instances vs per-object attributes",
              "Readable debugging output with __repr__ vs user-facing __str__",
            ],
            practicalTip:
              "Always define __repr__ on your classes so printing a list of objects shows useful diagnostics.",
          },
          {
            id: "py-s5-t2",
            title: "Inheritance, Polymorphism & Composition",
            tag: "Architecture",
            brief: "super(), method overriding, duck typing, and composition over deep trees.",
            explanation:
              "OOP interviews test whether you know when to share behavior via inheritance versus composing objects cleanly. Python embraces duck typing—focus on consistent interfaces.",
            keyPoints: [
              "Extending parent constructors properly using super().__init__()",
              "Duck typing and abstract base classes (abc.ABC)",
              "Choosing composition ('has-a') over brittle multi-level inheritance ('is-a')",
            ],
            practicalTip:
              "If two classes share utility behavior rather than an identity relationship, compose a helper instead of inheriting.",
          },
          {
            id: "py-s5-t3",
            title: "Encapsulation, Properties & Dataclasses",
            tag: "Tooling",
            brief: "Protecting invariants with @property and eliminating boilerplate via @dataclass.",
            explanation:
              "Modern Python favors @dataclass for clean data containers and @property for validating state transitions without cluttering callers with get_/set_ methods.",
            keyPoints: [
              "Private naming conventions (_internal) and invariant validation",
              "Computed attributes and setters with @property",
              "Rapid clean models with @dataclass(frozen=True)",
            ],
            practicalTip:
              "Use @dataclass when modeling structured records like Student, Order, or Transaction.",
          },
        ],
        practiceLabel: "OOP DESIGN BUILDS",
        practice: [
          {
            id: "py-s5-p1",
            title: "Bank Account & Ledger System (OOP)",
            kind: "Build",
            detail: "Model accounts, overdraft rules, transaction logs, and transfers cleanly.",
            focus: "Encapsulation, invariants, and custom exceptions.",
          },
          {
            id: "py-s5-p2",
            title: "Campus Inventory & Book Lending Manager",
            kind: "Build",
            detail: "Design Member, Book, and Library classes using composition.",
            focus: "Class relationships and clean method APIs.",
          },
        ],
        outcome:
          "Design clean, idiomatic object-oriented Python systems and answer OOP interview questions confidently.",
      },
      {
        id: "py-s6",
        title: "Files, Automation, APIs & Placement Drills",
        duration: "Week 6 · 7.5 Hours",
        summary:
          "Connect Python to the real world with file I/O, JSON/CSV automation, HTTP APIs, and timed campus placement coding rounds.",
        topics: [
          {
            id: "py-s6-t1",
            title: "File I/O & Context Managers (with)",
            tag: "Core",
            brief: "Safe reading/writing across TXT, CSV, and JSON with pathlib.",
            explanation:
              "Context managers (`with open(...)`) guarantee file handles close even when exceptions occur. Pairing them with pathlib makes cross-platform file automation clean.",
            keyPoints: [
              "Modern path handling with pathlib.Path",
              "Streaming large files line-by-line without exhausting RAM",
              "Reading and serializing structured csv and json records",
            ],
            practicalTip:
              "Always specify encoding='utf-8' when opening text files to avoid OS-dependent decoding errors.",
          },
          {
            id: "py-s6-t2",
            title: "Consuming REST APIs with Requests",
            tag: "Tooling",
            brief: "HTTP GET/POST, query params, timeouts, status checks, and JSON parsing.",
            explanation:
              "Automation scripts regularly pull data from external APIs. Handling timeouts, status codes, and missing JSON keys cleanly makes scripts production-worthy.",
            keyPoints: [
              "Managing isolated dependencies with venv and pip",
              "Calling endpoints with timeouts and response.raise_for_status()",
              "Transforming nested JSON API payloads into clean summaries",
            ],
            practicalTip:
              "Never call requests.get(url) without a `timeout=` argument—otherwise a hung server freezes your script indefinitely.",
          },
          {
            id: "py-s6-t3",
            title: "Campus Coding Assessment Speed Drills",
            tag: "Deep Dive",
            brief: "Fast I/O, edge-case testing, and TCS/Infosys/Accenture round prep.",
            explanation:
              "Timed placement tests demand accuracy under pressure. Practicing input parsing patterns and systematic dry-runs turns solved concepts into offers.",
            keyPoints: [
              "Parsing single-line and multi-line competitive test inputs cleanly",
              "Systematic boundary testing (n=0, n=1, duplicates, sorted/reversed)",
              "Time budgeting across easy and medium coding round questions",
            ],
            practicalTip:
              "Test your solution manually on an empty or 1-element input before clicking Submit.",
          },
        ],
        practiceLabel: "CAPSTONE & ASSESSMENTS",
        practice: [
          {
            id: "py-s6-p1",
            title: "Automated Resume & CSV Report Extractor",
            kind: "Build",
            detail: "Parse directories of records into clean, filtered summary CSV/JSON reports.",
            focus: "pathlib, csv/json modules, and context managers.",
          },
          {
            id: "py-s6-p2",
            title: "REST API Weather & Tech News CLI Tool",
            kind: "Build",
            detail: "Fetch live public APIs, handle failures, and format terminal dashboards.",
            focus: "HTTP requests, timeouts, and structured parsing.",
          },
          {
            id: "py-s6-p3",
            title: "Timed Campus Placement Mock Coding Test",
            kind: "Assessment",
            detail: "Previous TCS Digital, Infosys SP, and Wipro pattern problems under clock.",
            focus: "Speed, accuracy, and edge-case verification.",
          },
        ],
        outcome:
          "Build working automation CLI tools, consume live APIs, and clear campus placement Python coding tests.",
      },
    ],
  },
  {
    slug: "dsa",
    code: "01 / PLACEMENT CODING",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    duration: "8 Weeks · 60+ Hours",
    problemsCount: "200+ LeetCode Problems",
    prerequisites: "Basic syntax in C++, Java, or Python",
    target: "Product & Top IT Campus Drives",
    icon: Code2,
    intro:
      "A pattern-driven visual roadmap from asymptotic complexity and linear pointers to trees, dynamic programming, and graph algorithms.",
    destinationTitle: "Interview-Ready Problem Solver",
    destinationSummary:
      "Recognize the underlying algorithmic pattern in any unseen problem, prove optimal complexity, and explain trade-offs clearly in live technical rounds.",
    stages: [
      {
        id: "dsa-s1",
        title: "Complexity Analysis, Math & Bit Manipulation",
        duration: "Week 1 · 8 Hours",
        summary:
          "Build the analytical lens to predict runtime and memory limits before writing code, plus fast bitwise arithmetic tricks.",
        topics: [
          {
            id: "dsa-s1-t1",
            title: "Asymptotic Notation (Big-O, Theta, Omega)",
            tag: "Core",
            brief: "Estimate operations vs constraints (10⁵ vs 10⁸ rule) in seconds.",
            explanation:
              "Every online judge gives input constraint N and a ~1-second limit (~10⁸ basic ops). Reading N immediately tells you whether O(n²), O(n log n), or O(n) is required.",
            keyPoints: [
              "Worst-case, average-case, and amortized complexity (dynamic array resize)",
              "Deriving recurrences for nested loops and divide-and-conquer",
              "Mapping input bounds (N <= 20, 10³, 10⁵, 10⁹) to target complexity",
            ],
            practicalTip:
              "Read the Constraints section of a problem before designing your algorithm—it literally hints the intended Big-O.",
          },
          {
            id: "dsa-s1-t2",
            title: "Space Complexity & Call Stack Memory",
            tag: "Core",
            brief: "Auxiliary memory vs input memory and recursion stack depth.",
            explanation:
              "Interviewers evaluate both time and auxiliary space. Recursive algorithms consume O(depth) stack frames even when you allocate zero arrays.",
            keyPoints: [
              "Distinguishing auxiliary space from output space",
              "Calculating recursion tree depth and stack overflow risks",
              "In-place algorithm trade-offs",
            ],
            practicalTip:
              "Always state both Time and Space complexity explicitly—and clarify if recursion stack is included.",
          },
          {
            id: "dsa-s1-t3",
            title: "Bitwise Operators & Bitmasking",
            tag: "Pattern",
            brief: "AND, OR, XOR properties, bit shifts, and subset enumeration.",
            explanation:
              "Bit manipulation turns set operations and parity tricks into single CPU instructions. XOR cancels duplicates (a ^ a = 0), making missing/unique element problems O(1) space.",
            keyPoints: [
              "Checking, setting, clearing, and toggling the k-th bit",
              "Brian Kernighan's trick (n & (n - 1)) to clear lowest set bit",
              "Representing small subsets (N <= 20) as integer bitmasks",
            ],
            practicalTip:
              "Whenever all numbers appear twice except one (or two), reach for XOR immediately.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s1-p1",
            title: "Single Number (LeetCode 136)",
            kind: "Problem",
            detail: "Find the lone unique integer in O(n) time and O(1) space via XOR.",
            focus: "XOR self-cancellation identity.",
          },
          {
            id: "dsa-s1-p2",
            title: "Subsets via Bitmasking (LeetCode 78)",
            kind: "Problem",
            detail: "Generate all 2ⁿ subsets iteratively using masks 0..(1<<n)-1.",
            focus: "Bitmask-to-index mapping.",
          },
          {
            id: "dsa-s1-p3",
            title: "Counting Bits & Fast Power (LeetCode 338, 50)",
            kind: "Problem",
            detail: "O(n) bit-count DP and O(log n) binary exponentiation.",
            focus: "Right-shift bit decomposition.",
          },
        ],
        outcome:
          "Read problem constraints and immediately know the required time/space target before touching the keyboard.",
      },
      {
        id: "dsa-s2",
        title: "Arrays, Two Pointers & Sliding Window",
        duration: "Week 2 · 10 Hours",
        summary:
          "Master the highest-frequency patterns in online assessments: converging pointers, prefix sums, and dynamic windows.",
        topics: [
          {
            id: "dsa-s2-t1",
            title: "Two Pointers (Converging & Fast/Slow)",
            tag: "Pattern",
            brief: "Shrink O(n²) pair scans down to O(n) single passes.",
            explanation:
              "When arrays are sorted or allow monotonic pointer movement from both ends, two pointers eliminate nested comparisons without extra memory. Fast/slow pointers also partition arrays in place.",
            keyPoints: [
              "Opposite-end pointers for sorted pair sums and container bounds",
              "Read/write pointer pattern for in-place deduplication and partitioning",
              "Sorting + Two Pointers for 3-Sum and K-Sum variants",
            ],
            practicalTip:
              "Skip duplicate values after finding a match in 3-Sum so your result stays deduplicated without a HashSet.",
          },
          {
            id: "dsa-s2-t2",
            title: "Fixed & Variable Sliding Window",
            tag: "Pattern",
            brief: "Maintain contiguous subarray invariants as left/right bounds glide.",
            explanation:
              "Instead of recomputing subarray sums or character counts from scratch for every start index, sliding window updates the state incrementally as elements enter right and exit left.",
            keyPoints: [
              "Fixed k-length window maintenance",
              "Variable window: expand right to satisfy, shrink left to optimize",
              "Tracking window validity with counts or frequency counters",
            ],
            practicalTip:
              "Ask yourself: 'If I extend right, does validity monotonically break or hold?' Monotonicity unlocks Sliding Window.",
          },
          {
            id: "dsa-s2-t3",
            title: "Prefix Sums & Kadane's Algorithm",
            tag: "Pattern",
            brief: "O(1) range queries and linear maximum-subarray optimization.",
            explanation:
              "Precomputing cumulative sums turns repeated range-sum queries into a single subtraction prefix[r+1] - prefix[l]. Kadane's algorithm extends that mindset to track optimal running subarray sums.",
            keyPoints: [
              "1D prefix sums and 2D submatrix inclusion-exclusion queries",
              "Difference arrays for O(1) range updates",
              "Kadane's local-vs-global maximum state transition",
            ],
            practicalTip:
              "Always 1-index your prefix array (length n + 1 with prefix[0] = 0) to eliminate l == 0 edge-case branches.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s2-p1",
            title: "Trapping Rain Water (LeetCode 42 · Hard)",
            kind: "Problem",
            detail: "Optimize prefix-max arrays to an elegant O(n) time, O(1) space two-pointer scan.",
            focus: "Limiting wall invariant across converging pointers.",
          },
          {
            id: "dsa-s2-p2",
            title: "3-Sum & Container With Most Water (LC 15, 11)",
            kind: "Problem",
            detail: "Sorted converging pointers with clean duplicate skipping.",
            focus: "Greedy pointer advancement proof.",
          },
          {
            id: "dsa-s2-p3",
            title: "Longest Substring Without Repeating Chars (LC 3)",
            kind: "Problem",
            detail: "Variable sliding window jumping left past the last seen character.",
            focus: "Dynamic window shrinking.",
          },
        ],
        outcome:
          "Solve over two-thirds of company assessment array and substring problems cleanly in under 20 minutes.",
      },
      {
        id: "dsa-s3",
        title: "Strings, Hashing & Binary Search on Answers",
        duration: "Week 3 · 8 Hours",
        summary:
          "Eliminate quadratic bottlenecks using O(1) hash tables, prefix-hash pairings, and monotonic search spaces.",
        topics: [
          {
            id: "dsa-s3-t1",
            title: "Hash Table Internals & Frequency Maps",
            tag: "Core",
            brief: "O(1) amortized lookups, collisions, and array-vs-map trade-offs.",
            explanation:
              "Hash tables map arbitrary keys to bucket indices via hash functions. For lowercase ASCII strings, a fixed int[26] array outperforms a HashMap in both speed and memory.",
            keyPoints: [
              "Collision handling (chaining vs open addressing) and load factor resizing",
              "Canonical keys for grouping (sorted strings or count tuples for anagrams)",
              "Choosing int[26] / int[128] over HashMap for character alphabets",
            ],
            practicalTip:
              "When asked why HashMap lookup is O(1), mention load factor and worst-case O(n) collision behavior—interviewers love hearing depth.",
          },
          {
            id: "dsa-s3-t2",
            title: "Prefix Sum + HashMap Subarrays",
            tag: "Pattern",
            brief: "Handle subarrays with negative numbers where sliding window fails.",
            explanation:
              "Sliding window breaks when negative values exist because expanding right doesn't monotonically increase the sum. Storing earlier prefix sums in a HashMap solves `Subarray Sum == K` in O(n).",
            keyPoints: [
              "Checking `(currentPrefix - k) in seenPrefixes`",
              "Initializing `map[0] = 1` (or index -1) for subarrays starting at index 0",
              "Extending to modulo-K divisibility and equal 0s/1s counts",
            ],
            practicalTip:
              "Negative numbers in a subarray-sum problem are the #1 signal to switch from Sliding Window to Prefix Sum + HashMap.",
          },
          {
            id: "dsa-s3-t3",
            title: "Binary Search & Search on Answer Space",
            tag: "Pattern",
            brief: "Beyond sorted arrays: minimize the maximum or maximize the minimum in O(log R).",
            explanation:
              "Binary search applies to ANY monotonic boolean predicate (`FFFFTTTT`), not just sorted arrays. Whenever a problem asks 'find the minimum capacity to finish within D days', binary search the answer.",
            keyPoints: [
              "Bug-free `mid = lo + (hi - lo) // 2` and lower/upper bound templates",
              "Rotated sorted array invariants",
              "Writing greedy feasibility checks `canFinish(capacity)` for answer spaces",
            ],
            practicalTip:
              "Keep a single invariant template (`while lo < hi` or `ans` variable) so you never hit infinite binary search loops.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s3-p1",
            title: "Subarray Sum Equals K (LeetCode 560)",
            kind: "Problem",
            detail: "Count all subarrays summing to K including negative values in O(n).",
            focus: "Prefix frequency map initialization.",
          },
          {
            id: "dsa-s3-p2",
            title: "Group Anagrams & Longest Consecutive Sequence (LC 49, 128)",
            kind: "Problem",
            detail: "Canonical hashing and sequence-start filtering in HashSet.",
            focus: "O(n) sequence boundary detection.",
          },
          {
            id: "dsa-s3-p3",
            title: "Koko Eating Bananas & First Missing Positive (LC 875, 41)",
            kind: "Problem",
            detail: "Binary search on monotonic capacity + index-as-hash cyclic placement.",
            focus: "Predicate monotonicity and O(1) space hashing.",
          },
        ],
        outcome:
          "Spot O(n) hashing shortcuts instantly and apply binary search to complex optimization constraints.",
      },
      {
        id: "dsa-s4",
        title: "Stacks, Queues & Linked Lists",
        duration: "Week 4 · 8 Hours",
        summary:
          "Master in-place pointer rewiring, cycle detection, monotonic stack invariants, and LRU cache design.",
        topics: [
          {
            id: "dsa-s4-t1",
            title: "Linked List Pointer Manipulation & Cycle Detection",
            tag: "Core",
            brief: "Dummy head nodes, in-place reversal, and Floyd's tortoise-hare algorithm.",
            explanation:
              "Linked list questions test clean pointer discipline under pressure. Using a sentinel dummy node before head eliminates special-casing empty lists or head deletions.",
            keyPoints: [
              "Iterative 3-pointer reversal (`prev, curr, next`) and K-group reversal",
              "Floyd's slow/fast pointer for midpoint, cycle detection, and cycle entry",
              "Merging sorted lists and finding intersection nodes",
            ],
            practicalTip:
              "Always create a `dummy = Node(0)` pointing to `head` whenever a linked list structure might change at the front.",
          },
          {
            id: "dsa-s4-t2",
            title: "Monotonic Stacks & Queues",
            tag: "Pattern",
            brief: "Find next greater/smaller elements in O(n) amortized time.",
            explanation:
              "By keeping stack elements strictly increasing or decreasing, each element is pushed once and popped once—yielding O(n) total time for histogram areas and stock spans.",
            keyPoints: [
              "Maintaining increasing vs decreasing stack invariants",
              "Popping triggers 'resolved right/left boundary' calculations",
              "Monotonic deque for Sliding Window Maximum in O(n)",
            ],
            practicalTip:
              "Store indices rather than raw values in monotonic stacks so you can compute widths directly.",
          },
          {
            id: "dsa-s4-t3",
            title: "LRU Cache Architecture",
            tag: "Architecture",
            brief: "Combine a HashMap with a Doubly Linked List for O(1) get and put.",
            explanation:
              "LRU Cache is a classic Amazon/Microsoft interview staple because it combines two complementary data structures: HashMap for O(1) lookup and Doubly Linked List for O(1) eviction/promotion.",
            keyPoints: [
              "Dummy head & tail sentinels to simplify node removal and front-insertion",
              "Updating recency on both `get` and `put` hits",
              "Evicting the tail-adjacent node cleanly upon capacity overflow",
            ],
            practicalTip:
              "Write tiny helper methods `_remove(node)` and `_add_to_front(node)` so `get` and `put` stay ~10 lines each.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s4-p1",
            title: "Reverse Nodes in K-Group (LeetCode 25 · Hard)",
            kind: "Problem",
            detail: "Clean multi-segment pointer stitching with sentinel nodes.",
            focus: "Boundary-safe pointer rewiring.",
          },
          {
            id: "dsa-s4-p2",
            title: "Largest Rectangle in Histogram (LC 84 · Hard)",
            kind: "Problem",
            detail: "Single-pass monotonic increasing stack calculating left/right span bounds.",
            focus: "Index stack + sentinel zero height.",
          },
          {
            id: "dsa-s4-p3",
            title: "LRU Cache Implementation (LeetCode 146)",
            kind: "Build",
            detail: "Production-clean HashMap + Doubly Linked List with O(1) operations.",
            focus: "Data structure composition.",
          },
        ],
        outcome:
          "Handle complex pointer rewiring without null-pointer crashes and solve monotonic boundary questions in O(n).",
      },
      {
        id: "dsa-s5",
        title: "Binary Trees, BST & Heaps",
        duration: "Week 5 · 10 Hours",
        summary:
          "Think recursively over hierarchical trees, leverage BST ordering invariants, and maintain Top-K priority queues.",
        topics: [
          {
            id: "dsa-s5-t1",
            title: "DFS Traversals & Recursive Tree Thinking",
            tag: "Core",
            brief: "Preorder, Inorder, Postorder, and bottom-up vs top-down state passing.",
            explanation:
              "Nearly every binary tree problem reduces to one question: 'What information do I need from my left and right subtrees, and what should I return to my parent?'",
            keyPoints: [
              "Top-down state passing (root-to-leaf paths) vs bottom-up aggregation (height, diameter)",
              "Iterative stack-based DFS and Morris traversal overview",
              "Tree construction from Preorder + Inorder sequences",
            ],
            practicalTip:
              "Don't manually trace 4 levels of recursion—define the contract for `node == null` and a single parent combining `left` and `right`.",
          },
          {
            id: "dsa-s5-t2",
            title: "BFS Level Order & Binary Search Trees",
            tag: "Pattern",
            brief: "Queue snapshots per level and exploiting left < root < right.",
            explanation:
              "Snapshotting `len(queue)` before looping unlocks right-side views, zig-zag levels, and minimum depths. In BSTs, inorder traversal always yields sorted values.",
            keyPoints: [
              "Level-size snapshotting in BFS queues",
              "Validating BSTs with tighter `[minVal, maxVal]` bounds rather than local child checks",
              "Lowest Common Ancestor (LCA) in generic Binary Trees vs O(h) in BSTs",
            ],
            practicalTip:
              "Checking `left.val < root.val < right.val` alone is a classic bug—propagate ancestor min/max bounds down the tree.",
          },
          {
            id: "dsa-s5-t3",
            title: "Priority Queues (Min/Max Heaps) & Top-K",
            tag: "Pattern",
            brief: "Heapify in O(n), O(log k) Top-K streaming, and two-heap medians.",
            explanation:
              "When you repeatedly need the minimum, maximum, or K-th extreme in a changing stream, heaps beat sorting on every update (O(log n) vs O(n log n)).",
            keyPoints: [
              "Complete binary tree array indexing (`2i+1`, `2i+2`) and heapify complexity",
              "Using a size-K Min-Heap to find K-Largest elements in O(n log k)",
              "Two-heap balancing (Max-Heap + Min-Heap) for streaming medians",
            ],
            practicalTip:
              "Counter-intuitive rule: to find the K LARGEST elements, keep a MIN-heap of size K so you can evict the smallest.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s5-p1",
            title: "Binary Tree Maximum Path Sum & LCA (LC 124, 236)",
            kind: "Problem",
            detail: "Separate global best tracking from single-branch return values.",
            focus: "Bottom-up recursive contracts.",
          },
          {
            id: "dsa-s5-p2",
            title: "Validate BST & Kth Smallest (LC 98, 230)",
            kind: "Problem",
            detail: "Range-bounded validation and iterative inorder stopping early.",
            focus: "BST sorted inorder property.",
          },
          {
            id: "dsa-s5-p3",
            title: "Top-K Frequent & Median from Data Stream (LC 347, 295)",
            kind: "Problem",
            detail: "Heap-based streaming quantiles and frequency ranking.",
            focus: "Dual-heap rebalancing.",
          },
        ],
        outcome:
          "Design crisp recursive tree contracts, exploit BST invariants, and solve Top-K streaming problems cleanly.",
      },
      {
        id: "dsa-s6",
        title: "Recursion, Backtracking & Dynamic Programming",
        duration: "Week 6–7 · 14 Hours",
        summary:
          "Demystify DP with a systematic progression: decision tree -> memoization -> tabulation -> space optimization.",
        topics: [
          {
            id: "dsa-s6-t1",
            title: "Decision Trees & Backtracking Pruning",
            tag: "Pattern",
            brief: "Choose, explore, unchoose across subsets, permutations, and constraints.",
            explanation:
              "Backtracking systematically searches combinatorial state spaces while pruning invalid branches early so exponential search remains fast in practice.",
            keyPoints: [
              "Drawing the 'include vs exclude' and 'next choice' recursion tree",
              "Handling duplicate elements via sorting + `i > start and nums[i] == nums[i-1]`",
              "Constraint sets for N-Queens and Sudoku Solver",
            ],
            practicalTip:
              "Always draw the recursion tree for N=3 on scratch paper before writing a single line of backtracking code.",
          },
          {
            id: "dsa-s6-t2",
            title: "1D & 2D Dynamic Programming Framework",
            tag: "Deep Dive",
            brief: "Overlapping subproblems, state definitions, memoization, and tabulation.",
            explanation:
              "DP isn't magic—it's just caching overlapping recursive states. Once your recursive state `(idx, remaining)` works, converting it to a bottom-up table and rolling 1D array is mechanical.",
            keyPoints: [
              "Defining exact state meaning (`dp[i]` = best answer ending at or up to `i`)",
              "Top-down Memoization vs Bottom-up Tabulation order",
              "Rolling-row space optimization from O(N·M) to O(M)",
            ],
            practicalTip:
              "Every DP solution starts with two questions: 'What uniquely identifies a subproblem?' and 'What are the base cases?'",
          },
          {
            id: "dsa-s6-t3",
            title: "Knapsack, String DP & LIS Patterns",
            tag: "Deep Dive",
            brief: "0/1 & Unbounded Knapsack, LCS, Edit Distance, and Stocks state machines.",
            explanation:
              "Most medium/hard DP interview questions are variations of 5 core templates: Linear/House Robber, Knapsack, Two-String alignment, Grid paths, and State-Machine Stocks.",
            keyPoints: [
              "0/1 Knapsack (loop capacity backwards in 1D) vs Unbounded (loop forwards)",
              "Two-string DP (`i, j` match vs insert/delete/replace transitions)",
              "Longest Increasing Subsequence in O(n²) DP and O(n log n) patience binary search",
            ],
            practicalTip:
              "In 1D Knapsack space optimization, iterating capacity backwards prevents reusing the same item twice.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s6-p1",
            title: "Coin Change I & II (LeetCode 322, 518)",
            kind: "Problem",
            detail: "Unbounded knapsack minimum coins vs total unique combinations.",
            focus: "Loop ordering for combinations vs permutations.",
          },
          {
            id: "dsa-s6-p2",
            title: "Edit Distance & LCS (LeetCode 72, 1143)",
            kind: "Problem",
            detail: "2D string alignment table compressed to O(min(m, n)) space.",
            focus: "Insert/Delete/Replace recurrence mapping.",
          },
          {
            id: "dsa-s6-p3",
            title: "Longest Increasing Subsequence & Partition Equal Subset (LC 300, 416)",
            kind: "Problem",
            detail: "Classic LIS patience sorting and 0/1 subset-sum reduction.",
            focus: "Problem reduction into standard DP templates.",
          },
        ],
        outcome:
          "Derive recursive state transitions calmly and optimize memoized DP into clean bottom-up tables.",
      },
      {
        id: "dsa-s7",
        title: "Graphs & Advanced Traversal Algorithms",
        duration: "Week 7 · 10 Hours",
        summary:
          "Model real networks and grids using BFS/DFS, topological dependency sorting, shortest paths, and Union-Find.",
        topics: [
          {
            id: "dsa-s7-t1",
            title: "Graph Representations, BFS & DFS",
            tag: "Core",
            brief: "Adjacency lists, implicit grids, multi-source BFS, and visited sets.",
            explanation:
              "Matrices, social networks, and prerequisite chains are all graphs. Knowing when to use queue-based BFS (shortest unweighted hops) vs DFS (connected components, paths) is foundational.",
            keyPoints: [
              "Adjacency list vs matrix trade-offs for sparse vs dense graphs",
              "4-directional grid traversals without out-of-bounds bugs",
              "Multi-source BFS initializing the queue with all starting nodes at t=0",
            ],
            practicalTip:
              "Mark nodes as visited WHEN PUSHING onto the BFS queue, never when popping—otherwise duplicates flood the queue.",
          },
          {
            id: "dsa-s7-t2",
            title: "Cycle Detection & Topological Sort",
            tag: "Pattern",
            brief: "Kahn's in-degree BFS and 3-color DFS on Directed Acyclic Graphs.",
            explanation:
              "Dependency ordering (build pipelines, course prerequisites) requires Topological Sort. If Kahn's algorithm processes fewer than V nodes, a cycle exists.",
            keyPoints: [
              "Undirected cycle detection (tracking parent) vs Directed (visiting/visited states)",
              "Kahn's BFS using in-degree counts",
              "Detecting impossible cyclic schedules",
            ],
            practicalTip:
              "Kahn's in-degree BFS is cleaner to write and debug under interview time limits than 3-color recursive cycle detection.",
          },
          {
            id: "dsa-s7-t3",
            title: "Dijkstra Shortest Path & Disjoint Set (DSU)",
            tag: "Architecture",
            brief: "Weighted shortest paths via Min-Heap and O(α(n)) dynamic connectivity.",
            explanation:
              "Dijkstra generalizes BFS to non-negative edge weights using a priority queue. DSU (Union-Find) tracks merging components in nearly constant amortized time.",
            keyPoints: [
              "Lazy deletion in Dijkstra (`if dist > best[u]: continue`)",
              "Why Dijkstra fails on negative edges (Bellman-Ford overview)",
              "Union by Rank/Size + Path Compression in Disjoint Set Union",
            ],
            practicalTip:
              "If edges are added dynamically and you only need 'are A and B connected?', use Union-Find—it's 15 lines and ultra fast.",
          },
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS",
        practice: [
          {
            id: "dsa-s7-p1",
            title: "Number of Islands & Rotting Oranges (LC 200, 994)",
            kind: "Problem",
            detail: "Grid DFS component counting and multi-source BFS time propagation.",
            focus: "Grid boundary safety and simultaneous BFS waves.",
          },
          {
            id: "dsa-s7-p2",
            title: "Course Schedule I & II (LeetCode 207, 210)",
            kind: "Problem",
            detail: "Cycle detection and valid prerequisite ordering via Kahn's algorithm.",
            focus: "DAG in-degree reduction.",
          },
          {
            id: "dsa-s7-p3",
            title: "Network Delay Time & Redundant Connection (LC 743, 684)",
            kind: "Problem",
            detail: "Weighted Dijkstra shortest path + Union-Find cycle edge detection.",
            focus: "Min-Heap relaxation and path compression.",
          },
        ],
        outcome:
          "Model grids and dependencies as graphs and implement BFS, Topological Sort, Dijkstra, and DSU cleanly.",
      },
      {
        id: "dsa-s8",
        title: "Company Mock Tests & Technical Interviews",
        duration: "Week 8 · 6 Hours",
        summary:
          "Simulate real campus online assessments and practice thinking aloud cleanly during 1-on-1 technical rounds.",
        topics: [
          {
            id: "dsa-s8-t1",
            title: "Company Assessment Strategy (TCS, Cognizant, Product OAs)",
            tag: "Tooling",
            brief: "Time triage, partial test-case optimization, and hidden edge cases.",
            explanation:
              "Real online assessments reward strategic ordering: lock in full passes on easier problems before spending heavy time debugging complex corner cases.",
            keyPoints: [
              "Reading all problems in the first 3 minutes to triage difficulty",
              "Handling 64-bit integer overflow (`long long` / `long`) and modulo arithmetic",
              "Writing brute-force checks when stuck to verify understanding",
            ],
            practicalTip:
              "If constraints reach 10⁵ and you sum elements, switch to 64-bit integers immediately in C++/Java.",
          },
          {
            id: "dsa-s8-t2",
            title: "Live Interview Communication Protocol",
            tag: "Core",
            brief: "Clarify -> Example -> Brute Force -> Optimal -> Code -> Dry Run.",
            explanation:
              "Strong engineers fail interviews by jumping straight into silent typing. Walking interviewers through constraints, brute force trade-offs, and a dry run proves structured engineering maturity.",
            keyPoints: [
              "Clarifying input ranges, duplicates, sorted order, and mutability",
              "Narrating why a HashMap/Heap improves brute-force complexity",
              "Tracing your own code line-by-line on a non-trivial edge case",
            ],
            practicalTip:
              "Treat the interviewer as a teammate you're collaborating with—silence makes them assume you're stuck.",
          },
        ],
        practiceLabel: "ASSESSMENTS & MOCKS",
        practice: [
          {
            id: "dsa-s8-p1",
            title: "5 Full-Length Timed Placement Contests",
            kind: "Assessment",
            detail: "90-minute company-pattern OA simulations with live editorial breakdowns.",
            focus: "Speed, constraint reading, and first-submit accuracy.",
          },
          {
            id: "dsa-s8-p2",
            title: "1-on-1 Mock Technical Interview",
            kind: "Assessment",
            detail: "45-minute live coding interview with structured scorecard feedback.",
            focus: "Communication, clean code, and complexity articulation.",
          },
        ],
        outcome:
          "Walk into campus placement drives confident under time pressure and ready to articulate optimal solutions clearly.",
      },
    ],
  },
  {
    slug: "web-development",
    code: "02 / FULL STACK ENGINEERING",
    name: "Full-Stack Web Development",
    shortName: "Web Dev",
    duration: "8 Weeks · 60+ Hours",
    problemsCount: "4 Live Deployed Projects",
    prerequisites: "Basic computer familiarity — beginners welcome",
    target: "Frontend, Backend & Full-Stack Roles",
    icon: PanelsTopLeft,
    intro:
      "An end-to-end engineering roadmap from semantic HTML, JavaScript internals, and React architecture to REST APIs, MongoDB schemas, auth security, and cloud CI/CD.",
    destinationTitle: "Production Full-Stack Developer",
    destinationSummary:
      "Ship accessible React frontends connected to secure Node/Express APIs and MongoDB databases with live deployed URLs on Vercel and Render.",
    stages: [
      {
        id: "web-s1",
        title: "Semantic HTML5, Responsive CSS3 & Tailwind",
        duration: "Week 1 · 8 Hours",
        summary:
          "Structure accessible documents and master modern responsive layout primitives without CSS guesswork.",
        topics: [
          {
            id: "web-s1-t1",
            title: "Semantic HTML5 & Accessibility (a11y)",
            tag: "Core",
            brief: "Landmarks, heading hierarchy, forms, and keyboard navigation.",
            explanation:
              "Using <header>, <main>, <nav>, <button>, and proper <label> bindings gives screen readers, keyboard users, and search engines clear structure for free.",
            keyPoints: [
              "Document landmarks vs generic div soup",
              "Native <button> vs <a> navigation semantics",
              "Form labels, ARIA live regions, and visible focus rings",
            ],
            practicalTip:
              "Always test your page using only the Tab and Enter keys—if you can't use it without a mouse, fix the semantics.",
          },
          {
            id: "web-s1-t2",
            title: "Box Model, Flexbox & CSS Grid Systems",
            tag: "Core",
            brief: "1D alignment with Flexbox, 2D structural tracks with CSS Grid.",
            explanation:
              "Nearly every layout breaks down into CSS Grid for overall 2D structure and Flexbox for aligning items inside rows or bars. `box-sizing: border-box` makes sizing predictable.",
            keyPoints: [
              "Flexbox main vs cross axis, `gap`, `flex-grow`, and `min-width: 0`",
              "CSS Grid `minmax()`, `auto-fit`, and responsive template columns",
              "Stacking contexts, `position: sticky`, and viewport units (`svh`)",
            ],
            practicalTip:
              "Add `min-width: 0` on Grid/Flex children containing long text or code blocks to prevent layout blowout.",
          },
          {
            id: "web-s1-t3",
            title: "Mobile-First Responsive Design & Tailwind CSS",
            tag: "Tooling",
            brief: "Utility-first styling, design tokens, and fluid breakpoints.",
            explanation:
              "Building mobile styles first and progressively enhancing at `sm:`, `md:`, and `lg:` breakpoints eliminates bloated media-query overrides.",
            keyPoints: [
              "Mobile-first breakpoint layering (`375px -> 768px -> 1280px`)",
              "Tailwind spacing scale, typography rhythm, and CSS variables",
              "Dark/light theming with CSS custom properties",
            ],
            practicalTip:
              "Use `clamp()` for hero display sizes so headings scale smoothly between phones and wide monitors.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s1-p1",
            title: "Responsive SaaS Product Landing Page",
            kind: "Build",
            detail: "Multi-section marketing layout adapting cleanly from 375px to 1440px.",
            focus: "CSS Grid, Flexbox, and fluid typography.",
          },
          {
            id: "web-s1-p2",
            title: "Accessible Developer Portfolio with Theme Toggle",
            kind: "Build",
            detail: "Semantic markup, keyboard focus styling, and CSS variable theming.",
            focus: "a11y landmarks and responsive navigation.",
          },
        ],
        outcome:
          "Build clean, accessible, responsive web interfaces across mobile, tablet, and desktop screens.",
      },
      {
        id: "web-s2",
        title: "Core JavaScript & Modern ES6+ Internals",
        duration: "Week 2 · 10 Hours",
        summary:
          "Understand how JavaScript actually executes—closures, prototypes, the event loop, async/await, and DOM APIs.",
        topics: [
          {
            id: "web-s2-t1",
            title: "Execution Context, Scope & Closures",
            tag: "Deep Dive",
            brief: "Lexical scope chains, hoisting/TDZ, and closure state retention.",
            explanation:
              "Closures happen when an inner function remembers variables from its outer lexical scope after the outer function finishes. They power React hooks, debounce helpers, and module privacy.",
            keyPoints: [
              "Global vs function vs block scope (`let`/`const` Temporal Dead Zone)",
              "How closures retain references (and avoiding stale-closure bugs)",
              "`this` binding rules and arrow function lexical `this`",
            ],
            practicalTip:
              "Expect a closure output-prediction question in nearly every frontend internship or fresher interview.",
          },
          {
            id: "web-s2-t2",
            title: "Event Loop, Promises & Async/Await",
            tag: "Deep Dive",
            brief: "Call stack, Web APIs, Microtask queue vs Macrotask queue.",
            explanation:
              "JavaScript is single-threaded yet non-blocking thanks to the Event Loop. Knowing that Promise microtasks drain BEFORE `setTimeout` callbacks makes async debugging straightforward.",
            keyPoints: [
              "Promise states (pending, fulfilled, rejected) and `Promise.all`",
              "Async/await syntactic sugar with `try / catch` error handling",
              "Microtask queue priority over timer macrotasks",
            ],
            practicalTip:
              "Run independent network requests concurrently with `Promise.all([a(), b()])` instead of awaiting sequentially.",
          },
          {
            id: "web-s2-t3",
            title: "Functional Arrays, DOM & Fetch APIs",
            tag: "Core",
            brief: "Immutable `map/filter/reduce`, event delegation, and network error checks.",
            explanation:
              "Clean data transformations with `map`, `filter`, and `reduce` prepare you directly for React rendering. Note that `fetch()` only rejects on network failure—not HTTP 404/500!",
            keyPoints: [
              "Non-mutating array transforms vs in-place `sort/splice`",
              "Event bubbling and delegation on dynamic lists",
              "Checking `if (!res.ok)` before parsing `res.json()`",
            ],
            practicalTip:
              "Always check `response.ok` after `fetch()`—a 500 Internal Server Error does not enter `catch` by itself.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s2-p1",
            title: "Kanban Task Board with LocalStorage",
            kind: "Build",
            detail: "Dynamic DOM updates, event delegation, and persistent state serialization.",
            focus: "Immutable state updates and DOM events.",
          },
          {
            id: "web-s2-p2",
            title: "Live Exchange Rate & Search Explorer",
            kind: "Build",
            detail: "Debounced search input fetching live APIs with loading/error states.",
            focus: "Async/await, debouncing, and HTTP error guards.",
          },
        ],
        outcome:
          "Write modern asynchronous JavaScript confidently and reason accurately about closures and the event loop.",
      },
      {
        id: "web-s3",
        title: "React.js Architecture & Hooks",
        duration: "Week 3 · 10 Hours",
        summary:
          "Build modular single-page applications with predictable unidirectional data flow, hooks, and client routing.",
        topics: [
          {
            id: "web-s3-t1",
            title: "Components, JSX & Immutable State",
            tag: "Core",
            brief: "Reconciliation, stable keys, lifting state, and pure rendering.",
            explanation:
              "React detects updates by comparing object references (`Object.is`). Mutating arrays or objects in place skips re-renders—always return new copies when updating state.",
            keyPoints: [
              "Designing small, composable components with clear prop contracts",
              "Why list `key` props must be stable IDs, never array indices on dynamic lists",
              "Deriving computed values during render instead of duplicating state",
            ],
            practicalTip:
              "If a value can be calculated from existing props or state, compute it inline—don't mirror it in `useState` + `useEffect`.",
          },
          {
            id: "web-s3-t2",
            title: "Hooks Lifecycle: useEffect, useRef & Custom Hooks",
            tag: "Pattern",
            brief: "Synchronizing external effects, cleanup functions, and avoiding stale state.",
            explanation:
              "`useEffect` is for synchronizing with external systems (timers, subscriptions, fetch), not chaining state updates. Extracting reusable hooks keeps UI components clean.",
            keyPoints: [
              "Dependency array rules and AbortController fetch cleanup",
              "Mutable refs (`useRef`) for DOM nodes and non-render values",
              "Extracting logic into custom hooks like `useDebounce` or `useFetch`",
            ],
            practicalTip:
              "Always clean up timers, listeners, or in-flight fetches inside the return function of `useEffect`.",
          },
          {
            id: "web-s3-t3",
            title: "Client-Side Routing & Performance Tuning",
            tag: "Architecture",
            brief: "React Router navigation, lazy routes, and memoization trade-offs.",
            explanation:
              "Nested routes, URL search params, and route-level code splitting make multi-view SPAs feel instantaneous while keeping URLs shareable.",
            keyPoints: [
              "Dynamic URL parameters (`/products/:id`) and query filters",
              "Code splitting heavy pages with `React.lazy` and `Suspense`",
              "When `useMemo` / `useCallback` actually help vs add overhead",
            ],
            practicalTip:
              "Keep filters and active tabs in URL query parameters so page reloads and shared links preserve view state.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s3-p1",
            title: "E-Commerce Storefront & Cart SPA",
            kind: "Build",
            detail: "Filterable catalog, URL-synced filters, and persistent cart state.",
            focus: "Component composition and derived state.",
          },
          {
            id: "web-s3-p2",
            title: "Movie & Series Explorer with Pagination",
            kind: "Build",
            detail: "Live API search with AbortController cancellation and detail routes.",
            focus: "Custom hooks and clean loading/empty/error UI.",
          },
        ],
        outcome:
          "Architect scalable React SPAs with clean component boundaries, bug-free hooks, and responsive client routing.",
      },
      {
        id: "web-s4",
        title: "Backend Engineering with Node.js & Express",
        duration: "Week 4 · 8 Hours",
        summary:
          "Design clean RESTful APIs, build composable middleware pipelines, validate requests, and centralize error handling.",
        topics: [
          {
            id: "web-s4-t1",
            title: "Node.js Runtime & Express Routing",
            tag: "Core",
            brief: "HTTP verbs, status codes, REST resource conventions, and modular routers.",
            explanation:
              "Well-structured REST APIs model nouns (resources) with standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`) and accurate status codes (`200`, `201`, `400`, `401`, `404`, `500`).",
            keyPoints: [
              "Separating routes, controllers, and service logic cleanly",
              "Parsing route params, query strings, and JSON request bodies",
              "Consistent JSON response envelopes and status semantics",
            ],
            practicalTip:
              "Never return `200 OK` with `{ error: 'Not found' }`—use proper `404` or `400` status codes so clients handle failures cleanly.",
          },
          {
            id: "web-s4-t2",
            title: "Middleware Pipeline & Centralized Error Handling",
            tag: "Architecture",
            brief: "Request logging, input validation (Zod), and 4-arg Express error handlers.",
            explanation:
              "Middleware functions inspect or enrich requests before hitting controllers. Centralizing error handling prevents duplicated try/catch boilerplate and avoids leaking stack traces in production.",
            keyPoints: [
              "Execution order of `app.use()` middleware and `next(err)` forwarding",
              "Schema validation at API boundaries before database writes",
              "Sanitizing error messages in production vs development",
            ],
            practicalTip:
              "Validate every incoming request body with a schema validator at the boundary—never trust client payloads.",
          },
          {
            id: "web-s4-t3",
            title: "Security Headers, CORS & Environment Config",
            tag: "Tooling",
            brief: "Origin allowlists, Helmet headers, rate limiting, and `.env` hygiene.",
            explanation:
              "Browsers block cross-origin API calls by default unless the server returns explicit CORS headers. Configuring strict origin allowlists and Helmet headers locks down basic attack vectors.",
            keyPoints: [
              "Configuring `cors({ origin, credentials: true })` properly",
              "Hardening HTTP headers with `helmet` and basic rate limiting",
              "Managing secrets safely via `.env` (and never committing them to Git)",
            ],
            practicalTip:
              "Wildcard `origin: '*'` breaks cookie-based auth—always specify your exact frontend domain in CORS.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s4-p1",
            title: "Campus Notes & Resource Sharing REST API",
            kind: "Build",
            detail: "Full CRUD endpoints with pagination, filtering, and schema validation.",
            focus: "Layered controllers, validation, and status codes.",
          },
        ],
        outcome:
          "Design, validate, and document secure REST APIs in Node.js and Express.",
      },
      {
        id: "web-s5",
        title: "Databases & Data Modeling (MongoDB)",
        duration: "Week 5 · 10 Hours",
        summary:
          "Model real-world entities cleanly, choose embedding vs referencing, build aggregation pipelines, and optimize queries with indexes.",
        topics: [
          {
            id: "web-s5-t1",
            title: "Schema Design: Embedding vs Referencing",
            tag: "Architecture",
            brief: "Mongoose schemas, validation, 1-to-many modeling, and populate.",
            explanation:
              "Document databases let you embed tightly coupled sub-documents or reference independent collections via ObjectIds. Choosing wisely avoids unbounded arrays and slow multi-step joins.",
            keyPoints: [
              "Embedding small bounded data vs referencing growing collections",
              "Enforcing strict schema constraints, defaults, and enums",
              "Populating references cleanly without N+1 query explosions",
            ],
            practicalTip:
              "Never embed an unbounded array (like all comments on a viral post) directly inside a parent document—give it its own collection.",
          },
          {
            id: "web-s5-t2",
            title: "Indexes, Query Plans & Pagination",
            tag: "Deep Dive",
            brief: "Compound indexes, ESR rule, explain() plans, and cursor pagination.",
            explanation:
              "Without indexes, MongoDB performs full collection scans (`COLLSCAN`) that grind apps to a halt as data grows. Adding targeted compound indexes makes lookups O(log n).",
            keyPoints: [
              "Single-field, compound, and unique indexes",
              "Checking `.explain('executionStats')` for `IXSCAN` vs `COLLSCAN`",
              "Offset (`skip/limit`) vs cursor-based pagination performance",
            ],
            practicalTip:
              "Every field you frequently filter or sort by (`userId`, `email`, `createdAt`) deserves an intentional index.",
          },
          {
            id: "web-s5-t3",
            title: "Aggregation Pipelines & Transactions",
            tag: "Core",
            brief: "`$match`, `$group`, `$lookup`, and atomic multi-document writes.",
            explanation:
              "Aggregation pipelines transform and summarize data right inside the database engine rather than pulling thousands of records into Node.js memory.",
            keyPoints: [
              "Filtering early with `$match` before `$group` and `$sort`",
              "Computing analytics counts, averages, and leaderboards",
              "Using ACID sessions when updating two balances atomically",
            ],
            practicalTip:
              "Always place `$match` and `$limit` as early as possible in an aggregation pipeline to shrink working data.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s5-p1",
            title: "Multi-Tenant Campus Forum Schema & API",
            kind: "Build",
            detail: "Posts, nested replies, vote counts, and indexed tag search.",
            focus: "Referencing, compound indexes, and aggregations.",
          },
          {
            id: "web-s5-p2",
            title: "College Event Registration & Ticketing Engine",
            kind: "Build",
            detail: "Prevent overbooking seat capacity with atomic conditional updates.",
            focus: "Concurrency-safe database updates.",
          },
        ],
        outcome:
          "Design scalable schemas, write fast indexed queries, and prevent race conditions on concurrent updates.",
      },
      {
        id: "web-s6",
        title: "Authentication, Authorization & Web Security",
        duration: "Week 6 · 8 Hours",
        summary:
          "Secure applications end-to-end with password hashing, HTTP-only JWT cookies, role guards, and OWASP defenses.",
        topics: [
          {
            id: "web-s6-t1",
            title: "Password Hashing & Credential Safety",
            tag: "Core",
            brief: "Salting, bcrypt/Argon2 cost factors, and constant-time checks.",
            explanation:
              "Plaintext or fast SHA-256 passwords can be cracked in seconds if leaked. Salted adaptive hashing functions like `bcrypt` intentionally consume CPU time to defeat brute-force attacks.",
            keyPoints: [
              "Why encryption is two-way whereas password hashing is one-way + salted",
              "Returning generic 'Invalid credentials' messages to prevent account enumeration",
              "Never selecting `passwordHash` in default API queries",
            ],
            practicalTip:
              "Set `select: false` on password fields in Mongoose schemas so user queries never leak hashes by mistake.",
          },
          {
            id: "web-s6-t2",
            title: "JWT Tokens, Refresh Rotation & HTTP-Only Cookies",
            tag: "Architecture",
            brief: "Stateless access tokens, cookie flags, and XSS/CSRF mitigation.",
            explanation:
              "Storing JWTs in `localStorage` exposes them to any malicious XSS script. Storing short-lived tokens in `HttpOnly`, `Secure`, `SameSite` cookies dramatically shrinks attack surfaces.",
            keyPoints: [
              "JWT Anatomy: Header, Payload, Signature (signed, NOT encrypted!)",
              "Short-lived Access Tokens + Refresh Token revocation flows",
              "Protecting React routes vs enforcing real authorization on the server",
            ],
            practicalTip:
              "Frontend route guards only improve UX—true authorization MUST happen inside Express middleware on every protected endpoint.",
          },
          {
            id: "web-s6-t3",
            title: "RBAC & Email Verification Flows",
            tag: "Tooling",
            brief: "Student/Faculty/Admin permissions and hashed one-time reset tokens.",
            explanation:
              "Role-Based Access Control ensures students cannot hit admin endpoints, while ownership checks verify users only edit their own records.",
            keyPoints: [
              "Building reusable `requireRole('admin')` middleware",
              "Resource ownership verification (`doc.authorId.equals(req.user.id)`)",
              "Expiring OTP / password reset links via Nodemailer",
            ],
            practicalTip:
              "Check BOTH role and ownership—even an authenticated user shouldn't delete someone else's post.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s6-p1",
            title: "Role-Based Auth Microservice & Protected Dashboard",
            kind: "Build",
            detail: "Signup, login, HTTP-only cookie JWT, RBAC guards, and password reset.",
            focus: "Cookie flags, bcrypt, and server-side RBAC.",
          },
        ],
        outcome:
          "Implement production authentication workflows and defend full-stack apps against OWASP Top 10 flaws.",
      },
      {
        id: "web-s7",
        title: "Full-Stack Integration & Cloud Deployment",
        duration: "Week 7 · 8 Hours",
        summary:
          "Wire React and Express seamlessly, manage server/client state, integrate cloud file storage, and ship to production with CI/CD.",
        topics: [
          {
            id: "web-s7-t1",
            title: "Client-Server Integration & Global State",
            tag: "Architecture",
            brief: "Shared API clients, auth context/Zustand, and optimistic UX.",
            explanation:
              "Clean frontend architecture separates server data fetching/caching from light UI state (like theme or sidebar open) in Context or Zustand.",
            keyPoints: [
              "Centralized API wrapper handling base URLs, cookies, and 401 redirects",
              "Keeping client state lean with Zustand or Context",
              "Consistent loading skeletons, optimistic updates, and toast feedback",
            ],
            practicalTip:
              "Keep a single API helper module instead of scattering raw `fetch` URLs across 20 components.",
          },
          {
            id: "web-s7-t2",
            title: "Cloud File Uploads (Cloudinary / S3)",
            tag: "Tooling",
            brief: "Multipart streams, file type/size validation, and CDN URLs.",
            explanation:
              "Never store user uploads on ephemeral server disks—containers wipe local disks on redeploy. Stream validated files directly to object storage or Cloudinary.",
            keyPoints: [
              "Validating MIME types and max file size before upload",
              "Handling `multipart/form-data` or direct pre-signed upload URLs",
              "Storing lightweight CDN URLs in MongoDB",
            ],
            practicalTip:
              "Always restrict allowed extensions and byte size on the server—client `<input accept>` attributes can be bypassed in 2 seconds.",
          },
          {
            id: "web-s7-t3",
            title: "Vercel, Render & GitHub Actions CI/CD",
            tag: "Tooling",
            brief: "Production builds, environment variables, SPA rewrites, and automated checks.",
            explanation:
              "Deployment finishes the engineering loop. Setting up SPA fallback rewrites, health-check endpoints, and automated build checks on pull requests mimics real team workflows.",
            keyPoints: [
              "Hosting React/Vite on Vercel with SPA fallback routing",
              "Deploying Express APIs to Render/Railway connected to MongoDB Atlas",
              "GitHub Actions workflow running typecheck and build on every push",
            ],
            practicalTip:
              "Add a lightweight `GET /health` endpoint on your backend for deployment monitors and uptime checks.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "web-s7-p1",
            title: "Live End-to-End Cloud Deployment & CI Pipeline",
            kind: "Build",
            detail: "Connect Vercel frontend, Render API, MongoDB Atlas, and GitHub Actions CI.",
            focus: "Production env configs, CORS, and automated build verification.",
          },
        ],
        outcome:
          "Ship live full-stack applications to public cloud URLs backed by automated CI/CD checks.",
      },
      {
        id: "web-s8",
        title: "Capstone Showcase & Developer Interviews",
        duration: "Week 8 · 6 Hours",
        summary:
          "Polish your flagship project documentation, diagram your system architecture, and defend technical decisions in mock interviews.",
        topics: [
          {
            id: "web-s8-t1",
            title: "Architecture Docs & GitHub Readiness",
            tag: "Tooling",
            brief: "Clear README diagrams, env templates, and live demo accounts.",
            explanation:
              "Recruiters spend 30 seconds inspecting a project repo. A crisp README with architecture diagram, setup guide, and seeded demo credentials turns clicks into interviews.",
            keyPoints: [
              "Writing concise architecture summaries explaining WHY you chose each tool",
              "Providing `.env.example` and seeded demo credentials",
              "Eliminating dead buttons, console errors, and broken mobile views",
            ],
            practicalTip:
              "Include a 1-click guest/demo login button on your deployed portfolio projects so busy recruiters can test immediately.",
          },
          {
            id: "web-s8-t2",
            title: "Full-Stack Interview Defense",
            tag: "Core",
            brief: "Explaining request lifecycles, CORS, auth trade-offs, and scaling.",
            explanation:
              "Interviewers love probing your own project: 'Walk me through what happens from clicking Submit to saving in MongoDB, and how would you scale it 100x?'",
            keyPoints: [
              "Tracing full browser -> DNS -> TLS -> React -> Express -> DB flow",
              "Explaining indexing, caching, and pagination bottlenecks",
              "Answering JS closure, React re-render, and HTTP security deep-dives",
            ],
            practicalTip:
              "Know one thing you would improve or refactor in your capstone project—self-awareness stands out immediately.",
          },
        ],
        practiceLabel: "CAPSTONE & MOCKS",
        practice: [
          {
            id: "web-s8-p1",
            title: "Flagship Full-Stack Capstone Production Launch",
            kind: "Build",
            detail: "Publicly deployed, responsive, authenticated MERN application with crisp README.",
            focus: "Polish, reliability, and architectural clarity.",
          },
          {
            id: "web-s8-p2",
            title: "Live Full-Stack Mock Interview Defense",
            kind: "Assessment",
            detail: "Architecture walkthrough + live JS/React/Backend Q&A with mentor review.",
            focus: "Technical storytelling and trade-off justification.",
          },
        ],
        outcome:
          "Graduate with live deployed projects on your resume and the clarity to defend full-stack systems in interviews.",
      },
    ],
  },
  {
    slug: "machine-learning",
    code: "03 / APPLIED AI & DATA SCIENCE",
    name: "AI & Machine Learning",
    shortName: "AI / ML",
    duration: "8 Weeks · 60+ Hours",
    problemsCount: "3 End-to-End ML Apps",
    prerequisites: "Basic Python familiarity & high-school algebra",
    target: "AI Engineer, Data Scientist & ML Roles",
    icon: BrainCircuit,
    intro:
      "A practical roadmap from NumPy vectorization, feature engineering, and classical Scikit-Learn ensembles to PyTorch neural networks and live web model deployment.",
    destinationTitle: "Applied ML & AI Builder",
    destinationSummary:
      "Clean messy real-world datasets, train and rigorously validate predictive models, and deploy interactive AI web apps recruiters can test live.",
    stages: [
      {
        id: "ml-s1",
        title: "Numerical Python, Pandas & Data Visualization",
        duration: "Week 1 · 8 Hours",
        summary:
          "Manipulate multi-dimensional arrays rapidly with NumPy vectorization and wrangle messy tabular datasets in Pandas.",
        topics: [
          {
            id: "ml-s1-t1",
            title: "NumPy Arrays, Vectorization & Broadcasting",
            tag: "Core",
            brief: "Replace slow Python loops with C-backed vectorized tensor math.",
            explanation:
              "Machine learning runs on matrix math. NumPy stores contiguous typed buffers in memory, allowing vectorized operations 50–100x faster than Python `for` loops.",
            keyPoints: [
              "Array shapes, axis indexing (`axis=0` vs `axis=1`), and reshaping",
              "Broadcasting rules across mismatched dimensions",
              "Dot products and matrix multiplication (`@`) intuition",
            ],
            practicalTip:
              "Whenever you catch yourself writing a nested loop over rows and columns in ML code, look for a NumPy vectorized operation.",
          },
          {
            id: "ml-s1-t2",
            title: "Pandas DataFrames & Messy Data Cleaning",
            tag: "Core",
            brief: "Indexing (`loc`/`iloc`), `groupby`, merges, and missing-value hygiene.",
            explanation:
              "80% of real ML engineering happens before calling `.fit()`. Mastering filtering, type casting, deduplication, and `groupby` aggregations unlocks raw CSV/SQL data.",
            keyPoints: [
              "Label-based `.loc` vs positional `.iloc` selection",
              "Handling nulls, malformed strings, and duplicate rows safely",
              "Aggregating cohort metrics with `groupby` and pivot tables",
            ],
            practicalTip:
              "Always call `df.info()` and `df.isna().sum()` first on a new dataset—never assume columns are numeric or clean.",
          },
          {
            id: "ml-s1-t3",
            title: "Diagnostic Plots with Matplotlib & Seaborn",
            tag: "Tooling",
            brief: "Histograms, boxplots, scatter plots, and correlation heatmaps.",
            explanation:
              "Charts expose skewed distributions, data entry bugs, and hidden class imbalances that raw summary averages like `mean()` hide.",
            keyPoints: [
              "Checking skewed tails with histograms and KDE plots",
              "Spotting outliers with boxplots and violin plots",
              "Inspecting feature relationships via pairplots and heatmaps",
            ],
            practicalTip:
              "Plot before modeling—one quick histogram often catches impossible values like negative ages or placeholder `9999` entries.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s1-p1",
            title: "Campus Placement Dataset Deep-Dive EDA",
            kind: "Build",
            detail: "Clean raw student records and surface key hiring drivers visually.",
            focus: "Pandas cleaning, grouping, and Seaborn storytelling.",
          },
          {
            id: "ml-s1-p2",
            title: "Vectorized Financial Time-Series Analyzer",
            kind: "Build",
            detail: "Compute rolling volatility and returns with zero Python row loops.",
            focus: "NumPy broadcasting and rolling DataFrame windows.",
          },
        ],
        outcome:
          "Load, audit, clean, and visualize messy real-world datasets quickly and accurately.",
      },
      {
        id: "ml-s2",
        title: "Exploratory Analysis & Feature Engineering",
        duration: "Week 2 · 8 Hours",
        summary:
          "Convert raw fields into high-signal model inputs while strictly guarding against train-test data leakage.",
        topics: [
          {
            id: "ml-s2-t1",
            title: "Train/Test Splitting & Data Leakage Prevention",
            tag: "Deep Dive",
            brief: "Why scaling or imputing before splitting invalidates accuracy.",
            explanation:
              "If you compute `mean` or `StandardScaler` on the full dataset before splitting, test-set statistics leak into training—producing fake optimism that fails in production.",
            keyPoints: [
              "Stratified splits preserving target class ratios",
              "Wrapping imputers, scalers, and models inside `sklearn.pipeline.Pipeline`",
              "Handling time-ordered datasets with chronological splits instead of random shuffling",
            ],
            practicalTip:
              "Use Scikit-Learn `Pipeline` + `ColumnTransformer` religiously—it makes leakage structurally impossible.",
          },
          {
            id: "ml-s2-t2",
            title: "Outliers, Skewness & Feature Scaling",
            tag: "Pattern",
            brief: "IQR/Z-score clipping, log transforms, MinMax vs StandardScaler.",
            explanation:
              "Distance- and gradient-based models (KNN, Linear/Logistic Regression, Neural Nets) break when one feature ranges 0–100,000 while another ranges 0–1.",
            keyPoints: [
              "Standardization (zero mean, unit variance) vs Min-Max normalization",
              "Taming heavy right-skewed targets (prices, incomes) with `log1p`",
              "Tree models are scale-invariant; distance/gradient models are NOT",
            ],
            practicalTip:
              "Ask in interviews: 'Does Random Forest need feature scaling?' Answer: No, because threshold splits are monotonic-invariant.",
          },
          {
            id: "ml-s2-t3",
            title: "Categorical Encoding & Domain Features",
            tag: "Core",
            brief: "One-Hot vs Ordinal vs Target encoding and high-cardinality handling.",
            explanation:
              "Raw strings must become meaningful numbers without inventing fake ordinal order (e.g., turning Delhi=1, Mumbai=2, Pune=3 misleads linear models).",
            keyPoints: [
              "One-Hot Encoding (`handle_unknown='ignore'`) for nominal categories",
              "Ordinal encoding strictly for ranked categories (Low < Med < High)",
              "Engineering ratios, interaction terms, and date parts (day-of-week, weekend)",
            ],
            practicalTip:
              "Always pass `handle_unknown='ignore'` to `OneHotEncoder` so unseen test categories never crash live inference.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s2-p1",
            title: "Leak-Free Housing Price Feature Pipeline",
            kind: "Build",
            detail: "ColumnTransformer handling numeric skew, missing values, and unseen categories.",
            focus: "Pipeline encapsulation and log-target transforms.",
          },
        ],
        outcome:
          "Build leak-free, reproducible Scikit-Learn preprocessing pipelines ready for any model family.",
      },
      {
        id: "ml-s3",
        title: "Supervised Learning — Regression & Optimization",
        duration: "Week 3 · 8 Hours",
        summary:
          "Build geometric intuition for linear models, cost landscapes, gradient descent, bias-variance balance, and regularization.",
        topics: [
          {
            id: "ml-s3-t1",
            title: "Linear Regression, MSE & Gradient Descent",
            tag: "Core",
            brief: "Hyperplane fitting, residuals, learning rate, and convergence.",
            explanation:
              "Gradient Descent is the optimization heartbeat of ML and Deep Learning: compute the slope of the loss function and step downhill proportionally to the learning rate.",
            keyPoints: [
              "Loss surface intuition and why learning rate too high diverges",
              "Comparing Ordinary Least Squares vs iterative Gradient Descent",
              "Checking residual plots for non-linear patterns",
            ],
            practicalTip:
              "Always train a dead-simple Linear/Dummy baseline first so you know if complex models actually add value.",
          },
          {
            id: "ml-s3-t2",
            title: "Bias-Variance Trade-off & Regularization",
            tag: "Deep Dive",
            brief: "Underfitting vs overfitting and L1 (Lasso) vs L2 (Ridge) penalties.",
            explanation:
              "Complex models memorize training noise (high variance); overly rigid models miss real patterns (high bias). Regularization penalizes oversized weights to stabilize generalization.",
            keyPoints: [
              "Diagnosing high bias vs high variance from train vs validation error curves",
              "L2 Ridge shrinking weights smoothly vs L1 Lasso zeroing irrelevant features",
              "ElasticNet combining L1 + L2 penalties",
            ],
            practicalTip:
              "When training accuracy is 99% and validation accuracy is 72%, you have high variance—regularize, simplify, or add data.",
          },
          {
            id: "ml-s3-t3",
            title: "Regression Error Metrics (MAE, RMSE, R²)",
            tag: "Tooling",
            brief: "Choosing outlier-sensitive RMSE vs median-robust MAE.",
            explanation:
              "Because MSE/RMSE squares errors, a single huge prediction error dominates the score. Choosing the right metric depends on business cost of large outliers.",
            keyPoints: [
              "Interpreting RMSE in original target units",
              "When MAE beats RMSE on skewed datasets with outliers",
              "Why Adjusted R² prevents adding useless features",
            ],
            practicalTip:
              "Explain metrics in unit terms ('within ±₹45,000 RMSE') rather than abstract numbers.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s3-p1",
            title: "Used Car & Medical Cost Predictor",
            kind: "Build",
            detail: "Compare Linear, Ridge, and Lasso pipelines with residual diagnostics.",
            focus: "Regularization tuning and metric selection.",
          },
        ],
        outcome:
          "Diagnose overfitting vs underfitting accurately and tune regularized regression models.",
      },
      {
        id: "ml-s4",
        title: "Supervised Learning — Classification & Metrics",
        duration: "Week 4 · 10 Hours",
        summary:
          "Master decision boundaries, probabilistic classifiers, and precision/recall trade-offs on imbalanced real-world data.",
        topics: [
          {
            id: "ml-s4-t1",
            title: "Logistic Regression & Probabilistic Boundaries",
            tag: "Core",
            brief: "Sigmoid probabilities, log-loss, and decision threshold tuning.",
            explanation:
              "Despite its name, Logistic Regression is a classifier mapping linear scores through the Sigmoid curve into calibrated probabilities between 0 and 1.",
            keyPoints: [
              "Log-loss (binary cross-entropy) intuition",
              "Adjusting probability thresholds away from default 0.5 for asymmetric costs",
              "Multi-class Softmax probabilities",
            ],
            practicalTip:
              "Default `0.5` probability threshold is rarely optimal in fraud or medical screening—tune threshold on precision-recall curves.",
          },
          {
            id: "ml-s4-t2",
            title: "Decision Trees, KNN & Naive Bayes",
            tag: "Pattern",
            brief: "Gini impurity/entropy splits, distance sensitivity, and Bayes baselines.",
            explanation:
              "Decision trees carve axis-aligned boxes recursively using impurity reduction. Left unconstrained, a single tree memorizes every training sample—setting up ensembles next week.",
            keyPoints: [
              "Information Gain (Entropy) vs Gini Impurity splitting criteria",
              "Controlling overfitting via `max_depth` and `min_samples_leaf`",
              "Curse of dimensionality in KNN distance metrics",
            ],
            practicalTip:
              "Always constrain `max_depth` on single Decision Trees; unconstrained trees reach 100% train accuracy and overfit badly.",
          },
          {
            id: "ml-s4-t3",
            title: "Confusion Matrix, Precision, Recall & ROC-AUC",
            tag: "Deep Dive",
            brief: "Why accuracy lies on imbalanced data and how to choose F1 vs PR-AUC.",
            explanation:
              "If only 1% of transactions are fraud, predicting 'safe' every time scores 99% accuracy while missing 100% of fraud. Precision, Recall, F1, and PR-AUC reveal the truth.",
            keyPoints: [
              "Precision (false-alarm control) vs Recall (missed-positive control)",
              "ROC-AUC vs Precision-Recall AUC under severe class imbalance",
              "Class weights (`class_weight='balanced'`) vs SMOTE oversampling inside CV folds",
            ],
            practicalTip:
              "Never apply SMOTE before splitting cross-validation folds—oversample strictly inside each training fold!",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s4-p1",
            title: "Imbalanced Credit Card Fraud Detector",
            kind: "Build",
            detail: "Optimize Recall & PR-AUC using class weights and threshold calibration.",
            focus: "Imbalanced metrics and confusion matrix trade-offs.",
          },
          {
            id: "ml-s4-p2",
            title: "Student Placement Readiness Classifier",
            kind: "Build",
            detail: "Compare Logistic Regression, KNN, and constrained Decision Trees.",
            focus: "Probability calibration and feature interpretability.",
          },
        ],
        outcome:
          "Evaluate classifiers beyond raw accuracy and pick the exact metric aligned with real-world error costs.",
      },
      {
        id: "ml-s5",
        title: "Ensemble Learning & Gradient Boosting",
        duration: "Week 5 · 10 Hours",
        summary:
          "Master Random Forests and Gradient Boosted Trees (XGBoost, LightGBM)—the dominant workhorses for tabular industry ML.",
        topics: [
          {
            id: "ml-s5-t1",
            title: "Bagging & Random Forests",
            tag: "Pattern",
            brief: "Bootstrap aggregation + random feature subsets to slash variance.",
            explanation:
              "Averaging hundreds of diverse trees trained on bootstrap samples and random feature subsets keeps low bias while dramatically stabilizing predictions.",
            keyPoints: [
              "How bagging reduces variance without raising bias",
              "Out-of-Bag (OOB) validation error intuition",
              "Permutation importance vs biased impurity importance",
            ],
            practicalTip:
              "Use Permutation Importance on the validation set rather than default `.feature_importances_` when reporting key drivers.",
          },
          {
            id: "ml-s5-t2",
            title: "Gradient Boosting, XGBoost & LightGBM",
            tag: "Deep Dive",
            brief: "Sequential residual correction, shrinkage (`learning_rate`), and early stopping.",
            explanation:
              "While Random Forests build trees independently in parallel, Boosting builds trees sequentially—each new tree focuses on correcting the residual errors of all prior trees.",
            keyPoints: [
              "Sequential additive training on gradients/residuals",
              "Balancing `n_estimators`, `learning_rate`, and `max_depth`",
              "Preventing boosting overfitting with validation `early_stopping_rounds`",
            ],
            practicalTip:
              "On structured tabular datasets, start with LightGBM/XGBoost + clean features before reaching for complex deep networks.",
          },
          {
            id: "ml-s5-t3",
            title: "Cross-Validation & Hyperparameter Tuning",
            tag: "Tooling",
            brief: "Stratified K-Fold, RandomizedSearchCV, and avoiding validation overfitting.",
            explanation:
              "A single 80/20 split can be lucky or unlucky. K-Fold cross-validation evaluates across K held-out partitions, while RandomizedSearch explores tuning grids efficiently.",
            keyPoints: [
              "Stratified K-Fold vs GroupKFold (for repeated users/entities)",
              "Why `RandomizedSearchCV` beats exhaustive `GridSearchCV` in high dimensions",
              "Holding out a final untouched test set until all tuning finishes",
            ],
            practicalTip:
              "If multiple rows belong to the same user or patient, use `GroupKFold` so the same user never sits in both train and validation.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s5-p1",
            title: "Customer Churn Prediction with XGBoost",
            kind: "Build",
            detail: "Stratified K-Fold pipeline with early stopping and permutation importance.",
            focus: "Boosting hyperparameters and business lift.",
          },
        ],
        outcome:
          "Train competitive tabular ML ensembles with sound cross-validation and hyperparameter discipline.",
      },
      {
        id: "ml-s6",
        title: "Unsupervised Learning & Dimensionality Reduction",
        duration: "Week 6 · 8 Hours",
        summary:
          "Uncover hidden segments in unlabeled data with clustering and compress high-dimensional spaces using PCA.",
        topics: [
          {
            id: "ml-s6-t1",
            title: "K-Means Clustering & Silhouette Evaluation",
            tag: "Core",
            brief: "Centroid updates, K-Means++ initialization, Elbow Method, and Silhouette.",
            explanation:
              "When labels don't exist, K-Means partitions points into K spherical clusters by alternating centroid assignment and re-centering. Scaling features beforehand is mandatory!",
            keyPoints: [
              "Why unscaled features distort Euclidean cluster assignments",
              "Choosing K using both Elbow inertia plots and Silhouette scores",
              "Hierarchical dendrograms and DBSCAN density clustering contrast",
            ],
            practicalTip:
              "Always standardize numeric columns before K-Means; otherwise salary in lakhs completely drowns out age.",
          },
          {
            id: "ml-s6-t2",
            title: "Principal Component Analysis (PCA)",
            tag: "Deep Dive",
            brief: "Orthogonal variance projection, explained variance ratio, and noise reduction.",
            explanation:
              "PCA rotates correlated features onto new uncorrelated principal axes ordered by variance captured—compressing dimensions while keeping maximum signal.",
            keyPoints: [
              "Standardizing inputs before computing covariance eigenvectors",
              "Choosing N components via cumulative explained variance (e.g. 95%)",
              "Visualizing multi-dimensional clusters in 2D scatter plots",
            ],
            practicalTip:
              "Remember that PCA components are linear combinations of original features—great for compression, harder to explain to business teams.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s6-p1",
            title: "E-Commerce Customer Segmentation Engine",
            kind: "Build",
            detail: "RFM features + StandardScaler + K-Means + PCA 2D cluster visualization.",
            focus: "Cluster profiling and silhouette validation.",
          },
        ],
        outcome:
          "Discover interpretable structure in unlabeled data and compress correlated high-dimensional features.",
      },
      {
        id: "ml-s7",
        title: "Deep Learning Foundations & PyTorch",
        duration: "Week 7 · 8 Hours",
        summary:
          "Bridge classical ML into Deep Learning: multi-layer perceptrons, non-linear activations, backpropagation, and PyTorch training loops.",
        topics: [
          {
            id: "ml-s7-t1",
            title: "Perceptrons, Activations & Backpropagation",
            tag: "Core",
            brief: "Forward pass, ReLU/Sigmoid/Softmax, loss functions, and chain rule.",
            explanation:
              "Without non-linear activations like ReLU, stacking 10 linear layers mathematically collapses into a single linear regression. Backpropagation applies the chain rule backwards to update every weight.",
            keyPoints: [
              "Why ReLU resolves vanishing gradients compared to Sigmoid in hidden layers",
              "Matching output activations and losses (BCEWithLogits vs CrossEntropyLoss)",
              "Adam optimizer, mini-batch SGD, and dropout regularization",
            ],
            practicalTip:
              "In PyTorch, pass raw logits directly to `CrossEntropyLoss`—don't apply `Softmax` twice!",
          },
          {
            id: "ml-s7-t2",
            title: "PyTorch Tensors, Autograd & Training Loops",
            tag: "Tooling",
            brief: "`nn.Module`, `Dataset/DataLoader`, `zero_grad -> backward -> step`.",
            explanation:
              "Writing an explicit PyTorch training loop demystifies deep learning completely and prepares you for CNNs, Transformers, and custom architectures.",
            keyPoints: [
              "Tensor shapes, device placement (`cpu`/`cuda`), and gradient tracking",
              "Batching and shuffling with `Dataset` and `DataLoader`",
              "Switching between `model.train()` and `model.eval()` with `torch.no_grad()`",
            ],
            practicalTip:
              "Forgetting `optimizer.zero_grad()` accumulates gradients across batches—one of the top beginner PyTorch bugs.",
          },
        ],
        practiceLabel: "HANDS-ON BUILDS",
        practice: [
          {
            id: "ml-s7-p1",
            title: "Digit Recognition Classifier (MNIST) in PyTorch",
            kind: "Build",
            detail: "Custom `nn.Module` MLP with DataLoader, validation loop, and loss curves.",
            focus: "Clean PyTorch train/eval separation.",
          },
          {
            id: "ml-s7-p2",
            title: "Customer Review Sentiment Classifier",
            kind: "Build",
            detail: "Text tokenization/embeddings feeding a PyTorch binary neural classifier.",
            focus: "BCEWithLogitsLoss and generalization tracking.",
          },
        ],
        outcome:
          "Build, train, debug, and evaluate custom neural networks cleanly from scratch in PyTorch.",
      },
      {
        id: "ml-s8",
        title: "Model Serving, FastAPI & Interactive AI Apps",
        duration: "Week 8 · 6 Hours",
        summary:
          "Move beyond Jupyter Notebooks: serialize full pipelines, wrap models in FastAPI endpoints, and ship live interactive web UIs.",
        topics: [
          {
            id: "ml-s8-t1",
            title: "Pipeline Serialization & Inference Parity",
            tag: "Architecture",
            brief: "Saving `joblib`/PyTorch weights together with exact preprocessing transforms.",
            explanation:
              "Most notebook-to-production bugs happen from training-serving skew: encoding or scaling user inputs differently in production than during training. Saving the full `Pipeline` guarantees parity.",
            keyPoints: [
              "Exporting unified Scikit-Learn `Pipeline` artifacts via `joblib`",
              "Saving PyTorch `state_dict()` and pinned dependency versions",
              "Writing smoke tests confirming identical predictions post-reload",
            ],
            practicalTip:
              "Save your scaler + encoder + model as ONE `joblib` pipeline—never serialize only the classifier alone.",
          },
          {
            id: "ml-s8-t2",
            title: "FastAPI Inference Endpoints & Streamlit UIs",
            tag: "Tooling",
            brief: "Pydantic request validation, live web apps, and HuggingFace/Streamlit deploy.",
            explanation:
              "Recruiters won't run a `.ipynb` file on their laptop—but they WILL click a live web URL. Wrapping models behind FastAPI or Streamlit turns notebooks into demonstrable products.",
            keyPoints: [
              "Typed Pydantic input validation returning calibrated prediction + confidence",
              "Interactive Streamlit dashboards with real-time parameter sliders",
              "Deploying to Streamlit Cloud / HuggingFace Spaces with public URLs",
            ],
            practicalTip:
              "Load the serialized model once on FastAPI startup—never reload the model file inside every HTTP request handler.",
          },
        ],
        practiceLabel: "CAPSTONE DEPLOYMENTS",
        practice: [
          {
            id: "ml-s8-p1",
            title: "Live Placement Predictor Web App (Streamlit + Cloud)",
            kind: "Build",
            detail: "Interactive live prediction UI backed by your serialized Scikit-Learn pipeline.",
            focus: "End-to-end training-to-UI parity.",
          },
          {
            id: "ml-s8-p2",
            title: "FastAPI ML Inference Microservice",
            kind: "Build",
            detail: "Validated JSON `/predict` endpoint with Swagger docs and cloud hosting.",
            focus: "Pydantic validation and startup artifact loading.",
          },
        ],
        outcome:
          "Deliver deployed, interactive AI web applications that anyone can test live in their browser.",
      },
    ],
  },
]

export function getProgramForPath(pathname: string): Program | undefined {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const match = normalized.match(/^\/(?:programs|courses)(?:\/([^/]+))?$/)
  if (!match) return undefined
  const slug = match[1]
  if (!slug) return programs[1] // default to DSA if visiting /programs or /courses directly
  return programs.find((program) => program.slug === slug)
}
