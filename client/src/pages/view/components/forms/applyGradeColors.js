/**
 * Apply grade-based coloring to score cells in an ExcelJS worksheet
 * @param {Worksheet} worksheet - ExcelJS worksheet
 * @param {Object} criteria - { red, yellow, green, white } percentages
 * @param {number} rowStart - First row index containing data (1-based)
 * @param {number} rowEnd - Last row index containing data
 * @param {number[]} scoreCols - Array of column indexes (1-based) containing scores
 */
export const applyGradeColors = (
  worksheet,
  criteria,
  rowStart,
  rowEnd,
  scoreCols
) => {
  for (let r = rowStart; r <= rowEnd; r++) {
    const row = worksheet.getRow(r);

    scoreCols.forEach((col) => {
      const cell = row.getCell(col);
      const rawValue = cell.value ? cell.value.toString().trim() : "";

      // ✅ If null, empty, or explicitly "NO EXAM" → blue
      if (!rawValue || rawValue.toUpperCase() === "NO EXAM") {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "bbdefb" }, // blue
        };
        return;
      }

      // Parse score if it's in "score/total" format
      const value = rawValue.includes("/")
        ? parseFloat(rawValue.split("/")[0])
        : Number(rawValue);

      if (isNaN(value)) return;

      const maxItems = rawValue.includes("/")
        ? parseFloat(rawValue.split("/")[1])
        : value; // fallback if no total provided

      const redMax = Math.floor((criteria.red / 100) * maxItems);
      const yellowMax = Math.floor((criteria.yellow / 100) * maxItems);
      const greenMax = Math.floor((criteria.green / 100) * maxItems);
      const whiteMax = Math.floor((criteria.white / 100) * maxItems);

      let fillColor = null;

      if (value <= redMax) fillColor = "FFFF0000"; // red
      else if (value <= yellowMax) fillColor = "FFFFFF00"; // yellow
      else if (value <= greenMax) fillColor = "FF00FF00"; // green
      else if (value <= whiteMax) fillColor = "FFFFFFFF"; // white
      else fillColor = "FF000000"; // black

      if (fillColor) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
      }
    });
  }
};
