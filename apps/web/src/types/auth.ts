export type MeResponse = {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
};

export type DashboardResponse = {
  totalCourses: number;
  completedLessons: number;
  continueLearning: { lesson: { id: string; title: string; course: { slug: string; title: string } } } | null;
  recentProgress: Array<{ id: string; status: string; lesson: { id: string; title: string; course: { slug: string; title: string } } }>;
};
