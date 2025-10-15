// src/utils/colorMap.js

export const gradeColors = {
  red: { bg: "#FCA5A5", text: "#4A1C1C" },
  yellow: { bg: "#FDE68A", text: "#4A3B00" },
  green: { bg: "#A7F3D0", text: "#064E3B" },
  blue: { bg: "#BFDBFE", text: "#1E3A8A" },
  black: { bg: "#1F2937", text: "#F9FAFB" },
  white: { bg: "#F3F4F6", text: "#111827" },
};

/**
 * Get table cell style based on color key.
 */
export function getCellStyle(colorKey) {
  const color = gradeColors[colorKey] || gradeColors.white;
  return {
    backgroundColor: color.bg,
    color: color.text,
  };
}

/**
 * Get chart color based on color key.
 */
export function getChartColor(colorKey) {
  return gradeColors[colorKey]?.bg || gradeColors.white.bg;
}

/**
 * Get recommendation card styles (green for positive, red for alert)
 */
export function getRecommendationStyle(isAlert) {
  return {
    backgroundColor: isAlert ? "#ffebee" : "#e8f5e9",
    borderLeft: isAlert ? "6px solid #f44336" : "6px solid #4caf50",
    textColor: isAlert ? "#b71c1c" : "#1b5e20",
  };
}
