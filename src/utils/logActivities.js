import { supabase } from "./supabaseClient";

export const logActivity = async (type, description) => {
  const { error } = await supabase.from("activities").insert([
    {
      type,
      description, // 👈 THIS MUST HAVE PRODUCT NAME
    },
  ]);

  if (error) {
    console.error("Failed to log activity", error);
  }
};
