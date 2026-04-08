import { timetableColumns } from "../config/columns.js";

export function createDefaultCourseData() {
  return Array.from({ length: 48 }, (_, weekIndex) => ({
    weekNumber: weekIndex + 1,
    title: `Tuần ${weekIndex + 1}`,
    objective: `Lộ trình học tuần ${weekIndex + 1}. Bạn có thể sửa trực tiếp trên trang quản trị.`,
    days: Array.from({ length: 4 }, (_, dayIndex) => ({
      label: `Ngày ${dayIndex + 1}`,
      lessons: Object.fromEntries(
        timetableColumns.map((column) => [column.key, createLesson(weekIndex + 1, dayIndex + 1, column)])
      )
    }))
  }));
}

function createLesson(weekNumber, dayNumber, column) {
  return {
    id: `W${String(weekNumber).padStart(2, "0")}-D${dayNumber}-${column.key}`,
    title: "",
    description: "",
    note: "",
    lessonUrl: "",
    audioUrl: ""
  };
}
