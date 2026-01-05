import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./pages/protectedRoute";

function App() {
	const [count, setCount] = useState(0);

	return (
		<Routes>
			{/* === Pages publiques === */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />

			{/* === Pages protégées === */}
			<Route element={<ProtectedRoute />}>
				{/* <Route element={<MainLayout />}> */}
				{/* </Route> */}
			</Route>
		</Routes>
	);
}

export default App;
