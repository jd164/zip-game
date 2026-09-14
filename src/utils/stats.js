const STATS_KEY = 'zip_game_stats';

/**
 * Default stats structure
 */
const defaultStats = () => ({
  totalGames: 0,
  totalWins: 0,
  totalTimeSec: 0,
  bestTimes: {}, // key: "5_easy", "6_medium", etc. → seconds
  winsBySize: { 5: 0, 6: 0, 7: 0 },
  winsByDifficulty: { easy: 0, medium: 0, hard: 0 },
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
});

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage errors
  }
}

/**
 * Record a completed game win.
 * @param {number} size - grid size (5,6,7)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} timeInSeconds
 */
export function recordWin(size, difficulty, timeInSeconds) {
  const stats = loadStats();
  const today = new Date().toDateString();
  const key = `${size}_${difficulty}`;

  stats.totalGames = (stats.totalGames || 0) + 1;
  stats.totalWins = (stats.totalWins || 0) + 1;
  stats.totalTimeSec = (stats.totalTimeSec || 0) + timeInSeconds;

  // Best time per size+difficulty
  if (!stats.bestTimes) stats.bestTimes = {};
  if (stats.bestTimes[key] === undefined || timeInSeconds < stats.bestTimes[key]) {
    stats.bestTimes[key] = timeInSeconds;
  }

  // Wins by size
  if (!stats.winsBySize) stats.winsBySize = { 5: 0, 6: 0, 7: 0 };
  stats.winsBySize[size] = (stats.winsBySize[size] || 0) + 1;

  // Wins by difficulty
  if (!stats.winsByDifficulty) stats.winsByDifficulty = { easy: 0, medium: 0, hard: 0 };
  stats.winsByDifficulty[difficulty] = (stats.winsByDifficulty[difficulty] || 0) + 1;

  // Streak logic (once per day)
  if (!stats.lastPlayedDate) {
    stats.currentStreak = 1;
  } else {
    const last = new Date(stats.lastPlayedDate);
    const now = new Date();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      // same day, streak unchanged
    } else if (diffDays === 1) {
      stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else {
      stats.currentStreak = 1;
    }
  }
  stats.lastPlayedDate = today;
  stats.bestStreak = Math.max(stats.bestStreak || 0, stats.currentStreak);

  saveStats(stats);
  return stats;
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(secs) {
  if (secs === undefined || secs === null) return '--:--';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Average time in seconds
 */
export function avgTime(stats) {
  if (!stats.totalWins) return null;
  return Math.round(stats.totalTimeSec / stats.totalWins);
}
