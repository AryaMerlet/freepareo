import { Scheduler } from "@aldabil/react-scheduler";
import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import "./adminScheduler.css";

export default function AdminScheduler() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 481);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("cours")
          .select("id, jour, matiere(nom)");

        if (fetchError) throw fetchError;

        // Transformer les cours en événements du calendrier
        const formattedEvents = data.map((cours) => {
          const date = new Date(cours.jour);
          // Cours de 9h à 17h
          const start = new Date(date);
          start.setHours(9, 0, 0, 0);

          const end = new Date(date);
          end.setHours(18, 0, 0, 0);

          return {
            event_id: cours.id,
            title: cours.matiere?.nom || "Sans titre",
            start: start,
            end: end,
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
        console.error("Erreur Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();

    // Gérer le redimensionnement
    const handleResize = () => {
      setIsMobile(window.innerWidth < 481);
      setIsTablet(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading)
    return <div className="scheduler-loading">Chargement du calendrier...</div>;
  if (error) return <div className="scheduler-error">Erreur : {error}</div>;

  return (
    <div className="scheduler-container">
      <Scheduler
        view={isMobile ? "day" : isTablet ? "week" : "week"}
        events={events}
        editable={false}
        deletable={false}
        draggable={false}
        day={{
          startHour: 8,
          endHour: 19,
          step: 60,
        }}
        week={{
          startHour: 8,
          endHour: 19,
          weekDays: [1, 2, 3, 4, 5],
        }}
      />
    </div>
  );
}
