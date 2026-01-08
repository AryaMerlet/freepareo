import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import {
  fetchMatiereByUserId,
  fetchMatiereByGroupId,
  fetchMatieres,
} from "@/services/coursService";
import { Link } from "react-router-dom";

export const CoursPage = () => {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  const [matieres, setMatieres] = useState([]);
  useEffect(() => {
    console.log(user);
    if (user.profile.role === "prof") {
      fetchMatiereByUserId(user.id).then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
      });
    } else if (user.profile.role === "admin") {
      fetchMatieres().then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
      });
    } else {
      fetchMatiereByGroupId(user.profile.id_group).then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
      });
    }
  }, [user.id]);
  return (
    <div>
      <h1>Mes cours</h1>
      <ul>
        {matieres.map((cours) => (
          <Link to={`/cours/${cours.id}`} key={cours.id}>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-1">{cours.nom}</h2>
              <p className="text-sm text-gray-600">
                {cours.group?.nom || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {cours.prof?.nom || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};
