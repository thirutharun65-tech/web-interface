// Quiz card shown on the student quiz list and admin quiz list.
export default function QuizCard({ quiz, onStart, onEdit, onDelete, onTogglePublish, admin = false }) {
  const totalMarks = (quiz.questions || []).reduce(
    (sum, q) => sum + (q.marks || 1),
    0
  );

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <h3 className="quiz-card-title">{quiz.title}</h3>
        <span className={`difficulty-badge difficulty-${(quiz.difficulty || "medium").toLowerCase()}`}>
          {quiz.difficulty || "Medium"}
        </span>
      </div>
      <p className="quiz-card-desc">{quiz.description}</p>
      <div className="quiz-card-meta">
        <span>{(quiz.questions || []).length} Questions</span>
        <span>{totalMarks} Marks</span>
        <span>{quiz.durationMinutes} Min</span>
      </div>
      <div className="quiz-card-footer">
        <div className="quiz-card-subject">{quiz.subject}</div>
        {admin ? (
          <div className="quiz-card-actions">
            {onTogglePublish && (
              <button
                className={quiz.published ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                onClick={() => onTogglePublish(quiz)}
              >
                {quiz.published ? "Unpublish" : "Publish"}
              </button>
            )}
            {onEdit && (
              <button className="btn btn-outline btn-sm" onClick={() => onEdit(quiz)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(quiz)}>
                Delete
              </button>
            )}
          </div>
        ) : (
          <div className="quiz-card-actions">
            {quiz.published ? (
              <button className="btn btn-primary btn-sm" onClick={() => onStart(quiz)}>
                Start Quiz
              </button>
            ) : (
              <span className="badge badge-muted">Unpublished</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
