import { useEffect, useState, useRef } from "react";
import {
  fetchCours,
  addCours,
  updateCours,
  deleteCours,
  fetchProfs,
  fetchGroups,
} from "../services/coursService";

export default function Cours() {
  const [cours, setCours] = useState([]);
  const [profs, setProfs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCours, setEditingCours] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    jour: "",
    id_prof: "",
    id_group: "",
  });

  const [searchProf, setSearchProf] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [profDropdownOpen, setProfDropdownOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const profRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    getAllCours();
    getAllProfs();
    getAllGroups();
  }, []);

  async function getAllCours() {
    const { data } = await fetchCours();
    if (data) setCours(data);
  }

  async function getAllProfs() {
    const { data } = await fetchProfs();
    if (data) setProfs(data);
  }

  async function getAllGroups() {
    const { data } = await fetchGroups();
    if (data) setGroups(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nom: formData.nom,
      jour: formData.jour,
      id_prof: formData.id_prof,
      id_group: formData.id_group,
    };

    if (editingCours) await updateCours(editingCours.id, payload);
    else await addCours(payload);

    setShowForm(false);
    setEditingCours(null);
    setFormData({ nom: "", jour: "", id_prof: "", id_group: "" });
    setSearchProf("");
    setSearchGroup("");
    getAllCours();
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    await deleteCours(id);
    getAllCours();
  };

  const handleEdit = (item) => {
    setEditingCours(item);
    setFormData({
      nom: item.nom,
      jour: item.jour,
      id_prof: item.id_prof,
      id_group: item.id_group,
    });

    const prof = profs.find((p) => p.id === item.id_prof);
    setSearchProf(prof ? `${prof.nom} ${prof.prenom}` : "");

    const group = groups.find((g) => g.id === item.id_group);
    setSearchGroup(group ? group.nom : "");

    setShowForm(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profRef.current && !profRef.current.contains(event.target))
        setProfDropdownOpen(false);
      if (groupRef.current && !groupRef.current.contains(event.target))
        setGroupDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          setSearchProf("");
          setSearchGroup("");
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
            <label>Date : </label>
            <input
              type="date"
              value={formData.jour}
              onChange={(e) =>
                setFormData({ ...formData, jour: e.target.value })
              }
              required
            />
          </div>

          <div style={{ marginBottom: 8, position: "relative" }} ref={profRef}>
            <label>Professeur : </label>
            <div
              style={dropdownStyle}
              onClick={() => setProfDropdownOpen(!profDropdownOpen)}
            >
              <input
                type="text"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                value={searchProf}
                onChange={(e) => {
                  setSearchProf(e.target.value);
                  setFormData({ ...formData, id_prof: "" });
                  setProfDropdownOpen(true);
                }}
                placeholder="Sélectionnez un professeur"
                required
              />
              <span style={{ position: "absolute", right: 10 }}>▼</span>
            </div>

            {profDropdownOpen && (
              <ul style={dropdownListStyle}>
                {profs
                  .filter((p) =>
                    `${p.nom} ${p.prenom}`
                      .toLowerCase()
                      .includes(searchProf.toLowerCase())
                  )
                  .map((p) => (
                    <li
                      key={p.id}
                      style={dropdownItemStyle}
                      onClick={() => {
                        setFormData({ ...formData, id_prof: p.id });
                        setSearchProf(`${p.nom} ${p.prenom}`);
                        setProfDropdownOpen(false);
                      }}
                    >
                      {p.nom} {p.prenom}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div style={{ marginBottom: 8, position: "relative" }} ref={groupRef}>
            <label>Groupe : </label>
            <div
              style={dropdownStyle}
              onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
            >
              <input
                type="text"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                value={searchGroup}
                onChange={(e) => {
                  setSearchGroup(e.target.value);
                  setFormData({ ...formData, id_group: "" });
                  setGroupDropdownOpen(true);
                }}
                placeholder="Sélectionnez un groupe"
                required
              />
              <span style={{ position: "absolute", right: 10 }}>▼</span>
            </div>

            {groupDropdownOpen && (
              <ul style={dropdownListStyle}>
                {groups
                  .filter((g) =>
                    g.nom.toLowerCase().includes(searchGroup.toLowerCase())
                  )
                  .map((g) => (
                    <li
                      key={g.id}
                      style={dropdownItemStyle}
                      onClick={() => {
                        setFormData({ ...formData, id_group: g.id });
                        setSearchGroup(g.nom);
                        setGroupDropdownOpen(false);
                      }}
                    >
                      {g.nom}
                    </li>
                  ))}
              </ul>
            )}
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
          {cours.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: 12 }}>{item.nom}</td>
              <td style={{ padding: 12 }}>
                {new Date(item.jour).toLocaleDateString("fr-FR")}
              </td>
              <td style={{ padding: 12 }}>{item.group?.nom}</td>
              <td style={{ padding: 12 }}>
                {item.prof?.nom} {item.prof?.prenom}
              </td>
              <td style={{ padding: 12 }}>
                <button style={actionBtn} onClick={() => handleEdit(item)}>
                  Modifier
                </button>
                <button
                  style={{ ...actionBtn, marginLeft: 8 }}
                  onClick={() => handleDelete(item.id)}
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

const dropdownStyle = {
  border: "1px solid #d1d1d1",
  borderRadius: 6,
  padding: "6px 12px",
  cursor: "pointer",
  position: "relative",
  display: "flex",
  alignItems: "center",
  background: "#f9f9f9",
};

const dropdownListStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  position: "absolute",
  width: "100%",
  maxHeight: 150,
  overflowY: "auto",
  border: "1px solid #ccc",
  background: "#fff",
  zIndex: 1000,
  borderRadius: 6,
};

const dropdownItemStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};
