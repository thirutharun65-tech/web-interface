import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storage, uid } from "../../utils/storage";
import { evaluateQuiz } from "../../utils/evaluation";
import { toast } from "../../components/Toast";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import ProgressBar from "../../components/ProgressBar";
import Modal from "../../components/Modal";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = storage.getCurrentUser();
  const quiz = storage.getQuiz(quizId);

  const questions = quiz?.questions || [];
  const totalSeconds = (quiz?.durationMinutes || 0) * 60;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [startTime] = useState(Date.now());
  const [running, setRunning] = useState(true);
  const submittedRef = useRef(false);

  // Restore any saved progress so a refresh doesn't lose answers.
  useEffect(() => {
    const saved = storage.getProgress(quizId);
    if (saved) {
      setAnswers(saved.answers || {});
      setMarked(saved.marked || {});
    }
  }, [quizId]);

  // Persist progress to localStorage on every change.
  useEffect(() => {
    storage.saveProgress(quizId, { answers, marked, current, startTime });
  }, [answers, marked, current, startTime, quizId]);

  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined && v !== null
  ).length;

  function selectAnswer(optionIndex) {
    setAnswers((prev) => ({ ...prev, [questions[current].id]: optionIndex }));
  }

  function toggleMark() {
    setMarked((prev) => ({ ...prev, [questions[current].id]: !prev[questions[current].id] }));
  }

  function goNext() {
    setCurrent((c) => Math.min(c + 1, questions.length - 1));
  }
  function goPrev() {
    setCurrent((c) => Math.max(c - 1, 0));
  }

  function doSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setRunning(false);

    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
    const result = evaluateQuiz(quiz, answers, timeTakenSeconds);

    const record = {
      id: uid("result"),
      studentEmail: user.email,
      studentName: user.name,
      quizId: quiz.id,
      quizTitle: quiz.title,
      ...result,
      date: new Date().toISOString(),
    };
    storage.addResult(record);
    storage.clearProgress(quizId);
    toast.success("Quiz submitted!");
    navigate(`/student/result/${record.id}`);
  }

  if (!quiz) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Quiz not found.</p>
          <button className="btn btn-primary" onClick={() => navigate("/student/quizzes")}>
            Back to quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quiz.published) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>This quiz is not currently published.</p>
          <button className="btn btn-primary" onClick={() => navigate("/student/quizzes")}>
            Back to quizzes
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const unanswered = questions.length - answeredCount;

  return (
    <div className="take-quiz">
      <div className="take-quiz-header">
        <div>
          <h1>{quiz.title}</h1>
          <p className="page-subtitle">{quiz.subject} &middot; {quiz.difficulty}</p>
        </div>
        <Timer seconds={totalSeconds} onExpire={doSubmit} running={running} />
      </div>

      <ProgressBar
        value={answeredCount}
        max={questions.length}
        label={`${answeredCount} of ${questions.length} answered`}
      />

      <div className="take-quiz-body">
        <div className="take-quiz-main">
          <QuestionCard
            question={q}
            index={current}
            total={questions.length}
            selectedAnswer={answers[q.id]}
            onSelect={selectAnswer}
          />
          <div className="question-actions">
            <button
              className="btn btn-outline"
              onClick={goPrev}
              disabled={current === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-outline"
              onClick={toggleMark}
            >
              {marked[q.id] ? "Unmark" : "Mark for Review"}
            </button>
            <button
              className="btn btn-primary"
              onClick={goNext}
              disabled={current === questions.length - 1}
            >
              Next
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowSubmit(true)}
            >
              Submit
            </button>
          </div>
        </div>

        <aside className="question-palette">
          <h3>Questions</h3>
          <div className="palette-grid">
            {questions.map((qq, i) => {
              const isAnswered = answers[qq.id] !== undefined && answers[qq.id] !== null;
              const isMarked = marked[qq.id];
              const isCurrent = i === current;
              let cls = "palette-item";
              if (isCurrent) cls += " current";
              else if (isAnswered) cls += " answered";
              else cls += " unanswered";
              if (isMarked) cls += " marked";
              return (
                <button
                  key={qq.id}
                  className={cls}
                  onClick={() => setCurrent(i)}
                  title={isAnswered ? "Answered" : "Not answered"}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="palette-legend">
            <div><span className="dot answered" /> Answered</div>
            <div><span className="dot unanswered" /> Unanswered</div>
            <div><span className="dot marked" /> Marked</div>
          </div>
        </aside>
      </div>

      <Modal
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        title="Submit Quiz?"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowSubmit(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={doSubmit}>
              Submit Quiz
            </button>
          </>
        }
      >
        <p>Are you sure you want to submit?</p>
        <div className="submit-summary">
          <div className="submit-summary-row">
            <span>Answered</span>
            <strong>{answeredCount} / {questions.length}</strong>
          </div>
          <div className="submit-summary-row">
            <span>Unanswered</span>
            <strong>{unanswered}</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}
