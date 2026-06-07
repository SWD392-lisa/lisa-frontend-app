export const mockUser = {
  id: 'u1',
  email: 'user@example.com',
  persona_name: 'Skywalker',
  avatar_id: 'avatar_1',
  account_type: 'LUCY', // LUCY, Pro, Super
  xp: 1250,
  languages: [
    { code: 'EN', level: 'Stage 1 - Level 12' },
    { code: 'CN', level: 'Stage 1 - Level 3' }
  ],
  stats: {
    total_hours: 45,
    rooms_joined: 120
  }
};

export const mockRooms = [
  {
    id: 'r1',
    title: 'Daily English Conversation',
    language: 'EN',
    stage: 'Sơ cấp',
    level_id: 12,
    participants_count: 45,
    max_participants: 100,
    mentor: { name: 'Sarah Pro', avatar: 'mentor_1', rating: 4.9 },
    status: 'LIVE',
    tags: ['Speaking', 'Casual']
  },
  {
    id: 'r2',
    title: 'Business Japanese Keigo',
    language: 'JP',
    stage: 'Trung cấp',
    level_id: 45,
    participants_count: 12,
    max_participants: 50,
    mentor: { name: 'Tanaka Sensei', avatar: 'mentor_2', rating: 5.0 },
    status: 'Sắp bắt đầu',
    tags: ['Business', 'Grammar']
  },
  {
    id: 'r3',
    title: 'Luyện phát âm tiếng Trung',
    language: 'CN',
    stage: 'Sơ cấp',
    level_id: 5,
    participants_count: 89,
    max_participants: 100,
    mentor: { name: 'Li Wei', avatar: 'mentor_3', rating: 4.8 },
    status: 'LIVE',
    tags: ['Pronunciation']
  }
];

export const mockLevels = [
  { id: 1, title: 'Greetings & Introductions', stage: 'Sơ cấp', status: 'Hoàn thành', progress_pct: 100 },
  { id: 2, title: 'Numbers & Time', stage: 'Sơ cấp', status: 'Hoàn thành', progress_pct: 100 },
  { id: 3, title: 'Ordering Food', stage: 'Sơ cấp', status: 'Đang học', progress_pct: 60 },
  { id: 4, title: 'Asking for Directions', stage: 'Sơ cấp', status: 'Chưa học', progress_pct: 0 },
];
