import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import LoginPage from "./pages/login.jsx";
import SignupPage from "./pages/signup.jsx";
import SetPasswordPage from "./pages/set-password.jsx";
import Logout from "./pages/logout.jsx";
import Evaluations from "./pages/evaluations/Evaluation.jsx";
import ViewEvaluation from "./pages/evaluations/ViewEvaluation.jsx";
import Cours from "./components/cours.jsx";
import MarkdownEditor from "./components/MarkdownEditor.jsx";
import { Home } from "./pages/home.jsx";
import { CoursPage } from "./pages/cours.jsx";
import { CoursDetails } from "./components/coursDetails.jsx";
import AdminRoute from "./pages/adminRoute.jsx";
import Users from "./components/crudUsers.jsx";
import Profile from "./components/profile.jsx";

import Users from "./components/users.jsx";
import AdminDashboard from "./components/admin-dashboard.jsx";

function App() {
  return (
    <Routes>
      {/* === Pages publiques === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />

      {/* === Pages protégées === */}
      <Route element={<ProtectedRoute />}>
        <Route path="/logout" element={<Logout />} />

        <Route element={<MainLayout />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<SignupPage />} />
            <Route path="/admin/cours" element={<Cours />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/cours" element={<CoursPage />} />
          <Route path="/cours/:id" element={<CoursDetails />} />
          <Route path="/ressource-documentation" element={<MarkdownEditor />} />
          <Route path="/evaluation" element={<Evaluations />} />
          {/* Page visualisation d'une éval (paramètre id) */}
          <Route path="/evaluations/:id" element={<ViewEvaluation />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
