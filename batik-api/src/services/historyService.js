import { supabase } from "../server.js";

export const fetchHistories = async (email, h) => {
  if (!email)
    return h.response({ status: false, message: "Email diperlukan" }).code(400);
  const { data, error } = await supabase
    .from("histories")
    .select("*")
    .eq("email", email);
  if (error)
    return h.response({ status: false, message: error.message }).code(500);
  if (!data.length)
    return h
      .response({ status: false, message: "Belum ada riwayat" })
      .code(404);
  return { status: true, data };
};
