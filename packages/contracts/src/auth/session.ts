export interface SessionUserContract {
  id: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}
