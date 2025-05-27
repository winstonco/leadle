import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

// export const supabaseUrl = "https://amwcgnahtuoysnthtjpk.supabase.co";
export const supabaseUrl = "http://127.0.0.1:54321";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2NnbmFodHVveXNudGh0anBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTU2NzYsImV4cCI6MjA2Mzg5MTY3Nn0.1P9sYnQ5lRXFyPNYpbi8G4my29C0kMOInsOLgzpLdU4";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
