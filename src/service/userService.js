export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data;
}