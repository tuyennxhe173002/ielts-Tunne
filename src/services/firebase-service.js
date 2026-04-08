import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { adminEmail, firebaseConfig } from "../config/firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const courseRef = doc(db, "courseContent", "main");

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return ensureUserProfile(result.user).catch(() => fallbackProfile(result.user));
}

export async function signOutUser() {
  await signOut(auth);
}

export function watchSession(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }
    const profile = await ensureUserProfile(user).catch(() => fallbackProfile(user));
    callback(profile);
  });
}

export async function ensureUserProfile(user) {
  const role = user.email === adminEmail ? "admin" : "student";
  const ref = doc(db, "users", user.uid);
  const payload = {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "Học viên",
    photoURL: user.photoURL || "",
    role,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, payload, { merge: true });
  return { ...payload, updatedAt: null };
}

function fallbackProfile(user) {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "Học viên",
    photoURL: user.photoURL || "",
    role: user.email === adminEmail ? "admin" : "student",
    updatedAt: null
  };
}

export async function loadCourseData() {
  const snapshot = await getDoc(courseRef);
  return snapshot.exists() ? snapshot.data().weeks || null : null;
}

export async function saveCourseData(weeks, actorEmail) {
  await setDoc(courseRef, { weeks, updatedAt: serverTimestamp(), updatedBy: actorEmail || adminEmail }, { merge: true });
}

export async function loadUserProgress(uid) {
  const snapshot = await getDoc(doc(db, "progress", uid));
  return snapshot.exists() ? snapshot.data().completedLessonIds || [] : [];
}

export async function saveUserProgress(uid, completedLessonIds) {
  await setDoc(doc(db, "progress", uid), { completedLessonIds, updatedAt: serverTimestamp() }, { merge: true });
}
