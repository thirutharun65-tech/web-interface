import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import QuizCard from "../../components/QuizCard";
import { toast } from "../../components/Toast";
import Modal from "../../components/Modal";

export default function ManageQuizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(storage.getQuizzes());
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  function refresh() {
    setQuizzes(storage.getQuizzes());
  }

  function togglePublish(quiz) {
    const updated = { ...quiz, published: !quiz.published };
    storage.saveQuiz(updated);
    refresh();
    toast.success(updated.published ? "Quiz published" : "Quiz unpublished");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    storage.deleteQuiz(deleteTarget.id);
    setDeleteTarget(null);
    refresh();
    toast.success("Quiz deleted");
  }

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Manage Quizzes</h1>
          <p className="page-subtitle">Create, edit, publish, and delete quizzes</p>
        </div>
        <Link to="/admin/quizzes/create" className="btn btn-primary">Create Quiz</Link>
      </div>

      <div className="filter-bar">
        <input
          className="input"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes found.</p>
          <Link to="/admin/quizzes/create" className="btn btn-primary">Create your first quiz</Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map((q) => (
            <QuizCard
              key={q.id}
              quiz={q}
              admin
              onTogglePublish={togglePublish}
              onEdit={(quiz) => navigate(`/admin/quizzes/${quiz.id}`)}
              onDelete={(quiz) => setDeleteTarget(quiz)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Quiz?"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
