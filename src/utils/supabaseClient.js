import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qhgiqtowtgmreekgipud.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2lxdG93dGdtcmVla2dpcHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDYwODAsImV4cCI6MjA4MTAyMjA4MH0.9dk32846rYX76AaCMeZI6-GQMaNpAtG0HUfG-4CU1Yo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
