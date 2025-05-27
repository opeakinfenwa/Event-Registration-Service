INSERT INTO users (
  id,
  google_id,
  email,
  name,
  password,
  auth_provider,
  role,
  security_question,
  security_answer,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'google-abc123',
  'john.doe@example.com',
  'John Doe',
  'hashed_password',
  'local',
  'attendee',
  'What is your favorite color?',
  'Blue',
  NOW(),
  NOW()
);