import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { doc, getDocFromServer, getFirestore, type Firestore } from "firebase/firestore"

interface FirebaseAppletConfig {
  projectId: string
  appId: string
  apiKey: string
  authDomain: string
  firestoreDatabaseId?: string
  storageBucket?: string
  messagingSenderId?: string
  measurementId?: string
}

// Loads firebase-applet-config.json when present (AI Studio / local dev) without failing
// `tsc -b` or Vercel builds when the generated config file is not committed to Git.
const configModules = import.meta.glob<{ default: FirebaseAppletConfig }>(
  "../../firebase-applet-config.json",
  { eager: true },
)
const fileConfig = Object.values(configModules)[0]?.default

const envConfig: Partial<FirebaseAppletConfig> = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

const resolvedConfig: FirebaseAppletConfig | null =
  fileConfig?.apiKey && fileConfig?.projectId
    ? fileConfig
    : envConfig.apiKey && envConfig.projectId && envConfig.appId && envConfig.authDomain
      ? (envConfig as FirebaseAppletConfig)
      : null

let app: FirebaseApp | null = null
let firestoreInstance: Firestore | null = null
let authInstance: Auth | null = null

if (resolvedConfig) {
  app = initializeApp(resolvedConfig)
  firestoreInstance = resolvedConfig.firestoreDatabaseId
    ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
    : getFirestore(app)
  authInstance = getAuth(app)
}

export const isFirebaseConfigured = Boolean(app && firestoreInstance && authInstance)
export const db: Firestore | null = firestoreInstance
export const auth: Auth | null = authInstance
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

export const BOOTSTRAP_ADMIN_EMAIL = "shailajapullola@gmail.com"

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string
  operationType: OperationType
  path: string | null
  authInfo: {
    userId?: string | null
    email?: string | null
    emailVerified?: boolean | null
    isAnonymous?: boolean | null
    tenantId?: string | null
    providerInfo?: {
      providerId?: string | null
      email?: string | null
    }[]
  }
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const currentUser = auth?.currentUser
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  }
  console.error("Firestore Error: ", JSON.stringify(errInfo))
  throw new Error(JSON.stringify(errInfo))
}

async function testConnection() {
  if (!firestoreInstance) return
  try {
    await getDocFromServer(doc(firestoreInstance, "test", "connection"))
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.")
    }
  }
}

if (typeof window !== "undefined" && firestoreInstance) {
  void testConnection()
}
