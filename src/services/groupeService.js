import supabase from "@/utils/supabase";

// Create a new groupe
export const createGroupe = async (nom, annee) => {
	const { data, error } = await supabase
		.from("group")
		.insert([{ nom, annee }])
		.select()
		.single();

	if (error) {
		console.error("Error creating groupe:", error);
		throw error;
	}

	return data;
};

// Get all groupes
export const getGroupes = async () => {
	const { data, error } = await supabase
		.from("group")
		.select("*")
		.order("annee", { ascending: false })
		.order("nom", { ascending: true });

	if (error) {
		console.error("Error fetching groupes:", error);
		throw error;
	}

	return data;
};

// Get a single groupe by ID
export const getGroupeById = async (id) => {
	const { data, error } = await supabase
		.from("group")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching groupe:", error);
		throw error;
	}

	return data;
};

// Get groupes by year
export const getGroupesByAnnee = async (annee) => {
	const { data, error } = await supabase
		.from("group")
		.select("*")
		.eq("annee", annee)
		.order("nom", { ascending: true });

	if (error) {
		console.error("Error fetching groupes by year:", error);
		throw error;
	}

	return data;
};

// Update a groupe
export const updateGroupe = async (id, updates) => {
	const { data, error } = await supabase
		.from("group")
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error updating groupe:", error);
		throw error;
	}

	return data;
};

// Delete a groupe
export const deleteGroupe = async (id) => {
	const { error } = await supabase.from("group").delete().eq("id", id);

	if (error) {
		console.error("Error deleting groupe:", error);
		throw error;
	}

	return true;
};
