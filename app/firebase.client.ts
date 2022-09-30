import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseClientConfig } from "./types";

const AUTH_EMULATOR_URL = "http://localhost:9099";

let firebaseClientApp: FirebaseApp;
let firebaseClientAuth: Auth;

export function initFirebaseClient(config: FirebaseClientConfig) {
  if (firebaseClientAuth) {
    return firebaseClientAuth;
  }

  firebaseClientApp = initializeApp(config);
  firebaseClientAuth = getAuth(firebaseClientApp);

  // If we're running locally, we connect the auth emulator
  if (location.host.startsWith("localhost")) {
    console.log("Connecting to the auth emulator");
    connectAuthEmulator(firebaseClientAuth, AUTH_EMULATOR_URL);
  }

  return firebaseClientAuth;
}

export async function signInWithGitHubPopup(config: FirebaseClientConfig) {
  const auth = initFirebaseClient(config);
  const githubAuth = new GithubAuthProvider();
  githubAuth.addScope("read:user");
  // We need the public_repo scope to create pull requests on behalf of users
  githubAuth.addScope("public_repo");

  return await signInWithPopup(auth, githubAuth);
}
