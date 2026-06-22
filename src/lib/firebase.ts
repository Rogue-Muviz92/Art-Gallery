import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  getDocFromServer,
  collection 
} from "firebase/firestore";

// Read configuration from the generated applet config
const firebaseConfig = {
  apiKey: "AIzaSyCZSI69phMhZ7QXmGTikuM4WOW9agiadzM",
  authDomain: "lunar-decker-5jcsn.firebaseapp.com",
  projectId: "lunar-decker-5jcsn",
  storageBucket: "lunar-decker-5jcsn.firebasestorage.app",
  messagingSenderId: "644299896695",
  appId: "1:644299896695:web:2a27aec13f983d82c7d372"
};

// Initialize Firebase
const app = initializeApp({
  ...firebaseConfig,
  // The system uses a specific database ID
});

export const auth = getAuth(app);
// Use the specific firestoreDatabaseId from the config
export const db = getFirestore(app, "ai-studio-c8319e00-09f1-4b45-9816-327489a5700b");
export const googleProvider = new GoogleAuthProvider();

// Safe popup helper with fallback detection
export async function doGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // After sign-in, save user information to the user database
    await recordUserLogin(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Popup sign in failed, check if sandbox environment supports popups:", error);
    throw error;
  }
}

export async function doSignOut() {
  await signOut(auth);
}

// Durable persistence: Record user session and baseline info in Firestore DB
export async function recordUserLogin(user: User, consented: boolean = false) {
  try {
    const userRef = doc(db, "authorized_users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || "Authorized Visitor",
      email: user.email,
      photoURL: user.photoURL || "",
      lastLoginAt: new Date().toISOString(),
      ...(consented ? { consentedToCopyright: true, consentedAt: new Date().toISOString() } : {})
    }, { merge: true });
  } catch (dbError) {
    console.warn("Could not save persistent user session in cloud storage:", dbError);
  }
}

// Record explicit copyright acceptance to Firestore DB
export async function recordCopyrightConsent(user: User) {
  try {
    const userRef = doc(db, "authorized_users", user.uid);
    await setDoc(userRef, {
      consentedToCopyright: true,
      consentedAt: new Date().toISOString()
    }, { merge: true });
  } catch (dbError) {
    console.warn("Could not update persistent user consent in cloud:", dbError);
  }
}

// Read user's persistent consent status from Firestore DB
export async function checkCopyrightConsent(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, "authorized_users", uid);
    // Use getDocFromServer to avoid hanging on offline or non-existent databases
    const docSnap = await getDocFromServer(userRef);
    if (docSnap.exists()) {
      return !!docSnap.data()?.consentedToCopyright;
    }
  } catch (error) {
    console.warn("Failed to retrieve persistent cloud consent, falling back to local state:", error);
  }
  return false;
}
