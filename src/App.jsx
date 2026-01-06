import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";

function App() {
	return (
		<Routes>
			{/* === Pages publiques === */}
			<Route path="/login" element={<LoginPage />} />

			{/* === Pages protégées === */}
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<MainLayout />} />
				<Route path="/signup" element={<SignupPage />} />
			</Route>
		</Routes>
	);
}

export default App;
