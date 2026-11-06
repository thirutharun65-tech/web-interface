// Reusable evaluation for a completed quiz attempt.
import { getGrade, isPass } from "./grading";

// answers: { [questionId]: optionIndex }
// quiz: full quiz object with questions[]
// returns a result summary object
export function evaluateQuiz(quiz, answers, timeTakenSeconds = 0) {
  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let obtainedMarks = 0;
  let totalMarks = 0;

  const breakdown = questions.map((q, index) => {
    const userAnswer = answers[q.id];
    const isUnanswered =
      userAnswer === undefined || userAnswer === null || userAnswer === "";
    const isCorrect = !isUnanswered && userAnswer === q.correctAnswer;
    const marks = isCorrect ? q.marks || 1 : 0;

    totalMarks += q.marks || 1;
    if (isUnanswered) unanswered += 1;
    else if (isCorrect) {
      correct += 1;
      obtainedMarks += marks;
    } else wrong += 1;

    return {
      questionId: q.id,
      index,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      userAnswer: isUnanswered ? null : userAnswer,
      isCorrect,
      isUnanswered,
      marks,
      maxMarks: q.marks || 1,
      explanation: q.explanation || "",
    };
  });

  const percentage =
    totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const passingPercentage = quiz.passingPercentage || 40;
  const passed = isPass(percentage, passingPercentage);
  const grade = getGrade(percentage);

  return {
    totalQuestions,
    correct,
    wrong,
    unanswered,
    obtainedMarks,
    totalMarks,
    percentage,
    grade,
    passed,
    passingPercentage,
    timeTakenSeconds,
    breakdown,
  };
}
