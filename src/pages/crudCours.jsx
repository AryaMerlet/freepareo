import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function Cours() {
  const [cours, setCours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCours, setEditingCours] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    jour: "",
    id_prof: "",
    id_group: "",
  });

  useEffect(() => {
    fetchCours();
  }, []);

  async function fetchCours() {
    const { data, error } = await supabase
      .from("cours")
      .select(
        `id,nom,jour,prof: id_prof (nom, prenom),group: id_group (nom),id_prof,id_group`
      );
    if (error) console.error("Erreur chargement cours:", error);
    else setCours(data);
  }


//ajout et modifif
  const handleSubmit = async (e) => {
    e.preventDefault();


//modif
    if (editingCours) {
      const { error } = await supabase
        .from("cours")
        .update({
          nom: formData.nom,
          jour: formData.jour,
          id_prof: formData.id_prof,
          id_group: formData.id_group,
        })
        .eq("id", editingCours.id);

      if (error) console.error("Erreur modification:", error);
    } else {

//ajout
      const { error } = await supabase.from("cours").insert([formData]);
      if (error) console.error("Erreur ajout:", error);
    }

    setShowForm(false);
    setEditingCours(null);
    setFormData({ nom: "", jour: "", id_prof: "", id_group: "" });
    fetchCours();
  };


//supprimer
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    const { error } = await supabase.from("cours").delete().eq("id", id);
    if (error) console.error("Erreur suppression:", error);
    else fetchCours();
  };

  const handleEdit = (cours) => {
    setEditingCours(cours);
    setFormData({
      nom: cours.nom,
      jour: cours.jour,
      id_prof: cours.id_prof,
      id_group: cours.id_group,
    });
    setShowForm(true);
  };





//affichage
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Liste des cours</h2>

      <button
        style={{ ...actionBtn, marginBottom: 16 }}
        onClick={() => {
          setEditingCours(null);
          setFormData({ nom: "", jour: "", id_prof: "", id_group: "" });
          setShowForm(true);
        }}
      >
        Ajouter un cours
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#f9f9f9",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <label>Nom : </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Date (YYYY-MM-DD) : </label>
            <input
              type="date"
              value={formData.jour}
              onChange={(e) =>
                setFormData({ ...formData, jour: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>ID Professeur : </label>
            <input
              type="text"
              value={formData.id_prof}
              onChange={(e) =>
                setFormData({ ...formData, id_prof: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>ID Groupe : </label>
            <input
              type="text"
              value={formData.id_group}
              onChange={(e) =>
                setFormData({ ...formData, id_group: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" style={actionBtn}>
            {editingCours ? "Enregistrer" : "Ajouter"}
          </button>
          <button
            type="button"
            style={{ ...actionBtn, marginLeft: 8 }}
            onClick={() => setShowForm(false)}
          >
            Annuler
          </button>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e0e0e0", textAlign: "left" }}>
            <th style={{ padding: 12 }}>Nom du cours</th>
            <th style={{ padding: 12 }}>Date</th>
            <th style={{ padding: 12 }}>Groupe</th>
            <th style={{ padding: 12 }}>Professeur</th>
            <th style={{ padding: 12 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {cours.map((cours, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: 12 }}>{cours.nom}</td>
              <td style={{ padding: 12 }}>
                {(() => {
                  const [year, month, day] = cours.jour.split("-");
                  return new Date(year, month - 1, day).toLocaleDateString(
                    "fr-FR"
                  );
                })()}
              </td>
              <td style={{ padding: 12 }}>{cours.group?.nom}</td>
              <td style={{ padding: 12 }}>
                {cours.prof?.nom} {cours.prof.prenom}
              </td>
              <td style={{ padding: 12 }}>
                <button style={actionBtn} onClick={() => handleEdit(cours)}>
                  Modifier
                </button>
                <button
                  style={{ ...actionBtn, marginLeft: 8 }}
                  onClick={() => handleDelete(cours.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const actionBtn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #d1d1d1",
  background: "#f9f9f9",
  cursor: "pointer",
};
