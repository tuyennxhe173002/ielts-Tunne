const modal = document.querySelector("#lesson-modal");
const titleNode = document.querySelector("#modal-title");
const audioNode = document.querySelector("#modal-audio-link");
const lessonNode = document.querySelector("#modal-lesson-link");
const descriptionNode = document.querySelector("#modal-description");
const toggleNode = document.querySelector("#toggle-complete");

let lessonId = "";
let onToggle = () => {};

toggleNode?.addEventListener("click", () => onToggle(lessonId));

export function openLessonModal({ lesson, isCompleted, onCompletedChange }) {
  lessonId = lesson.id;
  onToggle = onCompletedChange;
  titleNode.textContent = lesson.title?.trim() || "Chưa nhập tiêu đề";
  audioNode.innerHTML = renderLink("Link Audio", lesson.audioUrl);
  lessonNode.innerHTML = renderLink("Link bài học", lesson.lessonUrl);
  descriptionNode.value = lesson.description || "";
  toggleNode.textContent = isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành";
  modal.showModal?.();
}

function renderLink(label, url) {
  const safe = toSafeUrl(url);
  return `${label}: ${safe ? `<a href="${safe}" target="_blank" rel="noreferrer">${safe}</a>` : "Chưa có"}`;
}

function toSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
}
