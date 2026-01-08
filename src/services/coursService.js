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

export async function fetchMatiereByUserId(userId) {
  const { data, error } = await supabase
    .from("matiere")
    .select("id, nom, prof: id_prof (nom, prenom)")
    .eq("id_prof", userId);

  if (error) throw error;
  return { data, error: null };
}

export async function fetchMatiereByGroupId(groupId) {
  try {
    const { data, error } = await supabase
      .from("matiere")
      .select("id, nom, prof: id_prof (nom, prenom)")
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
    const { data, error } = await supabase
      .from("matiere")
      .select(
        `id, nom, id_group, id_prof, group: id_group (nom), prof: id_prof (nom, prenom)`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch cours for each matiere separately
    if (data) {
      const matieresWithCours = await Promise.all(
        data.map(async (matiere) => {
          const { data: coursData } = await supabase
            .from("cours")
            .select("id, jour")
            .eq("id_matiere", matiere.id);
          return {
            ...matiere,
            cours: coursData || [],
          };
        })
      );
      return { data: matieresWithCours, error: null };
    }

    return { data, error: null };
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

export async function getCoursDetails(id) {
  try {
    const { data: ressourceData, error: ressourceError } = await supabase
      .from("ressource_matiere")
      .select(
        `
        ...id_ressource(*,
        prof : id_prof(*)
        )`
      )
      .eq("id_matiere", id);

    const { data: evalData, error: evalError } = await supabase
      .from("evaluation")
      .select(
        `
        *`
      )
      .eq("id_matiere", id);

    const { data: matiereData, error: matiereError } = await supabase
      .from("matiere")
      .select("*")
      .eq("id", id)
      .single();

    if (ressourceError || evalError || matiereError)
      throw ressourceError || evalError || matiereError;
    return {
      data: {
        ressources: ressourceData,
        evaluations: evalData,
        infos: matiereData,
      },
      error: null,
    };
  } catch (error) {
    console.error("Erreur chargement cours details:", error);
    return { data: null, error };
  }
}
