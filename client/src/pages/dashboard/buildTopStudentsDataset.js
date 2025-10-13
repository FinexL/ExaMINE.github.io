export function buildTopStudentsDataset(rows, rawGrades, selectedExamType, universityId = null) {
  if (!rows.length || !rawGrades.grades.length) return [];

  const gradesByStudent = new Map();
  rawGrades.grades.forEach((g) => {
    if (!gradesByStudent.has(g.student_id)) gradesByStudent.set(g.student_id, []);
    gradesByStudent.get(g.student_id).push(g);
  });

  return rows
    .filter(student => !universityId || student.university_id === universityId)
    .map((student) => {
      const studentGrades = gradesByStudent.get(student.student_id) || [];
      const filteredGrades = selectedExamType
        ? studentGrades.filter((g) => g.exam_type === selectedExamType)
        : studentGrades;

      const totalScore = filteredGrades.reduce((sum, g) => sum + (g.score ?? 0), 0);
      const totalItems = filteredGrades.reduce((sum, g) => {
        const subjScore = rawGrades.subjects.find((s) => s.score_id === g.score_id);
        return sum + (subjScore?.items ?? 0);
      }, 0);

      const percent = totalItems > 0 ? ((totalScore / totalItems) * 100).toFixed(1) : 0;

      return {
        studentName: student.studentName,
        totalScore,
        totalItems,
        percent,
      };
    })
    .sort((a, b) => b.percent - a.percent);
}
