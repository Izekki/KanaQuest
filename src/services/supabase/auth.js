import { supabase } from './client';

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, username) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getUser() {
  return await supabase.auth.getUser();
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function resetPasswordForEmail(email, options) {
  return await supabase.auth.resetPasswordForEmail(email, options);
}

export async function updateUser(data) {
  return await supabase.auth.updateUser(data);
}
