import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import QuizCard from "../../components/QuizCard";

export default function QuizList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const quizzes = storage.getQuizzes().filter((q) => q.published);

  const subjects = useMemo(
    () => ["all", ...Array.from(new Set(quizzes.map((q) => q.subject)))],
    [quizzes]
  );
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subject === "all" || q.subject === subject;
    const matchesDifficulty = difficulty === "all" || q.difficulty === difficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  function start(quiz) {
    navigate(`/student/quiz/${quiz.id}`);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Available Quizzes</h1>
          <p className="page-subtitle">Choose a quiz to begin</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="input"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Subjects" : s}</option>
          ))}
        </select>
        <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d === "all" ? "All Levels" : d}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes match your filters.</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map((q) => (
            <QuizCard key={q.id} quiz={q} onStart={start} />
          ))}
        </div>
      )}
    </div>
  );
}
