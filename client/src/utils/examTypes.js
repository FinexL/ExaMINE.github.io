export const examTypesByMode = {
  Onsite: ["Post Test", "Preboard 1", "Final Preboard"],
  Inhouse: ["Prelim", "Midterm", "Finals"],
};

export function getExamTypes(mode) {
  return examTypesByMode[mode] || [];
}
