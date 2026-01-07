import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { fetchCoursByUserId } from "@/services/coursService";
import { Link } from "react-router-dom";

export const CoursPage = () => {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  useEffect(() => {
    fetchCoursByUserId(user.id).then((data) => {
      console.log(data);
      if (data.data) setCours(data.data);
    });
  }, [user.id]);
  return (
    <div>
      <h1>Mes cours</h1>
      <ul>
        {cours.map((cours) => (
          <Link to={`/cours/${cours.id}`} key={cours.id}>
            <li>{cours.nom}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
