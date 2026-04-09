export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  fullName: string;
  sessionId: string;
}
