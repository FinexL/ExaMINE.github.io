export function calculateTotalScore(rowData, filteredSubjects) {
  let total = 0;
  let maxTotal = 0;

  filteredSubjects.forEach((subj) => {
    const key = `score_${subj.score_id}`;
    const score = Number(rowData[key]) || 0;
    const items = Number(subj.items) || 0;

    total += score;
    maxTotal += items;
  });

  return { total, maxTotal };
}

export function calculatePercentage(total, maxTotal) {
  return maxTotal > 0 ? (total / maxTotal) * 100 : 0;
}