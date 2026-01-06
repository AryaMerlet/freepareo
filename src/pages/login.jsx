import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import LoginForm from "../components/login-form";

export default function Login() {
	const { user } = useAuth();

	return user ? <Navigate to="/" /> : <LoginForm />;
}
