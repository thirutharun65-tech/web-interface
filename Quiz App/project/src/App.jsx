import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { seedIfEmpty } from "./data/defaultData";
import { storage } from "./utils/storage";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import QuizList from "./pages/student/QuizList";
import TakeQuiz from "./pages/student/TakeQuiz";
import QuizResult from "./pages/student/QuizResult";
import ResultHistory from "./pages/student/ResultHistory";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import CreateQuiz from "./pages/admin/CreateQuiz";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageResults from "./pages/admin/ManageResults";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  useEffect(() => {
    seedIfEmpty();
    document.documentElement.setAttribute("data-theme", storage.getTheme());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route
          element={
            <ProtectedRoute role="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/quizzes" element={<QuizList />} />
          <Route path="/student/quiz/:quizId" element={<TakeQuiz />} />
          <Route path="/student/result/:resultId" element={<QuizResult />} />
          <Route path="/student/results" element={<ResultHistory />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/settings" element={<Settings />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/quizzes" element={<ManageQuizzes />} />
          <Route path="/admin/quizzes/create" element={<CreateQuiz />} />
          <Route path="/admin/quizzes/:quizId" element={<ManageQuestions />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/results" element={<ManageResults />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}

export default App;
