import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const verifyToken = async (req, h) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return h.response({ status: false, message: "Unauthorized" }).code(401);

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return h.response({ status: false, message: "Invalid token" }).code(401);

  req.auth = data.user;
  return h.continue;
};
