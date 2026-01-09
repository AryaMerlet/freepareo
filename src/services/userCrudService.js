import supabase from "../utils/supabase";

export async function fetchUsers() {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function fetchGroups() {
  const { data, error } = await supabase.from("group").select("id, nom");

  return { data, error };
}

export async function createUser({ id, email, nom, prenom, role, id_group }) {
  let userId = id;
  if (!userId) {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) return { error: authError };
    if (!authData?.user)
      return { error: new Error("Utilisateur non connecté") };
    userId = authData.user.id;
  }

  const { error } = await supabase.from("user").upsert(
    {
      id: userId,
      email,
      nom,
      prenom,
      role,
      id_group,
    },
    { onConflict: "id" }
  );

  return { error };
}

export async function deleteUser(id) {
  const { error } = await supabase.from("user").delete().eq("id", id);
  return { error };
}

export async function updateUser(userData) {
  const { error } = await supabase
    .from("user")
    .update({
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
      role: userData.role,
      id_group: userData.id_group,
    })
    .eq("id", userData.id);

  return { error };
}
