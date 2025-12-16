import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, email");

      setUsers(data || []);
    };   

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>All Users</h2>

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}
