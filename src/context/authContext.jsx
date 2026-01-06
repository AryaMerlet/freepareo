import React, { useState, useEffect, useContext, createContext } from "react";
import supabase from "../utils/supabase";

const Auth = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("No active session:", error.message);
      }
      setUser(data?.session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return;
    }

    setUser(data?.session?.user ?? null);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setUser(null);
  }

  async function signUpNewUser(email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
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
