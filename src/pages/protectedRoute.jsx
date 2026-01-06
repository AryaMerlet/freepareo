import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/login" replace />;
}
