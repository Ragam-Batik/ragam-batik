import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import routes from "./routes/routes.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: "0.0.0.0",
    routes: {
      cors: { origin: ["*"] },
    },
  });

  server.route([
    ...authRoutes,
    ...routes,
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init();
