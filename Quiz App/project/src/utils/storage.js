// localStorage-backed data store for the quiz app.
// All reads/writes go through here so the rest of the app stays clean.

const KEYS = {
  USERS: "quiz_users",
  CURRENT_USER: "quiz_current_user",
  QUIZZES: "quizzes",
  RESULTS: "results",
  PROGRESS: "quiz_progress",
  THEME: "quiz_theme",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  KEYS,

  // ---- Users ----
  getUsers: () => read(KEYS.USERS, []),
  setUsers: (users) => write(KEYS.USERS, users),
  findUser: (email) =>
    read(KEYS.USERS, []).find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    ),
  addUser: (user) => {
    const users = read(KEYS.USERS, []);
    users.push(user);
    write(KEYS.USERS, users);
  },
  updateUser: (email, patch) => {
    const users = read(KEYS.USERS, []).map((u) =>
      u.email.toLowerCase() === String(email).toLowerCase()
        ? { ...u, ...patch }
        : u
    );
    write(KEYS.USERS, users);
    return users;
  },

  // ---- Current user (session) ----
  getCurrentUser: () => read(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => write(KEYS.CURRENT_USER, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER),

  // ---- Quizzes ----
  getQuizzes: () => read(KEYS.QUIZZES, []),
  setQuizzes: (quizzes) => write(KEYS.QUIZZES, quizzes),
  getQuiz: (id) => read(KEYS.QUIZZES, []).find((q) => q.id === id),
  saveQuiz: (quiz) => {
    const quizzes = read(KEYS.QUIZZES, []);
    const idx = quizzes.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) quizzes[idx] = quiz;
    else quizzes.push(quiz);
    write(KEYS.QUIZZES, quizzes);
  },
  deleteQuiz: (id) => {
    write(
      KEYS.QUIZZES,
      read(KEYS.QUIZZES, []).filter((q) => q.id !== id)
    );
  },

  // ---- Results ----
  getResults: () => read(KEYS.RESULTS, []),
  setResults: (results) => write(KEYS.RESULTS, results),
  addResult: (result) => {
    const results = read(KEYS.RESULTS, []);
    results.unshift(result);
    write(KEYS.RESULTS, results);
  },
  getResult: (id) => read(KEYS.RESULTS, []).find((r) => r.id === id),

  // ---- In-progress quiz answers (survive refresh) ----
  getProgress: (quizId) => {
    const all = read(KEYS.PROGRESS, {});
    return all[quizId] || null;
  },
  saveProgress: (quizId, progress) => {
    const all = read(KEYS.PROGRESS, {});
    all[quizId] = progress;
    write(KEYS.PROGRESS, all);
  },
  clearProgress: (quizId) => {
    const all = read(KEYS.PROGRESS, {});
    delete all[quizId];
    write(KEYS.PROGRESS, all);
  },

  // ---- Theme ----
  getTheme: () => read(KEYS.THEME, "light"),
  setTheme: (theme) => write(KEYS.THEME, theme),
};

export function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
