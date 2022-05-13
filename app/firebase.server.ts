import {
  cert,
  initializeApp,
  getApps,
  getApp,
  App,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let auth: Auth;
let db: Firestore;

const apiKey = process.env.FIREBASE_CLIENT_API_KEY;
const authDomain = process.env.FIREBASE_CLIENT_AUTH_DOMAIN;
const projectId = process.env.FIREBASE_CLIENT_PROJECT_ID;

if (process.env.NODE_ENV === "development") {
  if (projectId === undefined) {
    throw Error("Missing FIREBASE_CLIENT_PROJECT_ID");
  }

  app = getApps().length === 0 ? initializeApp({ projectId }) : getApp();
} else {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY === undefined) {
    throw Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
  }

  // The FIREBASE_SERVICE_ACCOUNT_KEY is a stringified JSON blob. We convert it
  // to actual JSON before initializing the service account.
  const serviceAccountConfig = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );

  const serviceAccount: ServiceAccount = {
    clientEmail: serviceAccountConfig.client_email,
    privateKey: serviceAccountConfig.private_key.replace(/\\n/gm, "\n"),
    projectId: serviceAccountConfig.project_id,
  };

  app =
    getApps().length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApp();
}

auth = getAuth(app);
db = getFirestore(app);

/**
 * The minimum Firebase configuration required to log in through GitHub on the
 * client.
 */
function getFirebaseClientConfig() {
  return {
    apiKey,
    authDomain,
    projectId,
  };
}

export { app, auth, db, getFirebaseClientConfig };
