import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ManagerRevenue = () => {
  const [type, setType] = useState("daily");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, [type]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/performance/manager-revenue?type=${type}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Manager revenue fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const rankAccent = [
    "border-emerald-500",
    "border-blue-500",
    "border-orange-500",
  ];

  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Manager-wise Revenue
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "daily"
              ? "Today's team revenue by manager"
              : "This month's team revenue by manager"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setType("daily")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                type === "daily"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Daily
          </button>
          <button
            onClick={() => setType("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                type === "monthly"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-sm text-gray-500">
          Loading revenue performance…
        </div>
      ) : data.length === 0 ? (
        <div className="text-sm text-gray-500 bg-gray-50 border rounded-xl p-4">
          No revenue data available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((row, index) => (
            <div
              key={row.managerId}
              className={`relative bg-white border border-gray-200 rounded-xl p-5
                shadow-sm hover:shadow-md transition
                border-l-4 ${rankAccent[index] || "border-gray-300"}`}
            >
              {/* RANK */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Rank #{index + 1}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  Manager
                </span>
              </div>

              {/* NAME */}
              <h3 className="text-base font-semibold text-gray-900">
                {row.managerName}
              </h3>

              {/* REVENUE */}
              <div className="mt-4">
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                  ₹ {row.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Team revenue ({type})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManagerRevenue;
