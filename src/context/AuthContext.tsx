import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore"
import {
  auth,
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from "@/lib/firebase"
import {
  PENDING_DIAGNOSTIC_KEY,
  type BtechYear,
  type DiagnosticResult,
} from "@/lib/diagnosticEngine"
import type { SupportedLanguage } from "@/lib/codeRunner"

export type UserRole = "student" | "tpo" | "mentor" | "admin"

export interface UserProfile {
  uid: string
  fullName: string
  email: string
  role: UserRole
  collegeId: string
  cohortId: string
  inviteCode: string
  handle: string
  btechYear: BtechYear
}

export interface PersistedDiagnostic {
  id: string
  userId: string
  btechYear: BtechYear
  targetTier: string
  overallScore: number
  problemSolving: number
  complexityIntuition: number
  implementationSpeed: number
  stackReadiness: number
  recommendedSlug: "python" | "dsa" | "web-development" | "machine-learning"
  recommendedStageId: string
  createdAt?: Timestamp | null
}

export interface PersistedMastery {
  id: string
  userId: string
  programSlug: "python" | "dsa" | "web-development" | "machine-learning"
  topicId: string
  topicTitle: string
  status: "verified"
}

export interface PersistedOaSubmission {
  id: string
  assessmentId: string
  problemId: string
  userId: string
  language: SupportedLanguage
  sourceCode: string
  passedCount: number
  totalCount: number
  runtimeMs: number
  status: "passed" | "partial" | "failed"
}

export interface PersistedProjectSubmission {
  id: string
  userId: string
  studentName: string
  studentHandle: string
  programSlug: "web-development" | "machine-learning"
  title: string
  repoUrl: string
  liveUrl: string
  status: "pending" | "verified" | "changes_requested"
  rubricArchitecture: number
  rubricEdgeCases: number
  rubricDeployment: number
  mentorNotes: string
}

export interface CollegeRecord {
  id: string
  name: string
  city: string
}

export interface CohortRecord {
  id: string
  collegeId: string
  collegeName: string
  name: string
  targetYear: BtechYear
  inviteCode: string
  active: boolean
}

export interface ScheduledOaRecord {
  id: string
  title: string
  tier: "Service / Core IT" | "Product Engineering"
  durationMinutes: number
  cohortId: string
  published: boolean
}

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  authReady: boolean
  authError: string
  isAdmin: boolean
  diagnostics: PersistedDiagnostic[]
  verifiedTopicIds: Set<string>
  masteryRecords: PersistedMastery[]
  oaSubmissions: PersistedOaSubmission[]
  projectSubmissions: PersistedProjectSubmission[]
  allProjectsForReview: PersistedProjectSubmission[]
  colleges: CollegeRecord[]
  cohorts: CohortRecord[]
  scheduledOas: ScheduledOaRecord[]
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  saveDiagnosticAttempt: (result: DiagnosticResult) => Promise<void>
  verifyTopicMastery: (
    programSlug: "python" | "dsa" | "web-development" | "machine-learning",
    topicId: string,
    topicTitle: string,
  ) => Promise<void>
  recordOaSubmission: (payload: Omit<PersistedOaSubmission, "id" | "userId">) => Promise<void>
  submitCapstoneProject: (payload: {
    programSlug: "web-development" | "machine-learning"
    title: string
    repoUrl: string
    liveUrl: string
  }) => Promise<void>
  redeemInviteCode: (inviteCode: string) => Promise<{ ok: boolean; message: string }>
  updateBtechYear: (year: BtechYear) => Promise<void>
  submitCampusEnquiry: (payload: {
    name: string
    email: string
    interest: string
    batchYear: string
    note: string
  }) => Promise<{ persisted: boolean }>
  createCollege: (name: string, city: string) => Promise<void>
  createCohort: (payload: {
    collegeId: string
    collegeName: string
    name: string
    targetYear: BtechYear
    inviteCode: string
  }) => Promise<void>
  publishOaAssessment: (payload: {
    title: string
    tier: "Service / Core IT" | "Product Engineering"
    durationMinutes: number
    cohortId: string
  }) => Promise<void>
  gradeCapstoneProject: (payload: {
    projectId: string
    status: "verified" | "changes_requested"
    rubricArchitecture: number
    rubricEdgeCases: number
    rubricDeployment: number
    mentorNotes: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function makeHandle(displayName: string, uid: string): string {
  const base = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24)
  const suffix = uid.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "smk"
  return `${base || "learner"}-${suffix}`
}

function makeDocId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now().toString(36)}-${rand}`
}

const SESSION_MASTERY_KEY = "smk_session_verified_topics_v1"

function loadSessionMastery(): PersistedMastery[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SESSION_MASTERY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PersistedMastery[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState("")

  const [diagnostics, setDiagnostics] = useState<PersistedDiagnostic[]>([])
  const [masteryRecords, setMasteryRecords] = useState<PersistedMastery[]>(() => loadSessionMastery())
  const [oaSubmissions, setOaSubmissions] = useState<PersistedOaSubmission[]>([])
  const [projectSubmissions, setProjectSubmissions] = useState<PersistedProjectSubmission[]>([])
  const [allProjectsForReview, setAllProjectsForReview] = useState<PersistedProjectSubmission[]>([])
  const [colleges, setColleges] = useState<CollegeRecord[]>([
    { id: "sample-col-1", name: "JNTU College of Engineering", city: "Hyderabad" },
    { id: "sample-col-2", name: "VNR VJIET Campus", city: "Hyderabad" },
  ])
  const [cohorts, setCohorts] = useState<CohortRecord[]>([
    {
      id: "sample-coh-1",
      collegeId: "sample-col-1",
      collegeName: "JNTU College of Engineering",
      name: "3rd Year CSE/IT Placement Batch",
      targetYear: "3rd Year",
      inviteCode: "SMK-CSE-2026",
      active: true,
    },
    {
      id: "sample-coh-2",
      collegeId: "sample-col-2",
      collegeName: "VNR VJIET Campus",
      name: "Final Year Day-1 OA Sprint",
      targetYear: "Final Year",
      inviteCode: "SMK-SPRINT-26",
      active: true,
    },
  ])
  const [scheduledOas, setScheduledOas] = useState<ScheduledOaRecord[]>([
    {
      id: "oa-service-01",
      title: "Campus Service-Tier Coding Mock #1",
      tier: "Service / Core IT",
      durationMinutes: 30,
      cohortId: "sample-coh-1",
      published: true,
    },
    {
      id: "oa-product-01",
      title: "Product Engineering DSA Round #1",
      tier: "Product Engineering",
      durationMinutes: 45,
      cohortId: "sample-coh-1",
      published: true,
    },
  ])

  const isAdmin = Boolean(
    user &&
      user.emailVerified &&
      (user.email === BOOTSTRAP_ADMIN_EMAIL || profile?.role === "admin" || profile?.role === "mentor"),
  )

  const syncPublicTranscript = useCallback(
    async (
      currentProfile: UserProfile,
      counts: {
        verifiedTopicsCount: number
        oaPassedCount: number
        oaBestRatio: number
        diagnosticOverall: number
        verifiedProjectsCount: number
        targetTier?: string
      },
    ) => {
      if (!auth.currentUser) return
      const transcriptPath = `public_transcripts/${currentProfile.handle}`
      try {
        await setDoc(doc(db, "public_transcripts", currentProfile.handle), {
          userId: currentProfile.uid,
          handle: currentProfile.handle,
          displayName: currentProfile.fullName.slice(0, 100),
          btechYear: currentProfile.btechYear,
          targetTier: (counts.targetTier || "Product Startup / Engineering").slice(0, 80),
          verifiedTopicsCount: Math.min(500, Math.max(0, counts.verifiedTopicsCount)),
          oaPassedCount: Math.min(200, Math.max(0, counts.oaPassedCount)),
          oaBestRatio: Math.min(100, Math.max(0, Math.round(counts.oaBestRatio))),
          diagnosticOverall: Math.min(100, Math.max(0, Math.round(counts.diagnosticOverall))),
          verifiedProjectsCount: Math.min(50, Math.max(0, counts.verifiedProjectsCount)),
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.warn("Transcript sync deferred:", transcriptPath, error)
      }
    },
    [],
  )

  // Listen to Firebase Auth state & ensure user profile exists
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setProfile(null)
        setDiagnostics([])
        setOaSubmissions([])
        setProjectSubmissions([])
        setAllProjectsForReview([])
        setMasteryRecords(loadSessionMastery())
        setAuthReady(true)
        return
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid)
        const snap = await getDoc(userRef)
        let activeProfile: UserProfile

        if (snap.exists()) {
          const data = snap.data()
          activeProfile = {
            uid: firebaseUser.uid,
            fullName: String(data.fullName || firebaseUser.displayName || "SMK Learner"),
            email: String(data.email || firebaseUser.email || ""),
            role: (data.role as UserRole) || "student",
            collegeId: String(data.collegeId || ""),
            cohortId: String(data.cohortId || ""),
            inviteCode: String(data.inviteCode || ""),
            handle: String(data.handle || makeHandle(firebaseUser.displayName || "learner", firebaseUser.uid)),
            btechYear: (data.btechYear as BtechYear) || "3rd Year",
          }
        } else {
          const role: UserRole =
            firebaseUser.email === BOOTSTRAP_ADMIN_EMAIL && firebaseUser.emailVerified ? "admin" : "student"
          const handle = makeHandle(firebaseUser.displayName || "learner", firebaseUser.uid)
          const fullName = (firebaseUser.displayName || "SMK Student").slice(0, 100)
          const email = (firebaseUser.email || "student@smktechvora.edu").slice(0, 160)

          await setDoc(userRef, {
            uid: firebaseUser.uid,
            fullName,
            email,
            role,
            collegeId: "",
            cohortId: "",
            inviteCode: "",
            handle,
            btechYear: "3rd Year",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })

          activeProfile = {
            uid: firebaseUser.uid,
            fullName,
            email,
            role,
            collegeId: "",
            cohortId: "",
            inviteCode: "",
            handle,
            btechYear: "3rd Year",
          }
        }

        setProfile(activeProfile)

        // Carry over any anonymous /diagnostic attempt saved in localStorage
        const pendingRaw = localStorage.getItem(PENDING_DIAGNOSTIC_KEY)
        if (pendingRaw) {
          try {
            const pending = JSON.parse(pendingRaw) as DiagnosticResult
            const attemptId = makeDocId("diag")
            await setDoc(doc(db, "diagnostic_attempts", attemptId), {
              userId: firebaseUser.uid,
              btechYear: pending.btechYear,
              targetTier: pending.targetTier.slice(0, 80),
              overallScore: pending.overallScore,
              problemSolving: pending.axes.problemSolving,
              complexityIntuition: pending.axes.complexityIntuition,
              implementationSpeed: pending.axes.implementationSpeed,
              stackReadiness: pending.axes.stackReadiness,
              recommendedSlug: pending.recommendedSlug,
              recommendedStageId: pending.recommendedStageId.slice(0, 40),
              createdAt: serverTimestamp(),
            })
            localStorage.removeItem(PENDING_DIAGNOSTIC_KEY)
          } catch (carryErr) {
            console.warn("Could not carry over pending diagnostic:", carryErr)
          }
        }
      } catch (err) {
        console.error("Failed loading user profile:", err)
      } finally {
        setAuthReady(true)
      }
    })
    return () => unsub()
  }, [])

  // Subscribe to user's Firestore collections once authenticated
  useEffect(() => {
    if (!authReady || !user) return

    const diagQuery = query(collection(db, "diagnostic_attempts"), where("userId", "==", user.uid))
    const unsubDiag = onSnapshot(
      diagQuery,
      (snap) => {
        setDiagnostics(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PersistedDiagnostic, "id">),
          })),
        )
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, "diagnostic_attempts")
        } catch {
          // logged
        }
      },
    )

    const masteryQuery = query(collection(db, "topic_mastery"), where("userId", "==", user.uid))
    const unsubMastery = onSnapshot(
      masteryQuery,
      (snap) => {
        const remote = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PersistedMastery, "id">),
        }))
        setMasteryRecords(remote)
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, "topic_mastery")
        } catch {
          // logged
        }
      },
    )

    const oaSubQuery = query(collection(db, "oa_submissions"), where("userId", "==", user.uid))
    const unsubOaSub = onSnapshot(
      oaSubQuery,
      (snap) => {
        setOaSubmissions(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PersistedOaSubmission, "id">),
          })),
        )
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, "oa_submissions")
        } catch {
          // logged
        }
      },
    )

    const projQuery = query(collection(db, "project_submissions"), where("userId", "==", user.uid))
    const unsubProj = onSnapshot(
      projQuery,
      (snap) => {
        setProjectSubmissions(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PersistedProjectSubmission, "id">),
          })),
        )
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, "project_submissions")
        } catch {
          // logged
        }
      },
    )

    const pubOaQuery = query(collection(db, "oa_assessments"), where("published", "==", true))
    const unsubPubOa = onSnapshot(
      pubOaQuery,
      (snap) => {
        if (!snap.empty) {
          setScheduledOas(
            snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<ScheduledOaRecord, "id">),
            })),
          )
        }
      },
      () => {
        // Fallback defaults stay visible
      },
    )

    const cohortQuery = query(collection(db, "cohorts"), where("active", "==", true))
    const unsubCohorts = onSnapshot(
      cohortQuery,
      (snap) => {
        if (!snap.empty) {
          setCohorts(
            snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<CohortRecord, "id">),
            })),
          )
        }
      },
      () => {
        // Keep seeded sample cohorts visible
      },
    )

    return () => {
      unsubDiag()
      unsubMastery()
      unsubOaSub()
      unsubProj()
      unsubPubOa()
      unsubCohorts()
    }
  }, [authReady, user])

  // Admin/Mentor subscriptions for colleges & all capstone submissions
  useEffect(() => {
    if (!authReady || !user || !isAdmin) return

    const unsubCol = onSnapshot(
      collection(db, "colleges"),
      (snap) => {
        if (!snap.empty) {
          setColleges(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CollegeRecord, "id">) })))
        }
      },
      () => {},
    )

    const unsubAllProj = onSnapshot(
      collection(db, "project_submissions"),
      (snap) => {
        setAllProjectsForReview(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PersistedProjectSubmission, "id">),
          })),
        )
      },
      () => {},
    )

    return () => {
      unsubCol()
      unsubAllProj()
    }
  }, [authReady, user, isAdmin])

  // Keep public transcript synchronized whenever student metrics update
  useEffect(() => {
    if (!profile || !user) return
    const latestDiag = diagnostics[diagnostics.length - 1]
    const passedOas = oaSubmissions.filter((s) => s.status === "passed").length
    const bestRatio = oaSubmissions.reduce((best, s) => {
      const ratio = s.totalCount > 0 ? (s.passedCount / s.totalCount) * 100 : 0
      return Math.max(best, ratio)
    }, 0)
    const verifiedProjs = projectSubmissions.filter((p) => p.status === "verified").length

    void syncPublicTranscript(profile, {
      verifiedTopicsCount: masteryRecords.length,
      oaPassedCount: passedOas,
      oaBestRatio: bestRatio,
      diagnosticOverall: latestDiag?.overallScore ?? 0,
      verifiedProjectsCount: verifiedProjs,
      targetTier: latestDiag?.targetTier,
    })
  }, [profile, user, diagnostics, masteryRecords, oaSubmissions, projectSubmissions, syncPublicTranscript])

  const signInWithGoogle = useCallback(async () => {
    setAuthError("")
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not complete Google Sign-In."
      setAuthError(msg)
    }
  }, [])

  const logout = useCallback(async () => {
    setAuthError("")
    await signOut(auth)
  }, [])

  const saveDiagnosticAttempt = useCallback(
    async (result: DiagnosticResult) => {
      if (!user) {
        localStorage.setItem(PENDING_DIAGNOSTIC_KEY, JSON.stringify(result))
        return
      }
      const attemptId = makeDocId("diag")
      try {
        await setDoc(doc(db, "diagnostic_attempts", attemptId), {
          userId: user.uid,
          btechYear: result.btechYear,
          targetTier: result.targetTier.slice(0, 80),
          overallScore: result.overallScore,
          problemSolving: result.axes.problemSolving,
          complexityIntuition: result.axes.complexityIntuition,
          implementationSpeed: result.axes.implementationSpeed,
          stackReadiness: result.axes.stackReadiness,
          recommendedSlug: result.recommendedSlug,
          recommendedStageId: result.recommendedStageId.slice(0, 40),
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `diagnostic_attempts/${attemptId}`)
      }
    },
    [user],
  )

  const verifyTopicMastery = useCallback(
    async (
      programSlug: "python" | "dsa" | "web-development" | "machine-learning",
      topicId: string,
      topicTitle: string,
    ) => {
      if (!user) {
        setMasteryRecords((prev) => {
          if (prev.some((m) => m.topicId === topicId)) return prev
          const next: PersistedMastery[] = [
            ...prev,
            {
              id: `session_${topicId}`,
              userId: "guest",
              programSlug,
              topicId,
              topicTitle,
              status: "verified",
            },
          ]
          localStorage.setItem(SESSION_MASTERY_KEY, JSON.stringify(next))
          return next
        })
        return
      }
      const docId = `${user.uid}_${programSlug}_${topicId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128)
      try {
        await setDoc(doc(db, "topic_mastery", docId), {
          userId: user.uid,
          programSlug,
          topicId,
          topicTitle: topicTitle.slice(0, 140),
          status: "verified",
          verifiedAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `topic_mastery/${docId}`)
      }
    },
    [user],
  )

  const recordOaSubmission = useCallback(
    async (payload: Omit<PersistedOaSubmission, "id" | "userId">) => {
      const subId = makeDocId("oasub")
      if (!user) {
        setOaSubmissions((prev) => [{ id: subId, userId: "guest", ...payload }, ...prev])
        return
      }
      try {
        await setDoc(doc(db, "oa_submissions", subId), {
          assessmentId: payload.assessmentId,
          problemId: payload.problemId,
          userId: user.uid,
          language: payload.language,
          sourceCode: payload.sourceCode.slice(0, 16000),
          passedCount: payload.passedCount,
          totalCount: payload.totalCount,
          runtimeMs: Math.min(60000, Math.max(0, Math.round(payload.runtimeMs))),
          status: payload.status,
          submittedAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `oa_submissions/${subId}`)
      }
    },
    [user],
  )

  const submitCapstoneProject = useCallback(
    async (payload: {
      programSlug: "web-development" | "machine-learning"
      title: string
      repoUrl: string
      liveUrl: string
    }) => {
      const projId = makeDocId("proj")
      if (!user || !profile) {
        setProjectSubmissions((prev) => [
          {
            id: projId,
            userId: "guest",
            studentName: "Preview Learner",
            studentHandle: "preview-learner",
            programSlug: payload.programSlug,
            title: payload.title,
            repoUrl: payload.repoUrl,
            liveUrl: payload.liveUrl,
            status: "pending",
            rubricArchitecture: 0,
            rubricEdgeCases: 0,
            rubricDeployment: 0,
            mentorNotes: "",
          },
          ...prev,
        ])
        return
      }
      try {
        await setDoc(doc(db, "project_submissions", projId), {
          userId: user.uid,
          studentName: profile.fullName.slice(0, 100),
          studentHandle: profile.handle,
          programSlug: payload.programSlug,
          title: payload.title.trim().slice(0, 120),
          repoUrl: payload.repoUrl.trim().slice(0, 300),
          liveUrl: payload.liveUrl.trim().slice(0, 300),
          status: "pending",
          rubricArchitecture: 0,
          rubricEdgeCases: 0,
          rubricDeployment: 0,
          mentorNotes: "",
          submittedAt: serverTimestamp(),
          reviewedAt: null,
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `project_submissions/${projId}`)
      }
    },
    [user, profile],
  )

  const redeemInviteCode = useCallback(
    async (rawCode: string): Promise<{ ok: boolean; message: string }> => {
      const code = rawCode.trim().toUpperCase()
      if (!/^[A-Z0-9-]{4,32}$/.test(code)) {
        return { ok: false, message: "Enter a valid invite code (e.g. SMK-CSE-2026)." }
      }
      let matched = cohorts.find((c) => c.inviteCode.toUpperCase() === code)
      if (!matched && user) {
        try {
          const snap = await getDocs(
            query(collection(db, "cohorts"), where("active", "==", true), where("inviteCode", "==", code)),
          )
          if (!snap.empty) {
            const d = snap.docs[0]
            matched = { id: d.id, ...(d.data() as Omit<CohortRecord, "id">) }
          }
        } catch {
          // ignore lookup failure
        }
      }
      if (!matched) {
        return { ok: false, message: `Invite code "${code}" was not found among active cohorts.` }
      }
      if (user && profile) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            collegeId: matched.collegeId,
            cohortId: matched.id,
            inviteCode: matched.inviteCode,
            btechYear: matched.targetYear,
            updatedAt: serverTimestamp(),
          })
          setProfile({
            ...profile,
            collegeId: matched.collegeId,
            cohortId: matched.id,
            inviteCode: matched.inviteCode,
            btechYear: matched.targetYear,
          })
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`)
        }
      }
      return { ok: true, message: `Linked to ${matched.collegeName} — ${matched.name}.` }
    },
    [cohorts, user, profile],
  )

  const updateBtechYear = useCallback(
    async (year: BtechYear) => {
      if (!user || !profile) return
      try {
        await updateDoc(doc(db, "users", user.uid), {
          btechYear: year,
          updatedAt: serverTimestamp(),
        })
        setProfile({ ...profile, btechYear: year })
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`)
      }
    },
    [user, profile],
  )

  const submitCampusEnquiry = useCallback(
    async (payload: {
      name: string
      email: string
      interest: string
      batchYear: string
      note: string
    }): Promise<{ persisted: boolean }> => {
      const enquiryId = makeDocId("enq")
      try {
        await setDoc(doc(db, "campus_enquiries", enquiryId), {
          name: payload.name.trim().slice(0, 100),
          email: payload.email.trim().slice(0, 160),
          interest: payload.interest.trim().slice(0, 120),
          batchYear: payload.batchYear.trim().slice(0, 40),
          note: payload.note.trim().slice(0, 2000),
          createdAt: serverTimestamp(),
        })
        return { persisted: true }
      } catch (err) {
        console.warn("Enquiry fallback activated:", err)
        return { persisted: false }
      }
    },
    [],
  )

  const createCollege = useCallback(
    async (name: string, city: string) => {
      const id = makeDocId("col")
      if (!user || !isAdmin) {
        setColleges((prev) => [{ id, name: name.trim(), city: city.trim() }, ...prev])
        return
      }
      try {
        await setDoc(doc(db, "colleges", id), {
          name: name.trim().slice(0, 140),
          city: city.trim().slice(0, 80),
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `colleges/${id}`)
      }
    },
    [user, isAdmin],
  )

  const createCohort = useCallback(
    async (payload: {
      collegeId: string
      collegeName: string
      name: string
      targetYear: BtechYear
      inviteCode: string
    }) => {
      const id = makeDocId("coh")
      const cleanCode = payload.inviteCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "")
      if (!user || !isAdmin) {
        setCohorts((prev) => [
          {
            id,
            collegeId: payload.collegeId,
            collegeName: payload.collegeName,
            name: payload.name.trim(),
            targetYear: payload.targetYear,
            inviteCode: cleanCode,
            active: true,
          },
          ...prev,
        ])
        return
      }
      try {
        await setDoc(doc(db, "cohorts", id), {
          collegeId: payload.collegeId,
          collegeName: payload.collegeName.slice(0, 140),
          name: payload.name.trim().slice(0, 120),
          targetYear: payload.targetYear,
          inviteCode: cleanCode.slice(0, 32),
          active: true,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `cohorts/${id}`)
      }
    },
    [user, isAdmin],
  )

  const publishOaAssessment = useCallback(
    async (payload: {
      title: string
      tier: "Service / Core IT" | "Product Engineering"
      durationMinutes: number
      cohortId: string
    }) => {
      const id = makeDocId("oa")
      if (!user || !isAdmin) {
        setScheduledOas((prev) => [{ id, ...payload, published: true }, ...prev])
        return
      }
      try {
        await setDoc(doc(db, "oa_assessments", id), {
          title: payload.title.trim().slice(0, 140),
          tier: payload.tier,
          durationMinutes: Math.min(180, Math.max(10, payload.durationMinutes)),
          cohortId: payload.cohortId.slice(0, 128),
          published: true,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `oa_assessments/${id}`)
      }
    },
    [user, isAdmin],
  )

  const gradeCapstoneProject = useCallback(
    async (payload: {
      projectId: string
      status: "verified" | "changes_requested"
      rubricArchitecture: number
      rubricEdgeCases: number
      rubricDeployment: number
      mentorNotes: string
    }) => {
      if (!user || !isAdmin) {
        setAllProjectsForReview((prev) =>
          prev.map((p) =>
            p.id === payload.projectId
              ? {
                  ...p,
                  status: payload.status,
                  rubricArchitecture: payload.rubricArchitecture,
                  rubricEdgeCases: payload.rubricEdgeCases,
                  rubricDeployment: payload.rubricDeployment,
                  mentorNotes: payload.mentorNotes,
                }
              : p,
          ),
        )
        return
      }
      try {
        await updateDoc(doc(db, "project_submissions", payload.projectId), {
          status: payload.status,
          rubricArchitecture: Math.min(10, Math.max(0, payload.rubricArchitecture)),
          rubricEdgeCases: Math.min(10, Math.max(0, payload.rubricEdgeCases)),
          rubricDeployment: Math.min(10, Math.max(0, payload.rubricDeployment)),
          mentorNotes: payload.mentorNotes.trim().slice(0, 1000),
          reviewedAt: serverTimestamp(),
        })
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `project_submissions/${payload.projectId}`)
      }
    },
    [user, isAdmin],
  )

  const verifiedTopicIds = useMemo(
    () => new Set(masteryRecords.map((m) => m.topicId)),
    [masteryRecords],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authReady,
        authError,
        isAdmin,
        diagnostics,
        verifiedTopicIds,
        masteryRecords,
        oaSubmissions,
        projectSubmissions,
        allProjectsForReview,
        colleges,
        cohorts,
        scheduledOas,
        signInWithGoogle,
        logout,
        saveDiagnosticAttempt,
        verifyTopicMastery,
        recordOaSubmission,
        submitCapstoneProject,
        redeemInviteCode,
        updateBtechYear,
        submitCampusEnquiry,
        createCollege,
        createCohort,
        publishOaAssessment,
        gradeCapstoneProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
