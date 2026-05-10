import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // null = unknown, false = no session, object = has session
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && !error) {
        setProfile(data);
        return data;
      }
      setProfile(null);
      return null;
    } catch {
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    let resolved = false;

    const resolve = () => {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    };

    // Safety timeout: unblock UI after 6s max
    const timeout = setTimeout(resolve, 6000);

    // Primary: listen to auth state changes
    // IMPORTANT: We guard against INITIAL_SESSION events from the isolated
    // supabaseSignup client (persistSession:false) from overwriting the admin
    // session. Supabase JS can fire cross-client auth events on the same
    // onAuthStateChange bus. We track the current user and ignore any
    // INITIAL_SESSION that tries to clear a session we already have.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore spurious INITIAL_SESSION with no session when we already
        // have an active authenticated user — this is the "admin creates user"
        // bleed-through bug from the isolated signup client.
        if (event === 'INITIAL_SESSION' && !session) {
          clearTimeout(timeout);
          resolve();
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        clearTimeout(timeout);
        resolve();
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, fullName, treatmentPhase, weight, height, dietaryRestrictions }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        treatment_phase: treatmentPhase,
        weight,
        height,
        dietary_restrictions: dietaryRestrictions,
        role: 'patient',
      });
      if (profileError) throw profileError;
    }
    return data;
  };

  // signIn: uses RPC to get role (SECURITY DEFINER → bypasses RLS reliably)
  const signIn = async ({ email, password }) => {
    // ── DEVELOPER BYPASS ──────────────────────────────────────────────────
    if (email === 'boushra@gmail.com' && password === 'admin123') {
      const devProfile = { 
        id: '7caea77a-30ae-4b10-be97-a2a16bfd06e8', 
        role: 'admin', 
        full_name: 'Boushra Admin' 
      };
      setUser({ id: devProfile.id, email: 'boushra@gmail.com' });
      setProfile(devProfile);
      return { user: { id: devProfile.id, email: 'boushra@gmail.com' }, profile: devProfile };
    }
    // ──────────────────────────────────────────────────────────────────────

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    let userProfile = null;
    if (data.user) {
      // 1. Get role via SECURITY DEFINER function (bypasses RLS — always works)
      const { data: roleFromRpc } = await supabase.rpc('get_my_role');

      // 2. Try to fetch full profile (may or may not work depending on RLS)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      // 3. Merge: use RPC role as source of truth
      const resolvedRole = roleFromRpc || profileData?.role || 'patient';
      userProfile = {
        ...(profileData || {}),
        id: data.user.id,
        role: resolvedRole,
      };
      setProfile(userProfile);
    }

    return { ...data, profile: userProfile };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) throw error;
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const isAdmin = profile?.role === 'admin';
  const isSpecialist = profile?.role === 'specialist';

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUp, signIn, signOut, updateProfile,
      isAdmin, isSpecialist,
      fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
