import { createClient } from '@supabase/supabase-js';

// A separate client used ONLY for creating new users in the admin panel.
// persistSession: false means signUp() on this client never touches localStorage,
// so the main admin session is completely unaffected.
const supabaseSignup = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storageKey: 'dummy-signup-key', // Complete isolation from main client
    },
  }
);

export { supabaseSignup };
