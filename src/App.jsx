import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import LoginPage from "./pages/login.jsx";
import SignupPage from "./pages/signup.jsx";
import Logout from "./pages/logout.jsx";
import Cours from "./components/cours.jsx";
import Users from "./components/users.jsx";
import AdminDashboard from "./components/admin-dashboard.jsx";

function App() {
  return (
    <Routes>
      {/* === Pages publiques === */}
      <Route path="/login" element={<LoginPage />} />

      {/* === Pages protégées === */}
      <Route element={<ProtectedRoute />}>
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="users" element={<Users />} />
          <Route path="cours" element={<Cours />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default App;
