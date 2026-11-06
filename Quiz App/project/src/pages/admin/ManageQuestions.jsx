import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { storage, uid } from "../../utils/storage";
import { toast } from "../../components/Toast";
import Modal from "../../components/Modal";

// Manage questions for a single quiz: add, edit, delete, reorder, and publish.
export default function ManageQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(storage.getQuiz(quizId));

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const blank = {
    id: "",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    marks: 2,
    explanation: "",
  };
  const [form, setForm] = useState(blank);

  if (!quiz) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Quiz not found.</p>
          <Link to="/admin/quizzes" className="btn btn-primary">Back</Link>
        </div>
      </div>
    );
  }

  function persist(updated) {
    storage.saveQuiz(updated);
    setQuiz(updated);
  }

  function openAdd() {
    setEditingId(null);
    setForm(blank);
    setShowForm(true);
  }

  function openEdit(q) {
    setEditingId(q.id);
    setForm({ ...q, options: [...q.options] });
    setShowForm(true);
  }

  function saveQuestion(e) {
    e.preventDefault();
    if (!form.text.trim() || form.options.some((o) => !o.trim())) {
      toast.error("Question text and all options are required");
      return;
    }
    let questions = [...quiz.questions];
    if (editingId) {
      questions = questions.map((q) => (q.id === editingId ? { ...form } : q));
    } else {
      questions.push({ ...form, id: uid("q") });
    }
    persist({ ...quiz, questions });
    setShowForm(false);
    toast.success(editingId ? "Question updated" : "Question added");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    persist({ ...quiz, questions: quiz.questions.filter((q) => q.id !== deleteTarget.id) });
    setDeleteTarget(null);
    toast.success("Question deleted");
  }

  function move(index, dir) {
    const questions = [...quiz.questions];
    const target = index + dir;
    if (target < 0 || target >= questions.length) return;
    [questions[index], questions[target]] = [questions[target], questions[index]];
    persist({ ...quiz, questions });
  }

  function togglePublish() {
    if (!quiz.published && quiz.questions.length === 0) {
      toast.error("Add at least one question before publishing");
      return;
    }
    const updated = { ...quiz, published: !quiz.published };
    persist(updated);
    toast.success(updated.published ? "Quiz published" : "Quiz unpublished");
  }

  function updateOption(i, value) {
    setForm((f) => {
      const options = [...f.options];
      options[i] = value;
      return { ...f, options };
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{quiz.title}</h1>
          <p className="page-subtitle">
            {quiz.subject} &middot; {quiz.questions.length} questions &middot;{" "}
            {quiz.published ? "Published" : "Unpublished"}
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/admin/quizzes" className="btn btn-outline">Back</Link>
          <button className="btn btn-primary" onClick={openAdd}>Add Question</button>
          <button
            className={quiz.published ? "btn btn-outline" : "btn btn-success"}
            onClick={togglePublish}
          >
            {quiz.published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {quiz.questions.length === 0 ? (
        <div className="empty-state">
          <p>No questions yet. Add your first question.</p>
          <button className="btn btn-primary" onClick={openAdd}>Add Question</button>
        </div>
      ) : (
        <div className="question-admin-list">
          {quiz.questions.map((q, i) => (
            <div key={q.id} className="question-admin-item">
              <div className="qa-num">Q{i + 1}</div>
              <div className="qa-body">
                <div className="qa-text">{q.text}</div>
                <div className="qa-options">
                  {q.options.map((opt, oi) => (
                    <span
                      key={oi}
                      className={`qa-option ${oi === q.correctAnswer ? "correct" : ""}`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {oi === q.correctAnswer ? " \u2713" : ""}
                    </span>
                  ))}
                </div>
                <div className="qa-meta">{q.marks} marks</div>
              </div>
              <div className="qa-controls">
                <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</button>
                <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === quiz.questions.length - 1} title="Move down">↓</button>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(q)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(q)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingId ? "Edit Question" : "Add Question"}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveQuestion}>
              {editingId ? "Update" : "Add"} Question
            </button>
          </>
        }
      >
        <form onSubmit={saveQuestion} className="form">
          <label className="form-label">
            Question
            <textarea className="input" rows={2} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
          </label>
          {form.options.map((opt, i) => (
            <label key={i} className="form-label">
              Option {String.fromCharCode(65 + i)}
              <input className="input" value={opt} onChange={(e) => updateOption(i, e.target.value)} />
            </label>
          ))}
          <label className="form-label">
            Correct Answer
            <select className="input" value={form.correctAnswer} onChange={(e) => setForm((f) => ({ ...f, correctAnswer: Number(e.target.value) }))}>
              {form.options.map((_, i) => (
                <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label className="form-label">
              Marks
              <input type="number" min={1} className="input" value={form.marks} onChange={(e) => setForm((f) => ({ ...f, marks: Number(e.target.value) }))} />
            </label>
          </div>
          <label className="form-label">
            Explanation
            <textarea className="input" rows={2} value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} />
          </label>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Question?"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete this question?</p>
      </Modal>
    </div>
  );
}
