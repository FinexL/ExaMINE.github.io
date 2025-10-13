export function getAllowedModes(universityId, universities) {
  const uni = universities.find((u) => u.university_id === universityId);
  if (!uni) return [];


  if (typeof uni.modes === "string" && uni.modes.includes(",")) {
    return uni.modes.split(",").map((m) => m.trim());
  }


  return uni.modes ? [uni.modes] : [];
}
