import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

export default function Crud() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("user");
  const [editingUser, setEditingUser] = useState(null);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data);
    else console.error(error);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function createUser(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("user")
      .insert([{ email, nom, prenom, role }]);

    if (!error) {
      setEmail("");
      setNom("");
      setPrenom("");
      setRole("user");
      fetchUsers();
    } else {
      console.error(error);
      alert(error.message);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    const { error } = await supabase.from("user").delete().eq("id", id);
    if (!error) fetchUsers();
    else console.error(error);
  }

  async function updateUser(userData) {
    const { error } = await supabase
      .from("user")
      .update({
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
        role: userData.role,
      })
      .eq("id", userData.id);

    if (!error) {
      setEditingUser(null);
      fetchUsers();
    } else {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Liste des utilisateurs</h2>

      <form
        onSubmit={createUser}
        style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="prof">Prof</option>
        </select>

        <button type="submit" style={actionBtn}>
          Ajouter
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e0e0e0", textAlign: "left" }}>
            <th style={{ padding: 12 }}>Email</th>
            <th style={{ padding: 12 }}>Nom</th>
            <th style={{ padding: 12 }}>Prénom</th>
            <th style={{ padding: 12 }}>Rôle</th>
            <th style={{ padding: 12 }}>Créé le</th>
            <th style={{ padding: 12 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: 12 }}>{user.email}</td>
              <td style={{ padding: 12 }}>{user.nom}</td>
              <td style={{ padding: 12 }}>{user.prenom}</td>
              <td style={{ padding: 12 }}>{user.role}</td>
              <td style={{ padding: 12 }}>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("fr-FR")
                  : "—"}
              </td>
              <td style={{ padding: 12 }}>
                <button style={actionBtn} onClick={() => setEditingUser(user)}>
                  Modifier
                </button>
                <button
                  style={{ ...actionBtn, marginLeft: 8 }}
                  onClick={() => deleteUser(user.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#f9f9f9",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Modification utilisateur</h3>

          <div style={{ marginBottom: 8 }}>
            <label>Email : </label>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              required
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Nom : </label>
            <input
              type="text"
              value={editingUser.nom}
              onChange={(e) =>
                setEditingUser({ ...editingUser, nom: e.target.value })
              }
              required
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Prénom : </label>
            <input
              type="text"
              value={editingUser.prenom}
              onChange={(e) =>
                setEditingUser({ ...editingUser, prenom: e.target.value })
              }
              required
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Rôle : </label>
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              required
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="prof">Prof</option>
            </select>
          </div>

          <button style={actionBtn} onClick={() => updateUser(editingUser)}>
            Enregistrer
          </button>
          <button
            style={{ ...actionBtn, marginLeft: 8 }}
            onClick={() => setEditingUser(null)}
          >
            Annuler
          </button>
        </div>
      )}
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
