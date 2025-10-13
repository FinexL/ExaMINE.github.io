// src/utils/computeGradeColor.js
export const computeGradeColor = (score, maxItems, criteria) => {
  if (score === null || score === undefined) return "blue";
  if (score < 0 || score > maxItems) return "black";

  const red = criteria?.red ?? 0;
  const yellow = criteria?.yellow ?? 0;
  const green = criteria?.green ?? 0;
  const white = criteria?.white ?? 100;

  const redMax = Math.floor((red / 100) * maxItems);
  const yellowMax = Math.floor((yellow / 100) * maxItems);
  const greenMax = Math.floor((green / 100) * maxItems);
  const whiteMax = Math.floor((white / 100) * maxItems);

  if (score <= redMax) return "red";
  if (score <= yellowMax) return "yellow";
  if (score <= greenMax) return "green";
  if (score <= whiteMax) return "white";

  return "black";
};
