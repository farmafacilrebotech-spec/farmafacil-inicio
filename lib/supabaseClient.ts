import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validación por si falta algo
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ WARNING: Supabase URL o ANON KEY no están definidas");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
