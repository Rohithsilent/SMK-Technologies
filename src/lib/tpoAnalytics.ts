import { programs } from "@/data/roadmaps"

export type ReadinessTier = "Foundation / At-Risk" | "Assessment-Ready" | "Product-Tier"

export interface CohortStudentRecord {
  id: string
  rollNo: string
  name: string
  branch: "CSE" | "IT" | "ECE" | "AI&DS"
  year: "2nd Year" | "3rd Year" | "Final Year"
  tier: ReadinessTier
  diagnosticScore: number
  verifiedTopics: number
  oaPassRate: number
  attendancePct: number
  capstoneStatus: "Verified" | "Pending Review" | "In Progress"
  handle: string
}

export interface TopicBottleneckMetric {
  topic: string
  track: string
  passRatePct: number
  studentsStruggling: number
  roadmapHref: string
}

export interface OaTrendPoint {
  week: string
  passRatePct: number
  avgScore: number
}

export interface SampleCohortSummary {
  cohortLabel: string
  totalStudents: number
  isSampleData: boolean
  tierDistribution: {
    foundation: number
    assessmentReady: number
    productReady: number
  }
  avgOaPassRate: number
  avgAttendancePct: number
  bottlenecks: TopicBottleneckMetric[]
  oaTrend: OaTrendPoint[]
  students: CohortStudentRecord[]
}

export const SAMPLE_COHORT_DATA: SampleCohortSummary = {
  cohortLabel: "Sample B.Tech 3rd Year CSE/IT Cohort (120 Students)",
  totalStudents: 120,
  isSampleData: true,
  tierDistribution: {
    foundation: 34,
    assessmentReady: 54,
    productReady: 32,
  },
  avgOaPassRate: 71,
  avgAttendancePct: 88,
  bottlenecks: [
    {
      topic: "Recursion & Call Stack Tracing",
      track: "DSA · Stage 01/05",
      passRatePct: 41,
      studentsStruggling: 71,
      roadmapHref: "/programs/dsa#dsa-s5",
    },
    {
      topic: "Variable Sliding Window",
      track: "DSA · Stage 02",
      passRatePct: 52,
      studentsStruggling: 58,
      roadmapHref: "/programs/dsa#dsa-s2",
    },
    {
      topic: "Prefix Sum + HashMap (Negatives)",
      track: "DSA · Stage 03",
      passRatePct: 56,
      studentsStruggling: 53,
      roadmapHref: "/programs/dsa#dsa-s3",
    },
    {
      topic: "REST Auth & Protected Routes",
      track: "Web Dev · Stage 04",
      passRatePct: 63,
      studentsStruggling: 44,
      roadmapHref: "/programs/web-development#web-s4",
    },
    {
      topic: "Dynamic Programming States",
      track: "DSA · Stage 06",
      passRatePct: 38,
      studentsStruggling: 74,
      roadmapHref: "/programs/dsa#dsa-s6",
    },
  ],
  oaTrend: [
    { week: "Wk 1", passRatePct: 44, avgScore: 48 },
    { week: "Wk 2", passRatePct: 53, avgScore: 57 },
    { week: "Wk 3", passRatePct: 61, avgScore: 65 },
    { week: "Wk 4", passRatePct: 68, avgScore: 72 },
    { week: "Wk 5", passRatePct: 74, avgScore: 78 },
    { week: "Wk 6", passRatePct: 79, avgScore: 82 },
  ],
  students: [
    {
      id: "stu-1",
      rollNo: "23CSE014",
      name: "Arjun Reddy",
      branch: "CSE",
      year: "3rd Year",
      tier: "Product-Tier",
      diagnosticScore: 89,
      verifiedTopics: 19,
      oaPassRate: 92,
      attendancePct: 96,
      capstoneStatus: "Verified",
      handle: "arjun-cse26",
    },
    {
      id: "stu-2",
      rollNo: "23CSE029",
      name: "Sneha Kulkarni",
      branch: "CSE",
      year: "3rd Year",
      tier: "Product-Tier",
      diagnosticScore: 85,
      verifiedTopics: 17,
      oaPassRate: 88,
      attendancePct: 94,
      capstoneStatus: "Verified",
      handle: "sneha-k26",
    },
    {
      id: "stu-3",
      rollNo: "23IT041",
      name: "Rohan Deshmukh",
      branch: "IT",
      year: "3rd Year",
      tier: "Assessment-Ready",
      diagnosticScore: 71,
      verifiedTopics: 13,
      oaPassRate: 74,
      attendancePct: 89,
      capstoneStatus: "Pending Review",
      handle: "rohan-it26",
    },
    {
      id: "stu-4",
      rollNo: "23AIDS008",
      name: "Divya Nair",
      branch: "AI&DS",
      year: "3rd Year",
      tier: "Product-Tier",
      diagnosticScore: 84,
      verifiedTopics: 16,
      oaPassRate: 85,
      attendancePct: 92,
      capstoneStatus: "Verified",
      handle: "divya-ai26",
    },
    {
      id: "stu-5",
      rollNo: "23CSE062",
      name: "Karthik Varma",
      branch: "CSE",
      year: "3rd Year",
      tier: "Assessment-Ready",
      diagnosticScore: 66,
      verifiedTopics: 11,
      oaPassRate: 69,
      attendancePct: 86,
      capstoneStatus: "In Progress",
      handle: "karthik-v26",
    },
    {
      id: "stu-6",
      rollNo: "23ECE019",
      name: "Meghana Rao",
      branch: "ECE",
      year: "3rd Year",
      tier: "Foundation / At-Risk",
      diagnosticScore: 46,
      verifiedTopics: 6,
      oaPassRate: 48,
      attendancePct: 79,
      capstoneStatus: "In Progress",
      handle: "meghana-ece26",
    },
    {
      id: "stu-7",
      rollNo: "23IT077",
      name: "Pranav Joshi",
      branch: "IT",
      year: "3rd Year",
      tier: "Foundation / At-Risk",
      diagnosticScore: 42,
      verifiedTopics: 5,
      oaPassRate: 44,
      attendancePct: 74,
      capstoneStatus: "In Progress",
      handle: "pranav-it26",
    },
    {
      id: "stu-8",
      rollNo: "23CSE088",
      name: "Ananya Iyer",
      branch: "CSE",
      year: "3rd Year",
      tier: "Assessment-Ready",
      diagnosticScore: 73,
      verifiedTopics: 14,
      oaPassRate: 77,
      attendancePct: 91,
      capstoneStatus: "Pending Review",
      handle: "ananya-cse26",
    },
  ],
}

export function computeTierPercentages(dist: SampleCohortSummary["tierDistribution"]) {
  const total = dist.foundation + dist.assessmentReady + dist.productReady
  if (total <= 0) return { foundationPct: 0, assessmentReadyPct: 0, productReadyPct: 0 }
  return {
    foundationPct: Math.round((dist.foundation / total) * 100),
    assessmentReadyPct: Math.round((dist.assessmentReady / total) * 100),
    productReadyPct: Math.round((dist.productReady / total) * 100),
  }
}

function escapeCsvCell(value: string | number): string {
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function generateCohortCsv(students: CohortStudentRecord[]): string {
  const headers = [
    "Roll No",
    "Student Name",
    "Branch",
    "Year",
    "Readiness Tier",
    "Diagnostic Score (%)",
    "Verified Roadmap Topics",
    "OA Pass Rate (%)",
    "Attendance (%)",
    "Capstone Status",
    "Transcript Handle",
  ]
  const rows = students.map((s) =>
    [
      s.rollNo,
      s.name,
      s.branch,
      s.year,
      s.tier,
      s.diagnosticScore,
      s.verifiedTopics,
      s.oaPassRate,
      s.attendancePct,
      s.capstoneStatus,
      s.handle,
    ]
      .map(escapeCsvCell)
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}

export type DeliveryMode = "Offline Campus Lab" | "Live Hybrid Cohort" | "Intensive Bootcamp"

export interface SyllabusBriefOutput {
  collegeName: string
  yearLabel: string
  batchSize: number
  deliveryMode: DeliveryMode
  recommendedDuration: string
  tracksIncluded: string[]
  modules: {
    programName: string
    stageTitle: string
    duration: string
    outcome: string
    topics: string[]
  }[]
  assessmentCadence: string[]
}

export function buildSyllabusBrief({
  collegeName,
  batchKey,
  batchSize,
  deliveryMode,
}: {
  collegeName: string
  batchKey: "second-year" | "third-year" | "final-year"
  batchSize: number
  deliveryMode: DeliveryMode
}): SyllabusBriefOutput {
  const py = programs.find((p) => p.slug === "python")
  const dsa = programs.find((p) => p.slug === "dsa")
  const web = programs.find((p) => p.slug === "web-development")
  const ml = programs.find((p) => p.slug === "machine-learning")

  const modules: SyllabusBriefOutput["modules"] = []
  let yearLabel = "3rd Year B.Tech"
  let recommendedDuration = "8 Weeks (64 Hours)"
  let tracksIncluded: string[] = []

  if (batchKey === "second-year") {
    yearLabel = "2nd Year B.Tech (Foundation Cohort)"
    recommendedDuration = "6 Weeks · Semester-Aligned (45 Hours)"
    tracksIncluded = ["Python Programming & Logic", "Core DSA Foundations (Stages 1–3)"]
    ;(py?.stages.slice(0, 4) ?? []).forEach((s) =>
      modules.push({
        programName: "Python",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
    ;(dsa?.stages.slice(0, 2) ?? []).forEach((s) =>
      modules.push({
        programName: "DSA",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
  } else if (batchKey === "third-year") {
    yearLabel = "3rd Year B.Tech (Placement & Build Track)"
    recommendedDuration = "8 Weeks (68 Hours + Capstone)"
    tracksIncluded = ["Complete DSA", "Full-Stack Web Development / AI-ML Capstone"]
    ;(dsa?.stages.slice(0, 4) ?? []).forEach((s) =>
      modules.push({
        programName: "DSA",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
    ;(web?.stages.slice(0, 2) ?? []).forEach((s) =>
      modules.push({
        programName: "Full-Stack Web",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
    ;(ml?.stages.slice(0, 1) ?? []).forEach((s) =>
      modules.push({
        programName: "AI / ML Elective",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
  } else {
    yearLabel = "Final Year B.Tech (Day-1 Placement Sprint)"
    recommendedDuration = "3 Weeks Intensive Bootcamp (48 Hours)"
    tracksIncluded = ["High-Frequency DSA Patterns", "Timed Company OA Simulations"]
    ;(dsa?.stages ?? []).forEach((s) =>
      modules.push({
        programName: "DSA Sprint",
        stageTitle: s.title,
        duration: s.duration,
        outcome: s.outcome,
        topics: s.topics.map((t) => t.title),
      }),
    )
  }

  return {
    collegeName: collegeName.trim() || "Partner Engineering College",
    yearLabel,
    batchSize: Math.max(20, Math.min(1000, batchSize || 120)),
    deliveryMode,
    recommendedDuration,
    tracksIncluded,
    modules,
    assessmentCadence: [
      "Day-1 Baseline: 5-Minute SMK Placement Readiness Diagnostic (4-Axis Cohort Stratification)",
      "Weekly Timed OAs: Python / C++ / Java multi-language grading with hidden edge-case suites",
      "Verified Mastery Gate: Topic completion requires passing interactive trace & debugging checks",
      "TPO Reporting: Weekly NAAC/NBA-ready CSV & PDF cohort attendance and bottleneck reports",
    ],
  }
}
