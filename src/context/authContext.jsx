import React, { useState, useEffect, useContext, createContext } from "react";
import supabase from "./../utils/supabase";
import { getUserProfile } from "@/services/userService";

const Auth = createContext();

export const AuthContext = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				const { data, error } = await supabase.auth.getSession();
				const userProfile = {
					...data.session.user, profile: await getUserProfile(data.session.user.id)
				};

				if (error) throw error;
				setUser(userProfile);
			} catch (err) {
				setUser(null);
				console.error("No active session:", err.message);
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
			setUser(data.user);
		}
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
		}
		setUser(null);
	}

	async function signUpNewUser(email, password) {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
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
