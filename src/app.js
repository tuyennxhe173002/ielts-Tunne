import { timetableColumns } from "./config/columns.js";
import { openLessonModal } from "./components/lesson-modal.js";
import { getCachedCourseData, getProgressOnline, saveProgressOnline, syncCourseFromCloud } from "./utils/course-storage.js";
import { signOutUser, watchSession } from "./services/firebase-service.js";

const weekSelect = document.querySelector("#week-select");
const body = document.querySelector("#timetable-body");
const weekTitle = document.querySelector("#week-title");
const weekObjective = document.querySelector("#week-objective");
const progressLabel = document.querySelector("#progress-label");
const progressValue = document.querySelector("#progress-value");
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeCopy = document.querySelector("#welcome-copy");
const roleBadge = document.querySelector("#role-badge");
const adminLink = document.querySelector("#admin-link");

let currentWeek = 1;
let currentProfile = null;
let completedIds = new Set();

document.querySelector("#logout-button").addEventListener("click", async () => {
  await signOutUser();
  window.location.href = "./login.html";
});
document.querySelector("#prev-week").addEventListener("click", () => renderWeek(Math.max(1, currentWeek - 1)));
document.querySelector("#next-week").addEventListener("click", () => renderWeek(Math.min(getCachedCourseData().length, currentWeek + 1)));

watchSession(async (profile) => {
  if (!profile) {
    window.location.href = "./login.html";
    return;
  }
  currentProfile = profile;
  const weeks = await syncCourseFromCloud().catch(() => getCachedCourseData());
  completedIds = new Set(await getProgressOnline(profile.uid).catch(() => []));
  hydrateHeader(profile);
  weekSelect.innerHTML = weeks.map((week) => `<option value="${week.weekNumber}">Tuần ${week.weekNumber}</option>`).join("");
  weekSelect.onchange = (event) => renderWeek(Number(event.target.value));
  renderWeek(currentWeek);
});

function hydrateHeader(profile) {
  welcomeTitle.textContent = `Xin chào ${profile.displayName}`;
  welcomeCopy.textContent = profile.role === "admin"
    ? "Bạn đang ở chế độ admin. Có thể học như student và vào khu vực quản trị nội dung."
    : "Tiến độ học của bạn được lưu online theo tài khoản riêng.";
  roleBadge.textContent = profile.role;
  adminLink.hidden = profile.role !== "admin";
}

function renderWeek(weekNumber) {
  const weeks = getCachedCourseData();
  const week = weeks.find((item) => item.weekNumber === weekNumber);
  if (!week) return;
  currentWeek = weekNumber;
  weekSelect.value = String(weekNumber);
  weekTitle.textContent = week.title;
  weekObjective.textContent = week.objective;
  document.querySelector("#prev-week").disabled = weekNumber === 1;
  document.querySelector("#next-week").disabled = weekNumber === weeks.length;
  body.innerHTML = "";

  week.days.forEach((day, index) => {
    const row = document.createElement("tr");
    if (index === 0) row.append(cell(`TUẦN ${week.weekNumber}`, "week-cell", week.days.length));
    row.append(cell(day.label, "day-cell"));
    timetableColumns.forEach((column) => row.append(lessonCell(day.lessons[column.key])));
    body.append(row);
  });
  updateSummary();
}

function cell(text, className, rowSpan = 1) {
  const td = document.createElement("td");
  td.className = className;
  td.rowSpan = rowSpan;
  td.textContent = text;
  return td;
}

function lessonCell(lesson) {
  const done = completedIds.has(lesson.id);
  const td = document.createElement("td");
  const card = document.createElement("div");
  card.className = `lesson-card ${done ? "is-complete" : ""}`;
  const title = document.createElement("p");
  title.className = `lesson-title ${lesson.title?.trim() ? "" : "is-empty"}`;
  title.textContent = lesson.title?.trim() || "Chưa nhập nội dung";
  const actions = document.createElement("div");
  actions.className = "lesson-actions";
  const openButton = document.createElement("button");
  openButton.className = "lesson-open";
  openButton.textContent = "Chi tiết";
  const completeButton = document.createElement("button");
  completeButton.className = `lesson-complete ${done ? "done" : ""}`;
  completeButton.textContent = done ? "Hoàn thành" : "Đánh dấu";
  openButton.onclick = () => openLessonModal({ lesson, isCompleted: done, onCompletedChange: toggleLesson });
  completeButton.onclick = () => toggleLesson(lesson.id);
  actions.append(openButton, completeButton);
  card.append(title, actions);
  td.append(card);
  return td;
}

async function toggleLesson(lessonId) {
  const nextIds = new Set(completedIds);
  if (nextIds.has(lessonId)) nextIds.delete(lessonId);
  else nextIds.add(lessonId);
  completedIds = nextIds;
  renderWeek(currentWeek);
  welcomeCopy.textContent = "Đang đồng bộ tiến độ học tập lên cloud...";
  const snapshot = [...completedIds];
  const ok = await saveProgressOnline(currentProfile.uid, snapshot).then(() => true).catch(() => false);
  if (!ok) {
    if (completedIds.has(lessonId)) completedIds.delete(lessonId);
    else completedIds.add(lessonId);
    welcomeCopy.textContent = "Lưu tiến độ thất bại. Kiểm tra kết nối hoặc Firestore rules.";
    renderWeek(currentWeek);
    return;
  }
  welcomeCopy.textContent = currentProfile.role === "admin"
    ? "Bạn đang ở chế độ admin. Có thể học như student và vào khu vực quản trị nội dung."
    : "Tiến độ học của bạn được lưu online theo tài khoản riêng.";
}

function updateSummary() {
  const total = getCachedCourseData().flatMap((week) => week.days.flatMap((day) => Object.values(day.lessons))).length;
  const completed = completedIds.size;
  progressLabel.textContent = `${completed} / ${total}`;
  progressValue.textContent = `${Math.round((completed / total) * 100) || 0}%`;
}
