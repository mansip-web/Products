import { createClient } from "@supabase/supabase-js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  try {
    console.log("\n🔧 Supabase Admin Setup\n");

    // Get Supabase credentials
    const supabaseUrl = await question("Enter your Supabase URL: ");
    const supabaseKey = await question(
      "Enter your Supabase Service Role Key: "
    );

    const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim());

    // Create user_roles table if it doesn't exist
    console.log("\n📋 Creating user_roles table...");
    const { error: tableError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS user_roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `,
    });

    // Get admin email
    const adminEmail = await question("\nEnter admin email: ");

    // Find user by email
    console.log("\n🔍 Looking up user...");
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("❌ Error fetching users:", userError.message);
      rl.close();
      return;
    }

    const user = users.users.find((u) => u.email === adminEmail.trim());

    if (!user) {
      console.log(`\n❌ User with email ${adminEmail} not found.`);
      console.log(
        "💡 Please sign up this user in your app first, then run this script again."
      );
      rl.close();
      return;
    }

    // Insert or update admin role
    console.log("\n👑 Setting admin role...");
    const { error: roleError } = await supabase.from("user_roles").upsert(
      {
        user_id: user.id,
        role: "admin",
      },
      {
        onConflict: "user_id",
      }
    );

    if (roleError) {
      console.error("❌ Error setting admin role:", roleError.message);
    } else {
      console.log(`\n✅ Success! ${adminEmail} is now an admin.`);
      console.log("\n📝 Summary:");
      console.log(`   Email: ${user.email}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Role: admin`);
      console.log(
        "\n🎉 This user will now be redirected to /admin-dashboard on login!"
      );
    }

    rl.close();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    rl.close();
  }
}

setupAdmin();
