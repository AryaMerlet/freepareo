import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router";

export default function Logout() {
	const { signOut } = useAuth();

	useEffect(() => {
		signOut();
	}, [signOut]);

	return <Navigate to="/login" />;
}
