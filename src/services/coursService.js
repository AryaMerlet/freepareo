import supabase from "../utils/supabase";

export async function fetchCours() {
  try {
    const { data, error } = await supabase
      .from("matiere")
      .select("*, cours: cours(id, jour)");

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement cours:", error);
    return { data: null, error };
  }
}

export async function fetchMatiereByUserId(userId) {
  const { data, error } = await supabase
    .from("matiere")
    .select("id, nom")
    .eq("id_prof", userId);

  if (error) throw error;
  return { data, error: null };
}

export async function fetchMatiereByGroupId(groupId) {
  try {
    const { data, error } = await supabase
      .from("matiere")
      .select("id, nom")
      .eq("id_group", groupId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement matiere:", error);
    return { data: null, error };
  }
}

export async function deleteCours(id) {
  try {
    const { error } = await supabase.from("cours").delete().eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { error };
  }
}

export async function fetchProfs() {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("id, nom, prenom")
      .eq("role", "prof");

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement profs:", error);
    return { data: null, error };
  }
}

export async function fetchGroups() {
  try {
    const { data, error } = await supabase.from("group").select("id, nom");

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement groupes:", error);
    return { data: null, error };
  }
}

// Matiere functions
export async function fetchMatieres() {
  try {
    // Select all matiere columns and all related cours columns in one query
    const { data, error } = await supabase
      .from("matiere")
      .select(`*, cours: cours(*)`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Ensure cours is always present
    const matieresWithCours = (data || []).map((m) => ({
      ...m,
      cours: m.cours || [],
    }));

    return { data: matieresWithCours, error: null };
  } catch (error) {
    console.error("Erreur chargement matieres:", error);
    return { data: null, error };
  }
}

export async function addMatiere(matiere) {
  try {
    const { data, error } = await supabase
      .from("matiere")
      .insert([matiere])
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur ajout matiere:", error);
    return { data: null, error };
  }
}

export async function updateMatiere(id, matiere) {
  try {
    const { error } = await supabase
      .from("matiere")
      .update(matiere)
      .eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur modification matiere:", error);
    return { error };
  }
}

export async function deleteMatiere(id) {
  try {
    const { error } = await supabase.from("matiere").delete().eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur suppression matiere:", error);
    return { error };
  }
}

// Cours functions for matiere
export async function addCoursToMatiere(cours) {
  try {
    const { error } = await supabase.from("cours").insert([cours]);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur ajout cours:", error);
    return { error };
  }
}

export async function deleteCoursFromMatiere(id) {
  try {
    const { error } = await supabase.from("cours").delete().eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur suppression cours:", error);
    return { error };
  }
}
