import { supabase } from "../server.js";

export const signup = async ({ email, password }, h) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error)
    return h.response({ status: false, message: error.message }).code(400);
  return { status: true, data };
};

export const signin = async ({ email, password }, h) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    return h.response({ status: false, message: error.message }).code(400);
  return { status: true, data };
};

export const signout = async (h) => {
  const { error } = await supabase.auth.signOut();
  if (error)
    return h.response({ status: false, message: error.message }).code(400);
  return { status: true, message: "Signed out successfully" };
};
