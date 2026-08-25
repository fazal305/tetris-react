import { useCallback, useState } from 'react';
import { loadStats, saveStats, clearStats as clearStoredStats, loadHighScores, addHighScore, clearHighScores as clearStoredHighScores } from '../services/storage';

export function useGameStatistics() {
  const [stats, setStats] = useState(() => loadStats());
  const [highScores, setHighScores] = useState(() => loadHighScores());

  const recordGameEnd = useCallback(({ score, level, lines, tetrises, playTimeMs, piecesPlaced }) => {
    setStats((prev) => {
      const next = {
        gamesPlayed: prev.gamesPlayed + 1,
        linesCleared: prev.linesCleared + lines,
        tetrises: prev.tetrises + tetrises,
        bestScore: Math.max(prev.bestScore, score),
        bestLevel: Math.max(prev.bestLevel, level),
        longestGameMs: Math.max(prev.longestGameMs, playTimeMs),
        totalPlayTimeMs: prev.totalPlayTimeMs + playTimeMs,
        piecesPlaced: prev.piecesPlaced + piecesPlaced,
      };
      saveStats(next);
      return next;
    });

    if (score > 0) {
      const entry = { score, level, lines, date: new Date().toISOString() };
      const updated = addHighScore(entry);
      setHighScores(updated);
      return updated[0]?.score === score && updated[0]?.date === entry.date;
    }
    return false;
  }, []);

  const clearStats = useCallback(() => {
    clearStoredStats();
    setStats(loadStats());
  }, []);

  const clearHighScores = useCallback(() => {
    clearStoredHighScores();
    setHighScores([]);
  }, []);

  return { stats, highScores, recordGameEnd, clearStats, clearHighScores };
}
