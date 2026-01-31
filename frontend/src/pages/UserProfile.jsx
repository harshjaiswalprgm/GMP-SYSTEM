import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "../components/RevenueChart";
import AttendanceChart from "../components/AttendanceChart";
import { toast } from "react-toastify";


const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState([]);

  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");
  const [month, setMonth] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ALL DATA ================= */
  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [u, p, a, s] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/users/${id}/performance`),
          api.get(`/attendance/summary/${id}`),
          api.get(`/salary/${id}`),
        ]);

        if (!mounted) return;

        setUser(u.data);
        setPerformance(Array.isArray(p.data) ? p.data : []);
        setAttendance(a.data?.summary || []);
        setSalary(Array.isArray(s.data) ? s.data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load user profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, [id]);

  /* ================= UPDATE SALARY ================= */
  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    if (!month) {
      toast.error("Please select month");
      return;
    }

    if (Number(baseSalary) <= 0) {
      toast.error("Enter valid base amount");
      return;
    }

    try {
      await api.post("/salary/set", {
        userId: id,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus || 0),
        deductions: Number(deductions || 0),
        month,
      });

      toast.success("Salary updated successfully");

      setBaseSalary("");
      setBonus("");
      setDeductions("");
      setMonth("");

      const res = await api.get(`/salary/${id}`);
      setSalary(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to update salary");
    }
  };

  /* ================= GUARDS ================= */
  if (loading) {
    return <div className="p-6 text-gray-500">Loading profile…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!user) return null;

  const canManageSalary =
    loggedInUser?.role === "admin" || loggedInUser?.role === "manager";

  const hideSalaryForUser = user.role === "intern" || user.role === "employee";

  const joinedDate = user.joiningDate
    ? new Date(user.joiningDate).toLocaleDateString()
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to users
      </button>

      {/* PROFILE */}
      <section className="bg-white border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
         <img
  src={user?.avatar || "/default-avatar.png"}
  alt={user?.name || "User"}
  className="w-24 h-24 rounded-full border object-cover"
/>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>

            <div className="flex flex-wrap gap-3 mt-2">
              <span className="badge">{user.role}</span>
              <span className="badge">
                {user.teamName || user.position || "—"}
              </span>
              <span className="badge">Joined {joinedDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Revenue Performance</h3>
          <RevenueChart data={performance} />
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Attendance Overview</h3>
          <AttendanceChart data={attendance} />
        </div>
      </section>

      {/* SALARY */}
      {canManageSalary && !hideSalaryForUser && (
        <section className="bg-white border rounded-2xl p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Salary / Stipend Management
          </h3>

          <form
            onSubmit={handleSalarySubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="number"
              placeholder="Base Amount"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Incentives"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Deductions"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="input"
            />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input"
            />

            <button className="btn-primary col-span-1 md:col-span-2">
              Update Salary
            </button>
          </form>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3">Salary History</h4>

            {salary.length === 0 ? (
              <p className="text-sm text-gray-500">No salary records found.</p>
            ) : (
              <ul className="space-y-3">
                {salary.map((s) => (
                  <li key={s._id} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{s.month}</span>
                      <span>₹{s.totalSalary}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 grid grid-cols-2 gap-y-1">
                      <span>Base: ₹{s.baseSalary}</span>
                      <span>Bonus: ₹{s.bonus}</span>
                      <span>Deductions: ₹{s.deductions}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserProfile;
