// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import AttendancePanel from "../components/AttendancePanel";
// import AttendanceSummary from "../components/AttendanceSummary";
// import ManagerLeaveApproval from "../components/ManagerLeaveApproval";
// import LeaveSummary from "./LeaveSummary";
// import ApplyLeave from "./ApplyLeave";
// import MyLeave from "./MyLeave";
// import api from "../api/axios";
// import TopPerformers from "../components/TopPerformers";
// import BirthdayBanner from "../components/BirthdayBanner";

// const ManagerDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* ================= AUTH CHECK ================= */
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser || storedUser.role !== "manager") {
//       window.location.href = "/";
//       return;
//     }
//     setUser(storedUser);
//   }, []);

//   /* ================= FETCH ASSIGNED USERS ================= */
//   const fetchAssignedUsers = async () => {
//     try {
//       const res = await api.get("/users/manager/interns");
//       setAssignedUsers(res.data || []);
//     } catch (error) {
//       console.error("Error fetching assigned users:", error);
//     }
//   };

//   /* ================= FETCH ANNOUNCEMENTS ================= */
//   const fetchAnnouncements = async () => {
//     try {
//       const res = await api.get("/announcements");
//       setAnnouncements(res.data || []);
//     } catch (error) {
//       console.error("Error loading announcements:", error);
//     }
//   };

//   useEffect(() => {
//     if (!user) return;
//     fetchAssignedUsers();
//     fetchAnnouncements();
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading dashboard…
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100">
//       {/* SIDEBAR */}
//       <Sidebar
//         onLogout={handleLogout}
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//       />

//       {/* MAIN */}
//       <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
//         {/* NAVBAR */}
//         <Navbar
//           user={user}
//           onMenuClick={() => setSidebarOpen(true)}
//         />

//         {/* HERO */}
//         <section className="relative mt-6 overflow-hidden rounded-[28px]
//           bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400
//           text-white p-6 sm:p-8 shadow-2xl"
//         >
//           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold">
//                 Welcome back, {user.name}
//               </h1>
//               <p className="text-sm text-white/85 mt-2">
//                 Command your team, track performance, and make smarter decisions.
//               </p>

//               <div className="mt-6 flex gap-3">
//                 <button
//                   onClick={() => navigate("/manager/stipend")}
//                   className="bg-white text-orange-600 px-5 py-2.5 rounded-xl
//                   font-semibold hover:bg-orange-50 transition shadow-md"
//                 >
//                   Manage Stipends
//                 </button>

//                 <button
//                   onClick={() => navigate("/manager/revenue")}
//                   className="bg-black/20 hover:bg-black/30 px-5 py-2.5
//                   rounded-xl font-semibold transition"
//                 >
//                   Update Revenue
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="absolute -top-24 -right-24 w-80 h-80
//             bg-white/20 rounded-full blur-3xl"
//           />
//         </section>

//         {/* ATTENDANCE */}
//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
//           <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
//             <AttendancePanel />
//           </div>
//           <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
//             <AttendanceSummary userId={user._id} />
//           </div>
//         </section>

//         <BirthdayBanner />

//         {/* LEAVE */}
//         <section className="mt-10 rounded-3xl bg-white border shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-orange-600 mb-4">
//             Leave Management
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <LeaveSummary />
//             <ApplyLeave />
//             <MyLeave />
//           </div>
//         </section>

//         {/* PERFORMANCE */}
//         <section className="mt-12">
//           <h2 className="text-xl font-semibold text-orange-600 mb-4">
//             Performance Intelligence
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <TopPerformers type="daily" title="Daily Leaders" />
//             <TopPerformers type="weekly" title="Weekly Momentum" />
//             <TopPerformers type="monthly" title="Monthly Champions" />
//           </div>
//         </section>

//         {/* LEAVE APPROVAL */}
//         <section className="mt-12">
//           <ManagerLeaveApproval />
//         </section>

//         {/* TEAM */}
//         <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-orange-600 mb-4">
//             Assigned Team Members
//           </h2>

//           {assignedUsers.length === 0 ? (
//             <p className="text-sm text-gray-500">No users assigned to you.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-gray-500 border-b">
//                     <th className="p-3 text-left">Name</th>
//                     <th className="p-3 text-left">Email</th>
//                     <th className="p-3">Role</th>
//                     <th className="p-3">Team</th>
//                     <th className="p-3 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {assignedUsers.map((u) => (
//                     <tr key={u._id} className="border-b hover:bg-orange-50">
//                       <td className="p-3 font-medium">{u.name}</td>
//                       <td className="p-3">{u.email}</td>
//                       <td className="p-3 capitalize">{u.role}</td>
//                       <td className="p-3">{u.teamName || "-"}</td>
//                       <td className="p-3 text-right">
//                         <button
//                           onClick={() =>
//                             navigate(`/manager/view-dashboard/${u._id}`)
//                           }
//                           className="text-orange-600 font-semibold"
//                         >
//                           View →
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* ANNOUNCEMENTS */}
//         <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-orange-600 mb-4">
//             Company Announcements
//           </h2>

//           {announcements.length === 0 ? (
//             <p className="text-sm text-gray-500">No announcements yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {announcements.map((a) => (
//                 <div
//                   key={a._id}
//                   className="rounded-2xl bg-gradient-to-r
//                   from-orange-50 to-white border p-4"
//                 >
//                   <p className="font-semibold">{a.title}</p>
//                   <p className="text-sm text-gray-600 mt-1">{a.message}</p>
//                   <p className="text-xs text-gray-400 mt-2">
//                     {new Date(a.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import AttendanceSummary from "../components/AttendanceSummary";
import ManagerLeaveApproval from "../components/ManagerLeaveApproval";
import LeaveSummary from "./LeaveSummary";
import ApplyLeave from "./ApplyLeave";
import MyLeave from "./MyLeave";
import api from "../api/axios";
import TopPerformers from "../components/TopPerformers";
import BirthdayBanner from "../components/BirthdayBanner";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "manager") {
      window.location.href = "/";
      return;
    }
    setUser(storedUser);
  }, []);

  /* ================= FETCH ASSIGNED USERS (SAFE) ================= */
  const fetchAssignedUsers = async () => {
    try {
      const res = await api.get("/users/manager/interns");

      const safeUsers =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];

      setAssignedUsers(safeUsers);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
      setAssignedUsers([]); // 🔒 hard fallback
    }
  };

  /* ================= FETCH ANNOUNCEMENTS ================= */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");

      const safeAnnouncements = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setAnnouncements(safeAnnouncements);
    } catch (error) {
      console.error("Error loading announcements:", error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAssignedUsers();
    fetchAnnouncements();
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100">
      {/* SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MAIN */}
      <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
        {/* NAVBAR */}
        <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* HERO */}
        <section
          className="relative mt-6 overflow-hidden rounded-[28px]
          bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400
          text-white p-6 sm:p-8 shadow-2xl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-white/85 mt-2">
            Command your team, track performance, and make smarter decisions.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/manager/stipend")}
              className="bg-white text-orange-600 px-5 py-2.5 rounded-xl
              font-semibold hover:bg-orange-50 transition shadow-md"
            >
              Manage Stipends
            </button>

            <button
              onClick={() => navigate("/manager/revenue")}
              className="bg-black/20 hover:bg-black/30 px-5 py-2.5
              rounded-xl font-semibold transition"
            >
              Update Revenue
            </button>
          </div>
        </section>

        {/* ATTENDANCE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
            <AttendancePanel />
          </div>
          <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
            <AttendanceSummary userId={user._id} />
          </div>
        </section>

        <BirthdayBanner />

        {/* LEAVE */}
        <section className="mt-10 rounded-3xl bg-white border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Leave Management
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LeaveSummary />
            <ApplyLeave />
            <MyLeave />
          </div>
        </section>

        {/* PERFORMANCE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Performance Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopPerformers type="daily" title="Daily Leaders" />
            <TopPerformers type="weekly" title="Weekly Momentum" />
            <TopPerformers type="monthly" title="Monthly Champions" />
          </div>
        </section>

        {/* LEAVE APPROVAL */}
        <section className="mt-12">
          <ManagerLeaveApproval />
        </section>

        {/* TEAM */}
        <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Assigned Team Members
          </h2>

          {assignedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users assigned to you.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Team</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-orange-50">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">{u.teamName || "-"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() =>
                            navigate(`/manager/view-dashboard/${u._id}`)
                          }
                          className="text-orange-600 font-semibold"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Company Announcements
          </h2>

          {announcements.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl bg-gradient-to-r
                  from-orange-50 to-white border p-4"
                >
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ManagerDashboard;
