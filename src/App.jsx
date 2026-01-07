import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import LoginPage from "./pages/login.jsx";
import SignupPage from "./pages/signup.jsx";
import Logout from "./pages/logout.jsx";
import Ressources from "./pages/ressources.jsx";
import AdminRoute from "./pages/adminRoute.jsx";

function App() {
	return (
		<Routes>
			{/* === Pages publiques === */}
			<Route path="/login" element={<LoginPage />} />

			{/* === Pages protégées === */}
			<Route element={<ProtectedRoute />}>
				<Route element={<AdminRoute />}>
					<Route path="/signup" element={<SignupPage />} />
					{/* Ajoutez ici les routes accessibles uniquement par les admins */}
				</Route>
				<Route path="/logout" element={<Logout />} />
				<Route path="/" element={<MainLayout />} />
				<Route path="/ressources" element={<Ressources />} />
			</Route>
		</Routes>
	);
}

export default App;
