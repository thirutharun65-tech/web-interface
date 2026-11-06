import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage, uid } from "../../utils/storage";
import { toast } from "../../components/Toast";

// Create or edit a quiz's metadata. After saving, admin is sent to the
// question management page to add questions.
export default function CreateQuiz() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "Medium",
    durationMinutes: 30,
    passingPercentage: 40,
  });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) {
      toast.error("Title and subject are required");
      return;
    }
    const quiz = {
      id: uid("quiz"),
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim(),
      difficulty: form.difficulty,
      durationMinutes: Number(form.durationMinutes) || 0,
      passingPercentage: Number(form.passingPercentage) || 40,
      published: false,
      createdAt: new Date().toISOString(),
      questions: [],
    };
    storage.saveQuiz(quiz);
    toast.success("Quiz created. Now add some questions.");
    navigate(`/admin/quizzes/${quiz.id}`);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Create Quiz</h1>
          <p className="page-subtitle">Fill in the quiz details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel form">
        <label className="form-label">
          Quiz Title
          <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </label>
        <label className="form-label">
          Description
          <textarea className="input" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </label>
        <div className="form-row">
          <label className="form-label">
            Subject
            <input className="input" value={form.subject} onChange={(e) => update("subject", e.target.value)} required />
          </label>
          <label className="form-label">
            Difficulty
            <select className="input" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label className="form-label">
            Duration (minutes)
            <input type="number" min={1} className="input" value={form.durationMinutes} onChange={(e) => update("durationMinutes", e.target.value)} />
          </label>
          <label className="form-label">
            Passing Percentage
            <input type="number" min={1} max={100} className="input" value={form.passingPercentage} onChange={(e) => update("passingPercentage", e.target.value)} />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Create Quiz</button>
      </form>
    </div>
  );
}
