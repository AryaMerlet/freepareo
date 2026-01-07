import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router";
import LoginForm from "../components/login-form";

export default function Login() {
	return <LoginForm />;
}
