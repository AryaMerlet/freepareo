import supabase from "@/utils/supabase";

export const userService = {
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching user profile:', error);
            return { data: null, error };
        }

        return { data, error: null };
    },

    async getUserGroup(groupId) {
        const { data, error } = await supabase
            .from('group')
            .select('nom, annee')
            .eq('id', groupId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching user group:', error);
            return { data: null, error };
        }

        return { data, error: null };
    },

    async updateUserProfile(userId, email, nom, prenom) {
        const { data, error } = await supabase
            .from('user')
            .upsert({
                id: userId,
                email: email,
                nom: nom,
                prenom: prenom
            })
            .select()
            .maybeSingle();

        if (error) {
            console.error('Error updating user profile:', error);
            return { data: null, error };
        }

        return { data, error: null };
    }
};

export const getUserProfile = async (userId) => {
    const { data } = await userService.getUserProfile(userId);
    return data;
};