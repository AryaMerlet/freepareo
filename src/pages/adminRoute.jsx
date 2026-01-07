import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { isAdmin } from "@/utils/role";

export default function AdminRoute() {
	const { user } = useAuth();
	const role = isAdmin(user);
	if (user && role) {
		return <Outlet />;
	} else if (user && !role) {
		return <Navigate to="/" />;
	} else {
		return <Navigate to="/login" />;
	}
}
