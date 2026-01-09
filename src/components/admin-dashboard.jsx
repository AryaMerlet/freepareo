// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import AdminScheduler from "@/components/AdminScheduler";

// Utils pour transformer les heures
import { parseTimeToDate } from "@/utils/date";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [cours, setCours] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Récupérer utilisateurs
        const { data: usersData, error: usersError } = await supabase
          .from("user")
          .select("id,nom,prenom,created_at,role")
          .order("created_at", { ascending: false });
        if (usersError) throw usersError;

        // 2️⃣ Récupérer matières
        const { data: matieresData, error: matieresError } = await supabase
          .from("matiere")
          .select("*");
        if (matieresError) throw matieresError;

        // 3️⃣ Récupérer cours
        const { data: coursData, error: coursError } = await supabase
          .from("cours")
          .select("*");
        if (coursError) throw coursError;

        // 4️⃣ Récupérer messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("message")
          .select("id");
        if (messagesError) throw messagesError;

        if (!mounted) return;

        // 5️⃣ Associer cours aux matières
        const matieresAvecCours = matieresData.map((matiere) => ({
          ...matiere,
          cours: coursData.filter((c) => c.matiere_id === matiere.id),
        }));

        // 6️⃣ Créer les événements pour le calendrier (9h → 17h)
        const timetableEvents = matieresAvecCours.flatMap((matiere) =>
          (matiere.cours || []).map((c) => {
            const today = new Date(); // pour test, tous les cours aujourd'hui
            const start = parseTimeToDate(today, "09:00");
            const end = parseTimeToDate(today, "17:00");

            return {
              id: `${matiere.id}_${c.id}`,
              title: matiere.nom,
              start,
              end,
              color: "#3b82f6",
            };
          })
        );

        // 7️⃣ Mettre à jour le state
        setUsers(usersData || []);
        setMatieres(matieresAvecCours || []);
        setCours(coursData || []);
        setMessagesCount(messagesData ? messagesData.length : 0);
        setEvents(timetableEvents);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Statistiques
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
        <div className="admin-card">Erreur : {error}</div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="admin-card">
            <div>
              Utilisateurs : <strong>{users.length}</strong>
            </div>
            <div>
              Nouveaux (7j) : <strong>{newUsers7d}</strong>
            </div>
            <div>
              Cours : <strong>{cours.length}</strong>
            </div>
            <div>
              Messages : <strong>{messagesCount}</strong>
            </div>
          </div>

          {/* Derniers utilisateurs */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <h3>Derniers utilisateurs</h3>
            <ul>
              {recentUsers.map((u) => (
                <li key={u.id}>
                  {u.nom || u.prenom} —{" "}
                  {new Date(u.created_at).toLocaleString("fr-FR")}
                </li>
              ))}
            </ul>
          </div>

          {/* Derniers cours */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <h3>Derniers cours</h3>
            <ul>
              {recentCours.map((c) => (
                <li key={c.id}>
                  {c.nom} — {c.jour || "Journée complète"}
                </li>
              ))}
            </ul>
          </div>

          {/* Calendrier */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <AdminScheduler events={events} />
          </div>
        </>
      )}
    </div>
  );
}
