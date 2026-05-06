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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

  // signIn: just does auth — onAuthStateChange handles profile fetch
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
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
