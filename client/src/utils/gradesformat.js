// src/utils/grades.js

/**
 * Format score for display
 */
export const formatScore = (value) => {
  if (value === null || value === undefined || value === "") {
    return "No Exam";
  }
  return value;
};

/**
 * Wrapper for MUI DataGrid valueFormatter
 */
export const scoreValueFormatter = (params) => formatScore(params.value);

/**
 * Get color based on score thresholds
 * @param {number|string} score - The numeric score or "No Exam"
 * @param {number} whitescore - Threshold for white
 * @param {number} greenscore - Threshold for green
 * @param {number} yellowscore - Threshold for yellow
 * @param {number} redscore - Threshold for red
 * @returns {string} CSS color
 */
export const getGradeColor = (score, whitescore, greenscore, yellowscore, redscore) => {
  if (score === null || score === undefined || score === "No Exam" || score === "") {
    return "gray";
  }

  const num = Number(score);
  if (isNaN(num)) return "gray";

  if (num >= whitescore) return "white";
  if (num >= greenscore) return "green";
  if (num >= yellowscore) return "yellow";
  if (num >= redscore) return "red";

  return "darkred";
};
