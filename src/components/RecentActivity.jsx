import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const RecentActivity = () => {
  // 🧠 State = data that UI shows
  const [activities, setActivities] = useState([]);

  // 📡 Function to get data from Supabase
  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error) {
      setActivities(data);
    }
  };

  // 🔁 Runs once when component loads
  useEffect(() => {
    fetchActivities();
  }, []);
  useEffect(() => {
    const channel = supabase
      .channel("realtime-activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activities",
        },
        (payload) => {
          setActivities((prev) => [payload.new, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h3>Recent Activity</h3>

      {activities.length === 0 && <p>No recent activity</p>}

      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity.id}>
            <span className="activity-time">
              {new Date(activity.created_at).toLocaleTimeString()}
            </span>
            <span className="activity-desc">{activity.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
