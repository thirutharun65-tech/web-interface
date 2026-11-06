import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { storage } from "../../utils/storage";

export default function QuizResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const result = storage.getResult(resultId);
  const [showDetail, setShowDetail] = useState(false);

  if (!result) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Result not found.</p>
          <Link to="/student/results" className="btn btn-primary">Back to results</Link>
        </div>
      </div>
    );
  }

  const mins = Math.floor(result.timeTakenSeconds / 60);
  const secs = result.timeTakenSeconds % 60;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Result</h1>
          <p className="page-subtitle">{result.quizTitle}</p>
        </div>
        <Link to="/student/results" className="btn btn-outline">My Results</Link>
      </div>

      <div className={`result-banner ${result.passed ? "pass" : "fail"}`}>
        <div className="result-banner-score">
          {result.obtainedMarks} / {result.totalMarks}
        </div>
        <div className="result-banner-pct">{result.percentage}%</div>
        <div className="result-banner-stats">
          <div><span>Correct</span><strong>{result.correct}</strong></div>
          <div><span>Wrong</span><strong>{result.wrong}</strong></div>
          <div><span>Unanswered</span><strong>{result.unanswered}</strong></div>
          <div><span>Time</span><strong>{mins}m {secs}s</strong></div>
        </div>
        <div className="result-banner-grade">
          <span className="grade-badge large">{result.grade}</span>
          <span className={`status-badge ${result.passed ? "pass" : "fail"}`}>
            {result.passed ? "PASSED" : "FAILED"}
          </span>
        </div>
      </div>

      <div className="result-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowDetail((s) => !s)}
        >
          {showDetail ? "Hide Details" : "View Detailed Result"}
        </button>
        <Link to="/student/quizzes" className="btn btn-outline">Take Another Quiz</Link>
      </div>

      {showDetail && (
        <div className="detail-list">
          {result.breakdown.map((b, i) => (
            <div
              key={b.questionId}
              className={`detail-item ${b.isUnanswered ? "unanswered" : b.isCorrect ? "correct" : "wrong"}`}
            >
              <div className="detail-item-header">
                <span className="detail-q-number">Question {i + 1}</span>
                <span className="detail-status">
                  {b.isUnanswered
                    ? "Not Answered"
                    : b.isCorrect
                    ? "\u2713 Correct"
                    : "\u2717 Incorrect"}
                </span>
                <span className="detail-marks">{b.marks} / {b.maxMarks} Marks</span>
              </div>
              <div className="detail-q-text">{b.text}</div>
              <div className="detail-answers">
                <div className="detail-answer-row">
                  <span className="detail-answer-label">Your Answer:</span>
                  <span className="detail-answer-value">
                    {b.userAnswer === null
                      ? "Not Answered"
                      : `${String.fromCharCode(65 + b.userAnswer)}. ${b.options[b.userAnswer]}`}
                  </span>
                </div>
                <div className="detail-answer-row">
                  <span className="detail-answer-label">Correct Answer:</span>
                  <span className="detail-answer-value correct">
                    {String.fromCharCode(65 + b.correctAnswer)}. {b.options[b.correctAnswer]}
                  </span>
                </div>
                {b.explanation && (
                  <div className="detail-explanation">
                    <strong>Explanation:</strong> {b.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
