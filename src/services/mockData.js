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

// Mock mentor user — use this to test mentor-specific UI
export const mockMentorUser = {
  id: 'm1',
  email: 'mentor@example.com',
  persona_name: 'Sarah Pro',
  avatar_id: 'avatar_mentor_1',
  account_type: 'MENTOR',
  xp: 4800,
  languages: [
    { code: 'EN', level: 'Native' }
  ],
  stats: {
    total_hours: 320,
    rooms_hosted: 85
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

// ---------------------------------------------------------------------------
// Mentor LMS Mock Data
// ---------------------------------------------------------------------------

export const mockSubLevels = [
  {
    subLevelId: 'sl1',
    title: 'Sub-Level 1: Self Introduction',
    topic: 'Introducing Yourself',
    description: 'Learners practice introducing themselves using name, nationality, and occupation vocabulary.',
    order: 1,
    speakingTasks: [
      { taskId: 't1', prompt: 'Introduce yourself in 3 sentences. Include your name, where you are from, and what you do.', durationSeconds: 60, completed: false },
      { taskId: 't2', prompt: 'Ask your partner two questions to learn about them.', durationSeconds: 90, completed: false },
      { taskId: 't3', prompt: 'Describe a friend to the group using adjectives.', durationSeconds: 60, completed: false },
    ]
  },
  {
    subLevelId: 'sl2',
    title: 'Sub-Level 2: Greetings in Context',
    topic: 'Formal & Informal Greetings',
    description: 'Practice distinguishing formal vs informal greetings in real-world scenarios.',
    order: 2,
    speakingTasks: [
      { taskId: 't4', prompt: 'Greet someone you just met at a business conference.', durationSeconds: 45, completed: false },
      { taskId: 't5', prompt: 'Greet an old friend you haven\'t seen in a year.', durationSeconds: 45, completed: false },
      { taskId: 't6', prompt: 'Role-play: You are a receptionist greeting a visitor.', durationSeconds: 90, completed: false },
    ]
  },
  {
    subLevelId: 'sl3',
    title: 'Sub-Level 3: Small Talk',
    topic: 'Making Conversation',
    description: 'Develop the ability to sustain casual conversation on familiar topics.',
    order: 3,
    speakingTasks: [
      { taskId: 't7', prompt: 'Talk about your weekend plans for 1 minute.', durationSeconds: 60, completed: false },
      { taskId: 't8', prompt: 'Ask your partner about their hobbies and share yours.', durationSeconds: 90, completed: false },
    ]
  }
];

export const mockLearningContext = {
  roomId: 'r1',
  sessionId: 'sess_001',
  sessionStatus: 'ACTIVE',
  currentLevel: {
    levelId: 1,
    title: 'Greetings & Introductions',
    stage: 'Sơ cấp'
  },
  currentSubLevel: mockSubLevels[0],
  availableLevels: [
    { levelId: 1, title: 'Greetings & Introductions', stage: 'Sơ cấp' },
    { levelId: 2, title: 'Numbers & Time', stage: 'Sơ cấp' },
    { levelId: 3, title: 'Ordering Food', stage: 'Sơ cấp' },
    { levelId: 4, title: 'Asking for Directions', stage: 'Sơ cấp' },
  ],
  pinnedLevelId: 1
};

export const mockMentorDashboard = {
  mentorUserId: 'm1',
  mentorName: 'Sarah Pro',
  totalSessions: 85,
  activeSessions: 2,
  completedSessions: 83,
  totalSpeakingMinutes: 4320,
  currentSession: {
    sessionId: 'sess_001',
    roomId: 'r1',
    roomTitle: 'Daily English Conversation',
    status: 'ACTIVE',
    currentLevel: 'Greetings & Introductions',
    currentSubLevel: 'Sub-Level 1: Self Introduction',
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    speakingMinutes: 25,
    learnerCount: 45
  },
  recentSessions: [
    {
      sessionId: 'sess_099',
      roomId: 'r1',
      roomTitle: 'Daily English Conversation',
      status: 'ENDED',
      currentLevel: 'Numbers & Time',
      currentSubLevel: 'Sub-Level 3: Telling Time',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      speakingMinutes: 58,
      learnerCount: 38
    },
    {
      sessionId: 'sess_098',
      roomId: 'r2',
      roomTitle: 'Advanced Vocabulary Building',
      status: 'ENDED',
      currentLevel: 'Ordering Food',
      currentSubLevel: 'Sub-Level 2: Restaurant Roleplay',
      startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      speakingMinutes: 44,
      learnerCount: 22
    }
  ],
  learnerSummaries: [
    { learnerId: 'l1', learnerName: 'Nguyen Van A', completedSubLevels: 3, totalSubLevels: 3, completionPercent: 100 },
    { learnerId: 'l2', learnerName: 'Tran Thi B', completedSubLevels: 2, totalSubLevels: 3, completionPercent: 67 },
    { learnerId: 'l3', learnerName: 'Le Van C', completedSubLevels: 1, totalSubLevels: 3, completionPercent: 33 },
    { learnerId: 'l4', learnerName: 'Pham Thi D', completedSubLevels: 3, totalSubLevels: 3, completionPercent: 100 },
    { learnerId: 'l5', learnerName: 'Hoang Van E', completedSubLevels: 0, totalSubLevels: 3, completionPercent: 0 },
  ]
};
