import { createDefaultCourseData } from "../data/default-course-data.js";
import { loadCourseData, loadUserProgress, saveCourseData, saveUserProgress } from "../services/firebase-service.js";

const COURSE_KEY = "ielts-nguyen-tuyen-course-cache";

export function getCachedCourseData() {
  try {
    const raw = window.localStorage.getItem(COURSE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : createDefaultCourseData();
  } catch {
    return createDefaultCourseData();
  }
}

export function saveCourseCache(weeks) {
  try {
    window.localStorage.setItem(COURSE_KEY, JSON.stringify(weeks));
  } catch {}
}

export async function syncCourseFromCloud() {
  const remote = await loadCourseData();
  if (Array.isArray(remote)) {
    saveCourseCache(remote);
    return remote;
  }
  const fallback = createDefaultCourseData();
  saveCourseCache(fallback);
  return fallback;
}

export async function saveCourseOnline(weeks, actorEmail) {
  saveCourseCache(weeks);
  await saveCourseData(weeks, actorEmail);
}

export async function getProgressOnline(uid) {
  return loadUserProgress(uid);
}

export async function saveProgressOnline(uid, ids) {
  await saveUserProgress(uid, ids);
}
