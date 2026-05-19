import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_PORT } = process.env;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_PORT
);

export default supabaseClient;
