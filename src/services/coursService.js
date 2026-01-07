import supabase from "../utils/supabase";

export async function fetchCours() {
  try {
    const { data, error } = await supabase
      .from("cours")
      .select(
        `id,nom,jour,prof: id_prof (nom, prenom),group: id_group (nom),id_prof,id_group`
      );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement cours:", error);
    return { data: null, error };
  }
}

export async function fetchCoursByUserId(userId) {
  try {
    const { data, error } = await supabase
      .from("cours")
      .select("id, nom")
      .eq("id_prof", userId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur chargement cours:", error);
    return { data: null, error };
  }
}
export async function addCours(cours) {
  try {
    const { error } = await supabase.from("cours").insert([cours]);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur ajout:", error);
    return { error };
  }
}

export async function updateCours(id, cours) {
  try {
    const { error } = await supabase.from("cours").update(cours).eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur modification:", error);
    return { error };
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
      .eq("role", "PROF");

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
