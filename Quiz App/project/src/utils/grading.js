// Reusable grading helper for quiz results.

export function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";
}

export function isPass(percentage, passingPercentage) {
  return percentage >= passingPercentage;
}
