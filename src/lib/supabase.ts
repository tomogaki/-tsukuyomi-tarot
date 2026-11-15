import { createClient, SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | null = null;
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.length > 0 && !url.includes("your-project");
}
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  client = createClient(url, anon);
  return client;
}
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(url, key, { auth: { persistSession: false } });
}
