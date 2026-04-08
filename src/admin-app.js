import { timetableColumns } from "./config/columns.js";
import { createDefaultCourseData } from "./data/default-course-data.js";
import { getCachedCourseData, saveCourseOnline, syncCourseFromCloud } from "./utils/course-storage.js";
import { signOutUser, watchSession } from "./services/firebase-service.js";

const weekSelect = document.querySelector("#admin-week");
const daySelect = document.querySelector("#admin-day");
const columnSelect = document.querySelector("#admin-column");
const titleInput = document.querySelector("#lesson-title-input");
const audioInput = document.querySelector("#audio-url-input");
const lessonInput = document.querySelector("#lesson-url-input");
const descriptionInput = document.querySelector("#description-input");
const noteInput = document.querySelector("#note-input");
const saveMessage = document.querySelector("#save-message");
const authStatus = document.querySelector("#auth-status");
const dataStatus = document.querySelector("#data-status");

document.querySelector("#logout-button").addEventListener("click", async () => {
  await signOutUser();
  window.location.href = "./login.html";
});

watchSession(async (profile) => {
  if (!profile) {
    window.location.href = "./login.html";
    return;
  }
  if (profile.role !== "admin") {
    window.location.href = "./index.html";
    return;
  }
  authStatus.textContent = `Admin: ${profile.displayName} (${profile.email})`;
  const weeks = await syncCourseFromCloud().catch(() => getCachedCourseData());
  dataStatus.textContent = Array.isArray(weeks) ? "Đã tải dữ liệu online." : "Lỗi tải dữ liệu.";
  initSelectors(weeks);
  document.querySelector("#admin-form").onsubmit = (event) => saveLesson(event, profile.email);
  document.querySelector("#reset-course-data").onclick = () => resetDefaultData(profile.email);
  fillForm();
});

function initSelectors(weeks) {
  weekSelect.innerHTML = weeks.map((week) => `<option value="${week.weekNumber}">Tuần ${week.weekNumber}</option>`).join("");
  daySelect.innerHTML = [1, 2, 3, 4].map((day) => `<option value="${day}">Ngày ${day}</option>`).join("");
  columnSelect.innerHTML = timetableColumns.map((column) => `<option value="${column.key}">${column.label}</option>`).join("");
  [weekSelect, daySelect, columnSelect].forEach((node) => node.onchange = fillForm);
}

function fillForm() {
  const lesson = currentLesson();
  if (!lesson) return;
  titleInput.value = lesson.title || "";
  audioInput.value = lesson.audioUrl || "";
  lessonInput.value = lesson.lessonUrl || "";
  descriptionInput.value = lesson.description || "";
  noteInput.value = lesson.note || "";
  saveMessage.textContent = "";
}

async function saveLesson(event, email) {
  event.preventDefault();
  const weeks = getCachedCourseData();
  const lesson = weeks.find((week) => week.weekNumber === Number(weekSelect.value))?.days[Number(daySelect.value) - 1]?.lessons[columnSelect.value];
  if (!lesson) return;
  lesson.title = titleInput.value.trim();
  lesson.audioUrl = audioInput.value.trim();
  lesson.lessonUrl = lessonInput.value.trim();
  lesson.description = descriptionInput.value.trim();
  lesson.note = noteInput.value.trim();
  await saveCourseOnline(weeks, email).then(() => {
    saveMessage.textContent = "Đã lưu online thành công";
  }).catch(() => {
    saveMessage.textContent = "Lưu thất bại. Kiểm tra Firestore rules.";
  });
}

function currentLesson() {
  return getCachedCourseData().find((week) => week.weekNumber === Number(weekSelect.value || 1))?.days[Number(daySelect.value || 1) - 1]?.lessons[columnSelect.value || timetableColumns[0].key];
}

async function resetDefaultData(email) {
  const confirmed = window.confirm("Reset toàn bộ dữ liệu khóa học về mặc định?");
  if (!confirmed) return;
  await saveCourseOnline(createDefaultCourseData(), email).then(() => {
    saveMessage.textContent = "Đã reset dữ liệu mặc định lên cloud";
    location.reload();
  }).catch(() => {
    saveMessage.textContent = "Reset thất bại. Kiểm tra Firestore rules.";
  });
}
