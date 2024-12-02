import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.dotenv.SUPABASE_URL
const supabaseKey = import.dotenv.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
