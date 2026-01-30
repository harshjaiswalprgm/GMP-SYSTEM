import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ActiveToday = ({ compact = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActive();
  }, []);

  const fetchActive = async () => {
    try {
      const res = await api.get("/attendance/active-today");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Active users fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100
      ${compact ? "w-72 max-h-96" : "p-6"}
      ${compact ? "p-4" : "p-6"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`font-bold text-gray-800 ${
            compact ? "text-base" : "text-xl"
          }`}
        >
          🟢 Active Today
        </h3>

        {!compact && (
          <span className="text-xs text-gray-500">
            {users.length} active
          </span>
        )}
      </div>

      {/* BODY hai ye  */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No active users right now
        </p>
      ) : (
        <ul
          className={`space-y-2 ${
            compact ? "overflow-y-auto max-h-72 pr-1" : ""
          }`}
        >
          {users.map((u) => (
            <li
              key={u._id}
              className="flex items-center justify-between p-3 rounded-lg
              bg-gray-60 hover:bg-gray-100 transition"
            >
              {/* LEFT */}
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {u.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {u.role} • {u.teamName || "No Team"}
                </p>
              </div>

              {/* ACTIVE DOTTT */}
              <span className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0"></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveToday;
