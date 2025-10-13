export const formatScore = (value) => {
  if (value === null || value === undefined || value === "") {
    return "No Exam";
  }
  return value;
};


export const scoreValueFormatter = (params) => formatScore(params.value);