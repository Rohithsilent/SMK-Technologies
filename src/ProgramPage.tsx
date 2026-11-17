import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  BrainCircuit,
  PanelsTopLeft,
  Calendar,
  Layers,
  Award,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandSignature from "@/components/BrandSignature"
import RoadmapExplorer from "./RoadmapExplorer"
import CelestialAtmosphere from "@/components/CelestialAtmosphere"
import ThemeToggle from "@/components/ThemeToggle"

export type RoadmapStage = {
  title: string
  duration: string
  summary: string
  topics: string[]
  practice: string[]
  practiceLabel?: string
  outcome: string
}

export type RoadmapCheckpoint = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type Program = {
  slug: string
  code: string
  name: string
  shortName: string
  duration: string
  problemsCount: string
  mode: string
  target: string
  icon: typeof Code2
  intro: string
  promise: string
  audience: string
  prerequisites: string
  skills: string[]
  pillars: {
    number: string
    title: string
    description: string
  }[]
  stages: RoadmapStage[]
  checkpoints: RoadmapCheckpoint[]
  faqs: {
    question: string
    answer: string
  }[]
}

const programs: Program[] = [
  {
    slug: "python",
    code: "00 / CORE PROGRAMMING",
    name: "Python Programming & Logic",
    shortName: "Python",
    duration: "6 Weeks · 45+ Hours Live",
    problemsCount: "120+ Coding Challenges",
    mode: "Campus Bootcamps & Live Online",
    target: "Campus Placement Coding Rounds & Automation",
    audience: "Engineering students from any branch (CSE, IT, ECE, Mechanical, Civil) wanting strong coding fundamentals.",
    prerequisites: "Zero coding experience required. We start from absolute scratch.",
    icon: Terminal,
    intro: "Master Python programming from zero-to-one fundamentals to object-oriented programming, file handling, automation, and placement interview problem solving.",
    promise: "A beginner-to-advanced hands-on journey that turns complete beginners into confident programmers ready to build real tools and tackle coding tests.",
    skills: ["Python 3.12 Fundamentals", "Object-Oriented Programming (OOP)", "Data Structures (Lists, Dicts, Sets)", "File I/O & Exception Handling", "Campus Placement Logic Drills"],
    pillars: [
      {
        number: "01",
        title: "Syntax to Mental Models",
        description: "Understand variables, memory references, control flow, and functions with clear visual diagrams and zero unnecessary jargon."
      },
      {
        number: "02",
        title: "Hands-On Logic Building",
        description: "Solve 120+ graded programming challenges. Master pattern printing, string manipulation, recursion, and algorithm translation."
      },
      {
        number: "03",
        title: "Real Projects & Scripts",
        description: "Build command-line automation scripts, parse CSV/JSON datasets, and connect to live APIs to create working real-world tools."
      }
    ],
    stages: [
      {
        title: "Python Basics, Control Flow & Data Types",
        duration: "Week 1-2 · 15 Hours",
        summary: "Master core syntax, dynamic typing, operators, conditional branching, and loops through interactive practice.",
        topics: [
          "Variables, Primitive Types & Memory References",
          "Arithmetic, Logical & Bitwise Operators",
          "Conditionals (if-elif-else) & Match-Case Statements",
          "Loops (for, while) & Loop Control (break, continue, pass)",
          "List Comprehensions & Generator Expressions"
        ],
        practice: [
          "Prime Number Sieve & GCD Calculation",
          "Fibonacci Series with Iteration & Memoization",
          "Palindrome & Anagram Validation",
          "Nested Loop Pattern Printing Drills"
        ],
        practiceLabel: "FOUNDATION CODING CHALLENGES",
        outcome: "Students write clean, bug-free Python control flow and solve beginner interview coding problems independently."
      },
      {
        title: "Data Collections, Functions & Modular Code",
        duration: "Week 3-4 · 15 Hours",
        summary: "Deep dive into built-in data structures (Lists, Tuples, Dictionaries, Sets) and function architecture.",
        topics: [
          "List Slicing, Methods, and Performance Complexity",
          "Dictionaries (Hash Maps) & Set Operations",
          "Function Scope, *args, **kwargs & Lambda Functions",
          "Built-in Modules: math, random, collections, itertools",
          "Error Handling with try-except-finally & Custom Exceptions"
        ],
        practice: [
          "Word Frequency Counter using Collections.Counter",
          "Two-Sum Hash Map Solution in Python",
          "Custom Matrix Transpose & Flatten Utility",
          "Safe JSON Parser with Robust Error Handling"
        ],
        practiceLabel: "COLLECTIONS & INTERVIEW PRACTICE",
        outcome: "Students write modular, reusable functions and harness Python's high-performance collections to solve complex data problems."
      },
      {
        title: "OOP, File Automation & Placement Challenges",
        duration: "Week 5-6 · 15 Hours",
        summary: "Object-oriented design patterns, file processing, and recruitment test practice.",
        topics: [
          "Classes, Objects, __init__, and Dunder Methods",
          "Inheritance, Polymorphism & Encapsulation",
          "File I/O (Text, CSV, JSON) with Context Managers (with)",
          "Working with External APIs (requests module)",
          "Campus Coding Assessment Speed Drills"
        ],
        practice: [
          "Banking System / Inventory Tracker using OOP",
          "Automated Resume Data Extractor (JSON/CSV)",
          "REST API Weather & News CLI Tool",
          "TCS/Wipro/Infosys Previous Python Coding Questions"
        ],
        practiceLabel: "CAPSTONE MINI-PROJECTS",
        outcome: "Students gain placement-ready coding skills, write object-oriented code, and understand how to solve company assessment problems."
      }
    ],
    checkpoints: [
      {
        question: "In Python, what is the output of `[x**2 for x in range(5) if x % 2 != 0]`?",
        options: [
          "[0, 4, 16]",
          "[1, 9]",
          "[1, 4, 9]",
          "[1, 3, 5]"
        ],
        answer: 1,
        explanation: "range(5) generates numbers 0, 1, 2, 3, 4. The condition x % 2 != 0 selects odd numbers 1 and 3. Squaring them yields 1^2 = 1 and 3^2 = 9, resulting in [1, 9]."
      }
    ],
    faqs: [
      {
        question: "Is Python suitable for campus coding placement rounds?",
        answer: "Yes! Top recruiters like TCS Digital, Infosys, Capgemini, Accenture, and many product startups allow Python in their coding assessments. Python's clean syntax allows students to solve algorithmic problems much faster."
      },
      {
        question: "Do I need to know C or C++ before learning Python?",
        answer: "No. Python is one of the easiest languages to start with, yet powerful enough for production machine learning and web backends."
      }
    ]
  },
  {
    slug: "dsa",
    code: "01 / PLACEMENT CODING",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    duration: "8 Weeks · 60+ Hours Live",
    problemsCount: "200+ LeetCode Problems",
    mode: "Campus Bootcamps & Live Online",
    target: "Product & Top IT Campus Drives",
    audience: "B.Tech students (2nd, 3rd, and 4th year) preparing for campus placements and coding assessments.",
    prerequisites: "Basic programming syntax in any one language (C++, Java, or Python). No prior DSA knowledge required.",
    icon: Code2,
    intro: "Master core problem-solving from scratch. Learn how to break down any new coding problem, select optimal data structures, and crack technical interview rounds.",
    promise: "A structured, pattern-based syllabus designed specifically for engineering college campus recruitment drives. From zero confidence to cracking product-level technical tests.",
    skills: ["15 Core Coding Patterns", "Time & Space Complexity", "200+ Solved Interview Problems", "Live Contest Speed", "Technical Interview Communication"],
    pillars: [
      {
        number: "01",
        title: "Pattern-Based Learning",
        description: "Instead of memorizing 500 disconnected questions, master the 15 core patterns (Sliding Window, Two Pointers, Monotonic Stack, Backtracking, DP) that solve 90% of interview problems."
      },
      {
        number: "02",
        title: "Live In-Class Coding",
        description: "No boring slides. Mentors code live in front of the class, trace edge cases, compare multiple approaches, and debug errors alongside students."
      },
      {
        number: "03",
        title: "Timed Placement Contests",
        description: "Train under real exam pressure with weekly automated coding assessments, strict time constraints, and live campus leaderboards."
      }
    ],
    stages: [
      {
        title: "Complexity Analysis, Math & Bit Manipulation",
        duration: "Week 1 · 8 Hours",
        summary: "Master Big-O time and space estimation and bit-level mathematical tricks asked in online assessments.",
        topics: [
          "Big-O, Big-Omega, Big-Theta & Asymptotic Analysis",
          "Worst-case, Average-case, and Amortized Runtime",
          "Bitwise Operators: AND, OR, XOR, Left/Right Shift",
          "Bitmasking, Counting Set Bits, Finding Unique Elements",
          "Space Complexity & Recursion Call Stack Memory"
        ],
        practice: [
          "Single Number (LeetCode 136)",
          "Subsets Generation via Bitmasking (LeetCode 78)",
          "Counting Bits in O(n) (LeetCode 338)",
          "Reverse Bits & Fast Power (x^n in O(log n))"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Instantly analyze time & space complexity in 10 seconds before writing a single line of code."
      },
      {
        title: "Arrays, Two Pointers & Sliding Window",
        duration: "Week 2 · 10 Hours",
        summary: "Master the most frequent pattern in company coding tests: converging pointers and dynamic sliding windows.",
        topics: [
          "Two Pointers: Converging pointers (sorted arrays) & Fast/Slow pointers",
          "Fixed-size Sliding Window (k-length subarrays)",
          "Variable-size Sliding Window (condition-based expansion/shrink)",
          "Prefix Sum arrays & 2D range sum matrices",
          "Kadane's Algorithm for Maximum Subarray Sum"
        ],
        practice: [
          "Trapping Rain Water (LeetCode 42 - Hard)",
          "3-Sum (LeetCode 15 - Medium)",
          "Longest Substring Without Repeating Characters (LeetCode 3)",
          "Minimum Size Subarray Sum (LeetCode 209)",
          "Container With Most Water (LeetCode 11)"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Solve 70% of company online assessment array questions in under 20 minutes."
      },
      {
        title: "Strings, Hashing & Frequency Maps",
        duration: "Week 3 · 8 Hours",
        summary: "Optimize O(n²) brute-force solutions down to O(n) using frequency arrays, HashMaps, and HashSets.",
        topics: [
          "Hash Table internals: Collision resolution, load factor, and O(1) lookups",
          "Frequency arrays vs HashMaps (space vs speed trade-offs)",
          "Anagrams, string rolling hashes, and character counting",
          "Subarray sum problems using prefix sum + HashMap",
          "HashSet patterns for duplicate detection and fast lookups"
        ],
        practice: [
          "Group Anagrams (LeetCode 49)",
          "Subarray Sum Equals K (LeetCode 560)",
          "Longest Consecutive Sequence (LeetCode 128)",
          "First Missing Positive (LeetCode 41 - Hard)",
          "Valid Anagram & Isomorphic Strings"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Master O(1) lookup strategies and eliminate nested loops in string manipulation problems."
      },
      {
        title: "Stacks, Queues & Linked Lists",
        duration: "Week 4 · 8 Hours",
        summary: "Master pointer manipulation, cycle detection, and monotonic stacks asked in Amazon & Microsoft.",
        topics: [
          "Singly & Doubly Linked Lists: Reversal, merging, insertion, deletion",
          "Fast & Slow pointer (Floyd's Cycle Finding Algorithm)",
          "Monotonic Increasing & Decreasing Stack patterns",
          "Circular Queues & Double-ended Queues (Deque)",
          "LRU (Least Recently Used) Cache architecture & implementation"
        ],
        practice: [
          "Reverse Linked List & Reverse in K-Groups (LeetCode 25)",
          "LRU Cache Implementation (LeetCode 146)",
          "Next Greater Element I & II (LeetCode 496, 503)",
          "Daily Temperatures (LeetCode 739)",
          "Largest Rectangle in Histogram (LeetCode 84 - Hard)"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Confidently handle complex pointer acrobatics and monotonic stack interview questions."
      },
      {
        title: "Binary Trees, BST & Priority Queues (Heaps)",
        duration: "Week 5 · 10 Hours",
        summary: "Master recursive tree traversals, BST search properties, and heap-based Top-K element problems.",
        topics: [
          "Tree traversals: Preorder, Inorder, Postorder (Recursive & Iterative)",
          "Level Order Traversal (BFS) & Zig-Zag traversal",
          "Tree metrics: Height, Diameter, Maximum Path Sum, Symmetry",
          "Binary Search Tree (BST) search, insertion, and validation",
          "Min-Heap / Max-Heap internals, heapify, and PriorityQueue usage"
        ],
        practice: [
          "Lowest Common Ancestor in Binary Tree (LeetCode 236)",
          "Binary Tree Maximum Path Sum (LeetCode 124 - Hard)",
          "Validate Binary Search Tree (LeetCode 98)",
          "Top K Frequent Elements (LeetCode 347)",
          "Find Median from Data Stream (LeetCode 295 - Hard)"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Write recursive tree traversals without fear and solve Top-K ranking problems with heaps."
      },
      {
        title: "Recursion, Backtracking & Dynamic Programming",
        duration: "Week 6-7 · 14 Hours",
        summary: "Demystify Dynamic Programming with our 5-step framework: from recursion tree to space-optimized DP.",
        topics: [
          "Recursion trees, state space representation, and pruning",
          "Backtracking: N-Queens, Subsets, Permutations, Sudoku Solver",
          "Memoization (Top-Down) vs Tabulation (Bottom-Up)",
          "1D DP: Climbing Stairs, House Robber, Coin Change",
          "2D Grid DP & 0/1 Knapsack patterns",
          "String DP: Longest Common Subsequence (LCS) & Edit Distance",
          "DP on Stocks & Longest Increasing Subsequence (LIS)"
        ],
        practice: [
          "Coin Change I & II (LeetCode 322, 518)",
          "Longest Increasing Subsequence (LeetCode 300)",
          "Edit Distance (LeetCode 72 - Hard)",
          "Word Break (LeetCode 139)",
          "Partition Equal Subset Sum (LeetCode 416)"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Tackle hard DP problems with confidence using state transitions and space optimization."
      },
      {
        title: "Graphs & Advanced Traversal Algorithms",
        duration: "Week 7 · 10 Hours",
        summary: "Model complex network problems, detect cycles, find shortest paths, and master Disjoint Sets.",
        topics: [
          "Graph representations: Adjacency Matrix vs Adjacency List",
          "Graph BFS & DFS traversals on grids and adjacency lists",
          "Cycle detection in Directed (Kahn's / DFS color) & Undirected graphs",
          "Topological Sorting (DAG task ordering)",
          "Dijkstra's Shortest Path Algorithm (PriorityQueue implementation)",
          "Disjoint Set Union (DSU / Union-Find) with path compression"
        ],
        practice: [
          "Number of Islands (LeetCode 200)",
          "Course Schedule I & II (LeetCode 207, 210)",
          "Rotting Oranges (LeetCode 994)",
          "Network Delay Time (LeetCode 743)",
          "Redundant Connection (LeetCode 684)"
        ],
        practiceLabel: "TOP INTERVIEW PROBLEMS SOLVED",
        outcome: "Solve multi-source BFS grid problems and dependency scheduling with ease."
      },
      {
        title: "Company Mock Tests & Technical Interview Prep",
        duration: "Week 8 · 6 Hours",
        summary: "Simulate real placement exams with timed company assessments and 1-on-1 interview feedback.",
        topics: [
          "Full-length company pattern tests (TCS Digital, Cognizant GenC, Amazon OA)",
          "Explaining trade-offs and complexity to an interviewer",
          "Behavioral & technical question frameworks (STAR method)",
          "GitHub problem portfolio and resume ATS formatting"
        ],
        practice: [
          "5 Full-Length Timed Coding Contests on platform",
          "Live Leaderboard & Detailed Solution Walkthroughs",
          "1-on-1 Mock Technical Interview with Mentor Feedback"
        ],
        practiceLabel: "ASSESSMENTS & MOCKS",
        outcome: "Walk into campus recruitment drives fully prepared, confident, and interview-ready."
      }
    ],
    checkpoints: [
      {
        question: "You have an array problem and need to find two numbers that sum up to K in an already sorted array. What is the optimal approach?",
        options: ["Two nested loops (O(n²))", "Two pointers converging from ends (O(n) time, O(1) space)", "Binary search for every element (O(n log n))"],
        answer: 1,
        explanation: "Since the array is sorted, converging two pointers from both ends solves it in O(n) time with O(1) extra space."
      },
      {
        question: "When should you prefer a sliding window over a general two-pointer approach?",
        options: ["When finding subarrays or contiguous sequences satisfying a condition", "When the array contains negative numbers in all cases", "When reversing an array in place"],
        answer: 0,
        explanation: "Sliding window is specifically tailored for contiguous subarrays or substrings with expanding and shrinking boundaries."
      },
      {
        question: "You need to quickly check whether an element has appeared before in O(1) time. What structure is best?",
        options: ["Array with linear scan", "Hash Set", "Binary Search Tree without balancing"],
        answer: 1,
        explanation: "A Hash Set provides average O(1) time complexity for membership lookup."
      },
      {
        question: "Which data structure is ideal for finding the 'Next Greater Element' for all elements in an array in O(n) total time?",
        options: ["Queue", "Monotonic Stack", "Priority Queue (Heap)"],
        answer: 1,
        explanation: "A monotonic stack stores elements in increasing or decreasing order, allowing each element to be pushed and popped at most once."
      },
      {
        question: "What is the key property of a Binary Search Tree (BST)?",
        options: ["Every node has exactly 2 children", "Left subtree values < root < right subtree values", "The tree is always perfectly balanced"],
        answer: 1,
        explanation: "In a BST, all nodes in the left subtree are smaller than the node, and all nodes in the right subtree are greater."
      },
      {
        question: "What is the core distinction between Memoization and Tabulation in Dynamic Programming?",
        options: ["Memoization is Top-Down with recursion; Tabulation is Bottom-Up with iteration", "Memoization uses no extra memory; Tabulation uses recursion", "There is no difference"],
        answer: 0,
        explanation: "Memoization caches recursive call results top-down, while Tabulation fills an iterative table bottom-up from base cases."
      },
      {
        question: "In an unweighted graph, which traversal algorithm guarantees finding the shortest path in terms of edges?",
        options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Pre-order Traversal"],
        answer: 1,
        explanation: "BFS explores vertices level by level, ensuring that the first time a target vertex is reached is via the minimum number of edges."
      },
      {
        question: "What is the best way to explain a solution during a technical interview?",
        options: ["Immediately start typing code without speaking", "State constraints, walk through a small example, discuss brute force, then propose the optimal pattern with complexity", "Ask the interviewer to write the solution"],
        answer: 1,
        explanation: "Clarifying constraints, dry running an example, and explaining trade-offs before coding demonstrates structured engineering thinking."
      }
    ],
    faqs: [
      {
        question: "Can complete beginners join this course?",
        answer: "Yes. We start from basic syntax, time-space complexity fundamentals, and simple array math before advancing to complex structures. No prior DSA knowledge is required."
      },
      {
        question: "Which programming languages can students use?",
        answer: "You can code in C++, Java, or Python. All problem-solving logic and algorithmic patterns are taught language-agnostically with code examples provided in all three languages."
      },
      {
        question: "How is this scheduled for college batches?",
        answer: "We coordinate directly with your college's Training & Placement Officer (TPO) to ensure class schedules do not clash with semester exams, labs, or university breaks."
      },
      {
        question: "Do students get practice sheets and doubt-solving support?",
        answer: "Yes. Students receive curated topic-wise problem sheets, code starter templates, daily doubt-clearing sessions, and access to recorded solutions."
      }
    ]
  },
  {
    slug: "web-development",
    code: "02 / FULL STACK ENGINEERING",
    name: "Full-Stack Web Development",
    shortName: "Web Dev",
    duration: "8 Weeks · 60+ Hours Live",
    problemsCount: "4 Production Projects",
    mode: "Campus Bootcamps & Live Online",
    target: "Frontend, Backend & Full-Stack Developer Roles",
    audience: "Students who want to build real, scalable software products and stand out in developer interviews.",
    prerequisites: "Basic computer familiarity. No prior HTML, CSS, or JavaScript experience needed. Beginners welcome.",
    icon: PanelsTopLeft,
    intro: "Go from basic HTML/CSS to building complete, responsive web applications with React, Node.js, and MongoDB that you can showcase on your resume.",
    promise: "Learn modern frontend and backend development, connect real APIs, design database schemas, and deploy production-ready full-stack applications from scratch.",
    skills: ["Modern JavaScript & React", "Node.js & Express APIs", "MongoDB & Database Design", "JWT Auth & Security", "Vercel & Render Deployment"],
    pillars: [
      {
        number: "01",
        title: "Project-First Pedagogy",
        description: "No disconnected toy exercises. You learn every concept by building actual features on production-grade web applications."
      },
      {
        number: "02",
        title: "Modern Tech Stack",
        description: "Learn the exact tools used by high-growth startups and tech teams: React.js, Tailwind CSS, Node.js, Express, MongoDB, and Git."
      },
      {
        number: "03",
        title: "Deploy & Host Everything",
        description: "Every student finishes with live deployed URLs on Vercel and Render, custom domains, and active GitHub repositories for recruiters to inspect."
      }
    ],
    stages: [
      {
        title: "Modern HTML5, Responsive CSS3 & Tailwind",
        duration: "Week 1 · 8 Hours",
        summary: "Build responsive, modern UI layouts from scratch using semantic HTML, Flexbox, CSS Grid, and Tailwind CSS.",
        topics: [
          "Semantic HTML5 elements & web accessibility (a11y)",
          "Box model, positioning, Flexbox & CSS Grid systems",
          "Responsive mobile-first design with media queries",
          "Tailwind CSS utility-first framework & configuration"
        ],
        practice: [
          "Responsive SaaS Landing Page with modern styling",
          "Developer Portfolio with dark mode toggle"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Craft pixel-perfect, responsive web pages that adapt to mobile, tablet, and desktop screens."
      },
      {
        title: "Core JavaScript & Modern ES6+ Deep Dive",
        duration: "Week 2 · 10 Hours",
        summary: "Master the language of the web: closures, event loop, asynchronous programming, and DOM APIs.",
        topics: [
          "Scope, Hoisting, Closures & Lexical Environment",
          "Array methods: map, filter, reduce, find, some, every",
          "Asynchronous JS: Callbacks, Promises, async/await",
          "Event Loop, Call Stack, Microtask queue",
          "DOM manipulation, Event delegation, and LocalStorage"
        ],
        practice: [
          "Interactive Kanban / Task Manager with LocalStorage persistence",
          "Live Currency & Crypto Exchange Rate Tracker using Fetch API"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Write clean, modern JavaScript without relying on guesswork or copy-pasted code."
      },
      {
        title: "React.js Fundamentals & Component Architecture",
        duration: "Week 3 · 10 Hours",
        summary: "Build reactive, reusable frontend interfaces with React components, hooks, and clean state.",
        topics: [
          "Virtual DOM, JSX, and component lifecycle",
          "State & Props: useState, useEffect for data fetching",
          "Performance optimization: useMemo, useCallback, useRef",
          "Custom Hooks creation and state reusability",
          "React Router v6 for multi-page Single Page Applications (SPAs)"
        ],
        practice: [
          "E-Commerce Product Catalog with live search, filters, and shopping cart",
          "Movie / TV Show Explorer with TMDB API integration and pagination"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Build component-driven single page applications with fluid state updates."
      },
      {
        title: "Backend Engineering with Node.js & Express.js",
        duration: "Week 4 · 8 Hours",
        summary: "Create scalable backend RESTful APIs, manage HTTP requests, middleware, and errors.",
        topics: [
          "Node.js runtime, Event loop, and file system modules",
          "Express.js server setup, routing, and route handlers",
          "Custom middleware (logging, authentication, error handling)",
          "Request validation, status codes, and JSON response formatting",
          "Environment variables, security headers (Helmet), and CORS"
        ],
        practice: [
          "REST API for a Campus Notes & Resource Sharing portal",
          "Authentication microservice with JWT & password hashing (bcrypt)"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Build and document secure RESTful APIs following industry conventions."
      },
      {
        title: "Databases, Schemas & CRUD Operations (MongoDB)",
        duration: "Week 5 · 10 Hours",
        summary: "Model application data, write efficient database queries, and manage relational/document data.",
        topics: [
          "MongoDB & Mongoose ODM setup and connections",
          "Schema modeling, data validation, and indexes",
          "Relational references, populate, and aggregation pipelines",
          "Database migrations and ACID transaction fundamentals",
          "Query optimization and handling large datasets"
        ],
        practice: [
          "Multi-tenant Blog/Discussion Forum with nested comments and upvotes",
          "College Event Registration & Ticketing database system"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Design resilient database schemas and write optimized database queries."
      },
      {
        title: "Authentication, Authorization & Security",
        duration: "Week 6 · 8 Hours",
        summary: "Implement production-grade security: JWT tokens, role-based access control, and cookies.",
        topics: [
          "Token-based auth vs Session auth",
          "Access tokens, Refresh tokens, and HTTP-only cookies",
          "Role-Based Access Control (Admin, Faculty, Student roles)",
          "Password reset flows with email verification (Nodemailer)",
          "Protecting routes in React and Express middleware"
        ],
        practice: [
          "Secure Role-Based Dashboard with Student & Admin permissions",
          "OTP & Password reset flow with automated email dispatch"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Protect your applications against OWASP Top 10 web vulnerabilities."
      },
      {
        title: "Full-Stack Integration & Cloud Deployment",
        duration: "Week 7 · 8 Hours",
        summary: "Connect frontend and backend, manage state with Zustand, and deploy on Vercel and Render.",
        topics: [
          "Full-stack integration: Connecting React frontend to Express backend",
          "Global state management (Zustand / Context API)",
          "File uploads (Cloudinary / AWS S3 integration)",
          "Deploying Frontend on Vercel and Backend on Render/Railway",
          "Setting up Custom Domains, SSL, and CI/CD with GitHub Actions"
        ],
        practice: [
          "End-to-end deployment of capstone full-stack project",
          "Automated continuous deployment pipeline via GitHub"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Have live URLs and GitHub repositories ready to demo to interviewers."
      },
      {
        title: "Capstone Project Showcase & Technical Interview Prep",
        duration: "Week 8 · 6 Hours",
        summary: "Polish your flagship project, write detailed READMEs, and prepare for web dev technical interviews.",
        topics: [
          "System architecture documentation and system design basics",
          "Common web dev interview questions (CORS, hydration, closures, event loop)",
          "Portfolio presentation and GitHub profile optimization",
          "Live project demo defense with mentors"
        ],
        practice: [
          "Production deployment of Flagship Capstone Application",
          "Live mock frontend/full-stack technical interview"
        ],
        practiceLabel: "ASSESSMENTS & MOCKS",
        outcome: "Possess a standout GitHub portfolio and the confidence to explain full-stack architecture in interviews."
      }
    ],
    checkpoints: [
      {
        question: "Why should you use semantic HTML elements such as <article> or <main> instead of generic <div> tags?",
        options: ["They load faster in browsers", "They improve accessibility for screen readers and search engine SEO", "They automatically include CSS styling"],
        answer: 1,
        explanation: "Semantic tags describe content meaning to browsers and assistive technologies, boosting accessibility and SEO."
      },
      {
        question: "What is the difference between let, const, and var in modern JavaScript?",
        options: ["var is block-scoped; let and const are function-scoped", "let and const are block-scoped and prevent accidental redeclarations; var is function-scoped and hoisted", "There is no difference"],
        answer: 1,
        explanation: "let and const respect block scope and eliminate hoisting surprises caused by var."
      },
      {
        question: "In React, why shouldn't you directly mutate state (e.g. state.push(newItem))?",
        options: ["It throws a syntax error", "React compares state references to decide when to re-render; mutating in place skips the re-render", "It slows down the network"],
        answer: 1,
        explanation: "React relies on immutable state updates to detect reference changes and trigger appropriate component re-renders."
      },
      {
        question: "What is the purpose of middleware in an Express.js server?",
        options: ["To store database passwords", "To intercept and execute code on incoming requests before they reach route handlers", "To style HTML pages"],
        answer: 1,
        explanation: "Express middleware can inspect, modify, authenticate, or log requests before passing them to the final route handler."
      },
      {
        question: "Why store JWT tokens in HTTP-only cookies rather than localStorage?",
        options: ["Cookies hold more data", "HTTP-only cookies cannot be accessed by client-side JavaScript, protecting against XSS attacks", "localStorage doesn't work on mobile"],
        answer: 1,
        explanation: "HTTP-only cookies cannot be read by malicious scripts, mitigating Cross-Site Scripting (XSS) token theft."
      },
      {
        question: "What does the CORS (Cross-Origin Resource Sharing) header do?",
        options: ["Encrypts API passwords", "Instructs browsers whether a frontend on one domain is permitted to fetch data from an API on another domain", "Compiles JavaScript code"],
        answer: 1,
        explanation: "CORS is a browser security mechanism that controls cross-origin HTTP requests."
      },
      {
        question: "What is an index in MongoDB, and why is it important?",
        options: ["A list of database usernames", "A special data structure that allows fast query lookups without scanning every document in a collection", "A backup copy of data"],
        answer: 1,
        explanation: "Indexes prevent costly full-collection scans and dramatically accelerate search and filter queries."
      },
      {
        question: "What is the primary benefit of setting up a CI/CD pipeline on GitHub?",
        options: ["It writes your code automatically", "It automatically runs tests, builds your application, and deploys changes on every git push", "It replaces the need for a backend"],
        answer: 1,
        explanation: "CI/CD automates testing and deployment, ensuring stable and repeatable production releases."
      }
    ],
    faqs: [
      {
        question: "Do I need any previous coding experience to enroll?",
        answer: "No. The course begins with HTML5 and CSS basics, transitions into core JavaScript fundamentals, and then builds up to React and Node.js."
      },
      {
        question: "Will I have live deployed projects for my resume?",
        answer: "Yes. Every student deploys 4 projects to production on Vercel and Render with live URLs that can be clicked directly from your resume."
      },
      {
        question: "How does this help in campus placements?",
        answer: "Most service and product companies test full-stack basics and ask candidates to explain a real project. You will be able to defend your architecture, database schema, and APIs with confidence."
      },
      {
        question: "Are code reviews provided?",
        answer: "Yes. Mentors review your GitHub pull requests, checking for clean code, security best practices, and industry coding standards."
      }
    ]
  },
  {
    slug: "machine-learning",
    code: "03 / APPLIED AI & DATA SCIENCE",
    name: "AI & Machine Learning",
    shortName: "AI / ML",
    duration: "8 Weeks · 60+ Hours Live",
    problemsCount: "3 End-to-End ML Apps",
    mode: "Campus Bootcamps & Live Online",
    target: "AI Engineer, Data Scientist & ML Roles",
    audience: "Students eager to build real AI and Data Science applications for their resume without getting lost in abstract mathematics.",
    prerequisites: "Basic Python programming familiarity. High school algebra is helpful. No prior data science knowledge needed.",
    icon: BrainCircuit,
    intro: "Learn practical Python, data analysis, and how to train machine learning models for real-world predictions with hands-on deployments.",
    promise: "Understand how to clean messy data, engineer high-signal features, train popular ML models, evaluate accuracy, and deploy interactive AI web apps.",
    skills: ["NumPy & Pandas Pipelines", "Exploratory Data Analysis (EDA)", "Scikit-Learn & XGBoost", "PyTorch Neural Networks", "Streamlit Cloud Deployment"],
    pillars: [
      {
        number: "01",
        title: "Intuition Over Abstract Math",
        description: "We explain how algorithms work using visual geometric diagrams and practical code, rather than overwhelming students with dry equations."
      },
      {
        number: "02",
        title: "Real Messy Datasets",
        description: "Work with authentic, messy datasets containing missing values, outliers, and skewed distributions, mirroring actual industry challenges."
      },
      {
        number: "03",
        title: "Interactive Web Deployments",
        description: "Don't stop at Jupyter Notebooks. Build interactive Streamlit and FastAPI web apps that recruiters can test live in their browser."
      }
    ],
    stages: [
      {
        title: "Python for Data Science & Numerical Computing",
        duration: "Week 1 · 8 Hours",
        summary: "Master high-performance Python libraries for data manipulation: NumPy arrays and Pandas DataFrames.",
        topics: [
          "NumPy N-dimensional arrays, vectorization, and broadcasting",
          "Pandas Series & DataFrames: indexing, filtering, and grouping",
          "Data cleaning: handling missing values, duplicates, and data types",
          "Data visualization with Matplotlib and Seaborn"
        ],
        practice: [
          "Exploratory Analysis of a Campus Placement Dataset",
          "Financial Stock Market Data Analyzer"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Load, inspect, clean, and visualize any raw real-world dataset."
      },
      {
        title: "Exploratory Data Analysis & Feature Engineering",
        duration: "Week 2 · 8 Hours",
        summary: "Transform raw data into predictive features using statistical analysis and encoding techniques.",
        topics: [
          "Univariate, Bivariate, and Multivariate statistical analysis",
          "Outlier detection (IQR, Z-score) and skewness correction",
          "Categorical encoding: One-Hot Encoding, Label Encoding, Target Encoding",
          "Feature Scaling: Min-Max Normalization and Standardization (StandardScaler)",
          "Correlation matrices and feature selection methods"
        ],
        practice: [
          "End-to-end Feature Engineering on Housing Price Dataset",
          "Customer Churn Analysis & Feature Selection pipeline"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Prepare clean, high-signal data pipelines ready for machine learning algorithms."
      },
      {
        title: "Supervised Learning — Regression Algorithms",
        duration: "Week 3 · 8 Hours",
        summary: "Understand linear relationships, cost functions, gradient descent, and regularized regression.",
        topics: [
          "Simple & Multiple Linear Regression mathematics",
          "Cost function (MSE), Gradient Descent optimization",
          "Bias-Variance trade-off and Overfitting vs Underfitting",
          "Regularization: Ridge (L2), Lasso (L1), and ElasticNet",
          "Evaluation metrics: R², Adjusted R², MAE, MSE, RMSE"
        ],
        practice: [
          "Predict Used Car Selling Prices using Scikit-Learn",
          "Medical Insurance Cost Prediction with Regularization"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Train, tune, and evaluate robust regression models on numerical targets."
      },
      {
        title: "Supervised Learning — Classification & Metrics",
        duration: "Week 4 · 10 Hours",
        summary: "Master classification algorithms, decision boundaries, and rigorous performance evaluation.",
        topics: [
          "Logistic Regression & Sigmoid probability function",
          "Decision Trees: Entropy, Information Gain, and Gini Impurity",
          "K-Nearest Neighbors (KNN) and Naive Bayes",
          "Classification metrics: Confusion Matrix, Accuracy, Precision, Recall, F1-Score",
          "ROC-AUC curves and handling imbalanced datasets (SMOTE)"
        ],
        practice: [
          "Credit Card Fraud Detection (Imbalanced dataset handling)",
          "Student Campus Placement Prediction model"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Select and tune classification algorithms based on business precision and recall needs."
      },
      {
        title: "Ensemble Learning & Gradient Boosting",
        duration: "Week 5 · 10 Hours",
        summary: "Harness the power of ensemble methods used by top Kaggle competitors and production teams.",
        topics: [
          "Bagging vs Boosting concepts",
          "Random Forests: Bootstrap sampling and feature randomness",
          "Gradient Boosting Machines (GBM), XGBoost, LightGBM",
          "Hyperparameter tuning: GridSearchCV and RandomizedSearchCV",
          "Cross-validation techniques (K-Fold, Stratified K-Fold)"
        ],
        practice: [
          "Customer Churn Prediction using XGBoost & Hyperparameter Tuning",
          "Kaggle Competition Benchmark Submission"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Build high-accuracy ensemble models that beat standard baselines."
      },
      {
        title: "Unsupervised Learning & Dimensionality Reduction",
        duration: "Week 6 · 8 Hours",
        summary: "Discover hidden patterns in unlabeled data using clustering algorithms and dimensionality reduction.",
        topics: [
          "K-Means Clustering and the Elbow Method for optimal K",
          "Hierarchical Clustering (Dendrograms)",
          "Principal Component Analysis (PCA) for feature compression",
          "Visualizing high-dimensional data in 2D/3D"
        ],
        practice: [
          "Customer Segmentation for E-Commerce Marketing",
          "Dimensionality Reduction and Image Compression using PCA"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Extract clusters and reduce data dimensions while preserving maximum variance."
      },
      {
        title: "Introduction to Deep Learning & Neural Networks",
        duration: "Week 7 · 8 Hours",
        summary: "Bridge traditional ML to Deep Learning: Perceptrons, Artificial Neural Networks (ANN), and PyTorch.",
        topics: [
          "Artificial Neuron (Perceptron) and Multi-Layer Perceptrons (MLP)",
          "Activation functions: ReLU, Sigmoid, Softmax, Tanh",
          "Forward propagation, Loss functions, and Backpropagation",
          "PyTorch fundamentals: Tensors, Autograd, and DataLoader",
          "Building a custom Neural Network classifier in PyTorch"
        ],
        practice: [
          "Handwritten Digit Recognition (MNIST) with PyTorch",
          "Binary Sentiment Classification on Customer Reviews"
        ],
        practiceLabel: "HANDS-ON BUILDS",
        outcome: "Build and train your first Deep Neural Network in PyTorch."
      },
      {
        title: "Model Deployment & Interactive Web App",
        duration: "Week 8 · 6 Hours",
        summary: "Turn your ML models into live, usable web applications and deploy them to the cloud.",
        topics: [
          "Model serialization with joblib and pickle",
          "Building interactive web UIs using Streamlit",
          "Building REST APIs for model inference using FastAPI",
          "Deploying on Streamlit Cloud / HuggingFace Spaces",
          "Monitoring data drift and model performance"
        ],
        practice: [
          "Live Interactive Placement Predictor Web Application",
          "FastAPI inference endpoint hosted on public cloud"
        ],
        practiceLabel: "ASSESSMENTS & MOCKS",
        outcome: "Deliver an end-to-end AI application that anyone can test in their browser via a live link."
      }
    ],
    checkpoints: [
      {
        question: "Why should you fit feature scaling (e.g. StandardScaler) only on the training set, not on the entire dataset?",
        options: ["To save computer memory", "To prevent data leakage from test data into training data", "Because test data doesn't contain numbers"],
        answer: 1,
        explanation: "Fitting on test data leaks statistical distribution information, leading to overly optimistic and biased evaluations."
      },
      {
        question: "When evaluating a model for Credit Card Fraud Detection, which metric is more critical than simple Accuracy?",
        options: ["Mean Squared Error", "Recall (Sensitivity) for fraud cases", "Number of columns"],
        answer: 1,
        explanation: "Since fraud is rare, a naive model predicting 'no fraud' could achieve 99% accuracy while missing every fraud case. Recall measures how many actual frauds were caught."
      },
      {
        question: "What is the primary difference between Ridge (L2) and Lasso (L1) regularization in regression?",
        options: ["Lasso can shrink coefficients to absolute zero, performing feature selection; Ridge shrinks them close to zero", "Ridge is for classification only", "Lasso doesn't use a penalty term"],
        answer: 0,
        explanation: "L1 regularization drives unimportant feature coefficients exactly to zero, effectively acting as automated feature selection."
      },
      {
        question: "Why do ensemble methods like Random Forest generally outperform a single Decision Tree?",
        options: ["They run faster", "They average multiple uncorrelated trees, which significantly reduces variance without increasing bias", "They don't need any training data"],
        answer: 1,
        explanation: "A single decision tree easily overfits (high variance). Random forests aggregate predictions across diverse trees to stabilize predictions."
      },
      {
        question: "In K-Means clustering, how do you determine the optimal number of clusters (K)?",
        options: ["Set K equal to the number of rows", "Use the Elbow Method on the Within-Cluster Sum of Squares (WCSS)", "Choose K=1 always"],
        answer: 1,
        explanation: "The Elbow Method plots WCSS against K; the 'elbow' point indicates diminishing returns for adding more clusters."
      },
      {
        question: "What is the function of an activation function like ReLU in a neural network?",
        options: ["To format data as CSV", "To introduce non-linearity, allowing the network to learn complex non-linear patterns", "To slow down the training loop"],
        answer: 1,
        explanation: "Without non-linear activations, stacking multiple neural network layers would collapse into a simple linear regression."
      },
      {
        question: "What is Principal Component Analysis (PCA) used for?",
        options: ["Predicting housing prices", "Reducing the number of features while preserving maximum variance in the data", "Deleting missing values"],
        answer: 1,
        explanation: "PCA projects high-dimensional data onto orthogonal axes of maximum variance, reducing dimensionality."
      },
      {
        question: "Why should an ML model be deployed via a FastAPI or Streamlit web service?",
        options: ["To delete the Python code", "To allow end-users or other client applications to send input data and receive real-time predictions via HTTP", "Because Jupyter Notebooks cannot save files"],
        answer: 1,
        explanation: "Web APIs make trained models accessible to any frontend, mobile app, or client system in production."
      }
    ],
    faqs: [
      {
        question: "Do I need an advanced mathematics or calculus background?",
        answer: "No. We teach algorithms with geometric and practical intuition first. High school algebra and basic Python are sufficient to master the concepts."
      },
      {
        question: "Will I build projects I can showcase on my resume?",
        answer: "Yes. You will build and deploy 3 complete applications with live web links, including a placement predictor and an interactive data explorer."
      },
      {
        question: "How does this course compare to generic AI courses?",
        answer: "Generic courses stop at Jupyter notebooks with clean toy datasets. SMK focuses on real messy datasets, feature engineering, and cloud deployment."
      },
      {
        question: "Is this training aligned with college schedules?",
        answer: "Yes. We customize bootcamps and semester-long tracks around college timetables in collaboration with your college administration."
      }
    ]
  }
]

export function getProgramForPath(pathname: string) {
  return programs.find((program) => pathname === `/programs/${program.slug}`)
}

function SiteHeader() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
      <BrandSignature href="/#home" />
      <nav className="liquid-glass flex items-center justify-center gap-5 rounded-full px-5 py-3 sm:gap-7 sm:px-7" aria-label="Main navigation">
        <a href="/#programs" className="min-h-6 text-center text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">Programs</a>
        <a href="/#approach" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline">How it works</a>
        <a href="/#campus" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline">For colleges</a>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button asChild variant="glass" className="hidden rounded-full px-5 lg:inline-flex">
          <a href="/#contact">Talk to us <ArrowUpRight aria-hidden="true" /></a>
        </Button>
      </div>
    </header>
  )
}

export default function ProgramPage({ program }: { program: Program }) {
  const Icon = program.icon

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[82svh] flex-col bg-background">
        <CelestialAtmosphere />

        <SiteHeader />

        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-10 sm:px-10">
          <a href="/#programs" className="mb-8 flex w-fit items-center gap-2 text-xs text-foreground/75 transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" /> All training programs
          </a>

          <p className="animate-fade-rise mb-4 flex items-center gap-3 font-body text-[10px] uppercase tracking-[.22em] text-foreground/80">
            <Icon className="size-4 text-path-accent" aria-hidden="true" /> {program.code}
          </p>

          <h1
            className="animate-fade-rise max-w-5xl text-[clamp(2.75rem,8vw,5.5rem)] font-normal leading-[.96] tracking-[-.04em]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {program.name}
          </h1>

          <p className="animate-fade-rise-delay mt-6 max-w-2xl text-base leading-relaxed text-foreground/85 sm:text-lg">
            {program.intro}
          </p>

          {/* Quick Metrics Bar */}
          <div className="animate-fade-rise-delay-2 mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-path-accent">
                <Calendar className="size-3" aria-hidden="true" /> Duration
              </span>
              <p className="mt-1.5 text-xs font-medium text-foreground sm:text-sm">{program.duration}</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-path-accent">
                <Terminal className="size-3" aria-hidden="true" /> Hands-on
              </span>
              <p className="mt-1.5 text-xs font-medium text-foreground sm:text-sm">{program.problemsCount}</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-path-accent">
                <Layers className="size-3" aria-hidden="true" /> Format
              </span>
              <p className="mt-1.5 text-xs font-medium text-foreground sm:text-sm">{program.mode}</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-path-accent">
                <Award className="size-3" aria-hidden="true" /> Goal
              </span>
              <p className="mt-1.5 text-xs font-medium text-foreground sm:text-sm">{program.target}</p>
            </div>
          </div>

          <div className="animate-fade-rise-delay-2 mt-10 flex flex-wrap items-center gap-4">
            <Button asChild variant="default" size="lg" className="hero-btn-primary px-7 py-3 text-sm font-medium">
              <a href="#roadmap">Explore Detailed Syllabus <ArrowDown className="size-4" aria-hidden="true" /></a>
            </Button>
            <Button asChild variant="glass" size="lg" className="hero-btn-secondary px-7 py-3 text-sm">
              <a href="/#contact">Request Campus Proposal <ArrowRight className="size-4" aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="border-t border-border/80 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">How this program is built</p>
            <h2 className="font-display text-4xl leading-[.98] tracking-tight sm:text-5xl">
              Three pillars that guarantee <em className="not-italic text-muted-foreground">results.</em>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {program.promise}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {program.pillars.map((pillar) => (
              <div key={pillar.number} className="rounded-3xl border border-border/80 bg-secondary/30 p-7">
                <span className="font-body text-xs font-semibold tracking-wider text-path-accent">{pillar.number}</span>
                <h3 className="mt-4 font-display text-2xl text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Key Skills:</span>
            {program.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/20 px-3.5 py-1.5 text-xs text-foreground/85">
                <Check className="size-3 text-path-accent" aria-hidden="true" /> {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Roadmap Explorer */}
      <RoadmapExplorer
        stages={program.stages}
        checkpoints={program.checkpoints}
        programName={program.shortName}
        audience={program.audience}
        prerequisites={program.prerequisites}
      />

      {/* FAQs Section */}
      <section className="border-t border-border/80 bg-secondary/20 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">Common Questions</p>
            <h2 className="font-display text-4xl leading-[.98] tracking-tight sm:text-5xl">
              Frequently asked <em className="not-italic text-muted-foreground">questions.</em>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {program.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-border/80 bg-background/50 p-6">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">{faq.question}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-border/80 bg-secondary/50 px-6 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">Bring SMK to your campus</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Ready to train your cohort?</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Connect with our training team to discuss custom schedules, batch sizing, on-campus delivery, or book a free 1-hour live demo class for your students.
            </p>
          </div>
          <Button asChild variant="default" size="lg" className="w-fit rounded-full bg-path-accent text-background hover:bg-path-accent/90">
            <a href="/#contact">Discuss Campus Training <ArrowRight aria-hidden="true" /></a>
          </Button>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-border px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <BrandSignature href="/#home" compact />
        <a href="/#programs" className="flex items-center gap-2 transition-colors hover:text-foreground">
          <ArrowLeft className="size-3" aria-hidden="true" /> All programs
        </a>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }} className="transition-colors hover:text-foreground">
          Back to top ↑
        </a>
      </footer>
    </main>
  )
}
