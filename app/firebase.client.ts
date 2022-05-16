import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { FirebaseClientConfig } from "./types";

const AUTH_EMULATOR_URL = "http://localhost:9099";

export function initFirebaseClient(config: FirebaseClientConfig) {
  const app = initializeApp(config);
  const auth = getAuth(app);

  // If we're running locally, we connect the auth emulator
  if (location.host.startsWith("localhost")) {
    console.log("Connecting to the auth emulator");
    connectAuthEmulator(auth, AUTH_EMULATOR_URL);
  }

  return auth;
}
