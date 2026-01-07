import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import LoginPage from "./pages/login.jsx";
import SignupPage from "./pages/signup.jsx";
import Logout from "./pages/logout.jsx";
<<<<<<< HEAD
import Evaluations from "./pages/evaluations/Evaluation.jsx";
import ViewEvaluation from "./pages/evaluations/ViewEvaluation.jsx";
import Cours from "./pages/crudCours.jsx";

=======
import Cours from "./components/cours.jsx";
>>>>>>> origin/dev
function App() {
  return (
    <Routes>
      {/* === Pages publiques === */}
      <Route path="/login" element={<LoginPage />} />

      {/* === Pages protégées === */}
      <Route element={<ProtectedRoute />}>
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<MainLayout />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="cours" element={<Cours />} />
        <Route path="/evaluation" element={<Evaluations />} />
        {/* Page visualisation d'une éval (paramètre id) */}
        <Route path="/evaluations/:id" element={<ViewEvaluation />} />
      </Route>
    </Routes>
  );
}

export default App;
