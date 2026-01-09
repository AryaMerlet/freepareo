import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // dev key
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY; // prod key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
