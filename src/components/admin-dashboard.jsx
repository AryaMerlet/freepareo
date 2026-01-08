// src/components/admin-dashboard.jsx
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { fetchCours } from "@/services/coursService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [cours, setCours] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("user")
          .select("id,nom,prenom,created_at,role")
          .order("created_at", { ascending: false });
        if (usersError) throw usersError;

        const { data: coursData, error: coursError } = await fetchCours();
        if (coursError) throw coursError;

        const { data: messagesData, error: messagesError } = await supabase
          .from("message")
          .select("id");
        if (messagesError) throw messagesError;

        if (!mounted) return;
        setUsers(usersData || []);
        setCours(coursData || []);
        setMessagesCount(messagesData ? messagesData.length : 0);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const newUsers7d = (() => {
    const since7d = new Date();
    since7d.setDate(since7d.getDate() - 7);
    return users.filter(
      (u) => u.created_at && new Date(u.created_at) >= since7d
    ).length;
  })();

  const recentUsers = users.slice(0, 5);
  const recentCours = cours.slice(0, 5);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      {loading ? (
        <div className="admin-card">Chargement…</div>
      ) : error ? (
        <div className="admin-card">Erreur : {error}</div>
      ) : (
        <>
          <div className="admin-card">
            <div>
              Utilisateurs : <strong>{users.length}</strong>
            </div>
            <div>
              Nouveaux (7j) : <strong>{newUsers7d}</strong>
            </div>
            <div>
              Cours : <strong>{cours.length}</strong>
            </div>
            <div>
              Messages : <strong>{messagesCount}</strong>
            </div>
          </div>

          <div className="admin-card" style={{ marginTop: 12 }}>
            <h3>Derniers utilisateurs</h3>
            <ul>
              {recentUsers.map((u) => (
                <li key={u.id}>
                  {u.nom || `${u.prenom || ""}`} —{" "}
                  {new Date(u.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-card" style={{ marginTop: 12 }}>
            <h3>Derniers cours</h3>
            <ul>
              {recentCours.map((c) => (
                <li key={c.id}>
                  {c.nom} — {c.jour}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
