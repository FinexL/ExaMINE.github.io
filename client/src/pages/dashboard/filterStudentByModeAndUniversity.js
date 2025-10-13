export function filterStudentsByModeAndUniversity(students, mode, universityId = null) {
  return students.filter(s => s.modes === mode && (!universityId || s.university_id === universityId));
}
