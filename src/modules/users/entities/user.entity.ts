export interface UserEntity {
  id: string;
  google_id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'attendee' | 'super_admin';
  auth_provider: 'local' | 'google';
  security_question: string;
  security_answer: string;
}
