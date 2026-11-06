// Renders a single question with selectable options.
export default function QuestionCard({ question, index, total, selectedAnswer, onSelect }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {index + 1} / {total}</span>
        <span className="question-marks">{question.marks || 1} Marks</span>
      </div>
      <h3 className="question-text">{question.text}</h3>
      <div className="question-options">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`option ${selectedAnswer === i ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === i}
              onChange={() => onSelect(i)}
            />
            <span className="option-letter">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="option-text">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
