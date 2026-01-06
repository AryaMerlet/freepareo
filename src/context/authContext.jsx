import React, { useState, useEffect, useContext, createContext } from "react";
import supabase from "./../utils/supabase";

const Auth = createContext();

export const AuthContext = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) throw error;
				const { data: userData, userError } = await supabase
					.from("users")
					.select("*")
					.eq("id", data.session.user.id)
					.single();
				if (userError) throw userError;
				setUser(userData);
			} catch (err) {
				setUser(null);
				console.log("No active session:", err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchUser();
	}, []);

	async function signInWithEmail(email, password) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});
		if (error) {
			console.error("Error signing in:", error);
		} else {
			const { data: userData, userError } = await supabase
				.from("users")
				.select("*")
				.eq("id", data.session.user.id)
				.single();
			if (userError) throw userError;
			setUser(userData);
		}
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
		}
		setUser(null);
	}

	async function signUpNewUser(email, password, nom, prenom, role) {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					nom: nom,
					prenom: prenom,
					role: role,
				},
			},
		});
		if (error) {
			console.error("Error signing up:", error);
		}
	}

	return (
		<Auth.Provider value={{ user, signInWithEmail, signOut, signUpNewUser }}>
			{isLoading ? <div>Loading...</div> : children}
		</Auth.Provider>
	);
};

export const useAuth = () => useContext(Auth);
