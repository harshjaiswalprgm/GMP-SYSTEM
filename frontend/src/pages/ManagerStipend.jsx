// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// const ManagerStipend = () => {
//   const [manager, setManager] = useState(null);
//   const [interns, setInterns] = useState([]);
//   const [stipends, setStipends] = useState({});
//   const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
//   const [loadingId, setLoadingId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* ================= AUTH GUARD ================= */
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || user.role !== "manager") {
//       window.location.href = "/";
//       return;
//     }
//     setManager(user);
//   }, []);

//   /* ================= FETCH INTERNS ================= */
//   const fetchInterns = async () => {
//     try {
//       const res = await api.get("/users/manager/interns");
//       setInterns(res.data || []);
//       initStipends(res.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load interns");
//     }
//   };

//   const initStipends = (list) => {
//     const data = {};
//     list.forEach((i) => {
//       data[i._id] = {
//         baseSalary: "",
//         bonus: "",
//         deductions: "",
//       };
//     });
//     setStipends(data);
//   };

//   useEffect(() => {
//     if (manager) fetchInterns();
//   }, [manager]);

//   /* ================= INPUT HANDLER ================= */
//   const updateField = (id, field, value) => {
//     setStipends((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value,
//       },
//     }));
//   };

//   /* ================= UPDATE STIPEND ================= */
//   const handleUpdate = async (internId) => {
//     const s = stipends[internId];

//     if (!s?.baseSalary || Number(s.baseSalary) <= 0) {
//       alert("Enter a valid gross stipend");
//       return;
//     }

//     try {
//       setLoadingId(internId);

//       await api.post("/salary/set", {
//         userId: internId,
//         baseSalary: Number(s.baseSalary),
//         bonus: Number(s.bonus || 0),
//         deductions: Number(s.deductions || 0),
//         month,
//       });

//       alert("✅ Stipend updated successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update stipend");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   /* ================= EXCEL DOWNLOAD ================= */
//   const downloadExcel = async () => {
//     try {
//       const res = await api.get("/salary/manager/export", {
//         responseType: "blob",
//       });

//       const blob = new Blob([res.data], {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `stipend-report-${month}.xlsx`;
//       link.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to download Excel");
//     }
//   };

//   if (!manager) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading…
//       </div>
//     );
//   }

//   /* ================= UI ================= */
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar
//         onLogout={() => {
//           localStorage.clear();
//           window.location.href = "/";
//         }}
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//       />

//       <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
//         <Navbar
//           user={manager}
//           onMenuClick={() => setSidebarOpen(true)}
//         />

//         <h1 className="text-2xl font-bold mb-6">
//           Intern Stipend Management
//         </h1>

//         {/* MONTH */}
//         <div className="mb-6 flex items-center gap-3">
//           <label className="font-medium">Month:</label>
//           <input
//             type="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             className="border p-2 rounded-lg"
//           />
//         </div>

//         {interns.length === 0 ? (
//           <p className="text-gray-500">No interns assigned to you.</p>
//         ) : (
//          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto max-w-6xl mx-auto">
//   <table className="w-full text-sm border-collapse">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="p-3 text-left">Intern</th>
//         <th className="p-3 text-center">Gross</th>
//         <th className="p-3 text-center">Incentives</th>
//         <th className="p-3 text-center">Deductions</th>
//         <th className="p-3 text-center">Net Pay</th>
//         <th className="p-3 text-center">Action</th>
//       </tr>
//     </thead>

//     <tbody>
//       {interns.map((i) => {
//         const s = stipends[i._id] || {};
//         const net =
//           Number(s.baseSalary || 0) +
//           Number(s.bonus || 0) -
//           Number(s.deductions || 0);

//         return (
//           <tr key={i._id} className="border-t align-middle">
//             {/* INTERN */}
//             <td className="p-3 font-medium text-left whitespace-nowrap">
//               {i.name}
//             </td>

//             {/* GROSS */}
//             <td className="p-3 text-center">
//               <input
//                 type="number"
//                 min="0"
//                 className="border p-2 rounded w-32 text-center"
//                 value={s.baseSalary}
//                 onChange={(e) =>
//                   updateField(i._id, "baseSalary", e.target.value)
//                 }
//               />
//             </td>

//             {/* INCENTIVES */}
//             <td className="p-3 text-center">
//               <input
//                 type="number"
//                 min="0"
//                 className="border p-2 rounded w-32 text-center"
//                 value={s.bonus}
//                 onChange={(e) =>
//                   updateField(i._id, "bonus", e.target.value)
//                 }
//               />
//             </td>

//             {/* DEDUCTIONS */}
//             <td className="p-3 text-center">
//               <input
//                 type="number"
//                 min="0"
//                 className="border p-2 rounded w-32 text-center"
//                 value={s.deductions}
//                 onChange={(e) =>
//                   updateField(i._id, "deductions", e.target.value)
//                 }
//               />
//             </td>

//             {/* NET PAY */}
//             <td className="p-3 text-center font-semibold font-mono">
//               ₹ {Math.max(0, net)}
//             </td>

//             {/* ACTION */}
//             <td className="p-3 text-center">
//               <button
//                 onClick={() => handleUpdate(i._id)}
//                 disabled={loadingId === i._id}
//                 className="bg-blue-600 hover:bg-blue-700
//                 disabled:opacity-60 text-white px-5 py-2 rounded-lg"
//               >
//                 {loadingId === i._id ? "Saving…" : "Update"}
//               </button>
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   </table>

//   <div className="mt-6 flex justify-start">
//     <button
//       onClick={downloadExcel}
//       className="bg-green-600 hover:bg-green-700
//       text-white px-6 py-2.5 rounded-xl"
//     >
//       Download Salary Excel
//     </button>
//   </div>
// </div>

//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagerStipend;

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const ManagerStipend = () => {
  const [manager, setManager] = useState(null);
  const [interns, setInterns] = useState([]);
  const [stipends, setStipends] = useState({});
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loadingId, setLoadingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "manager") {
      window.location.href = "/";
      return;
    }
    setManager(user);
  }, []);

  /* ================= INIT STIPENDS (SAFE) ================= */
  const initStipends = (list) => {
    if (!Array.isArray(list)) return;

    const data = {};
    list.forEach((i) => {
      if (i?._id) {
        data[i._id] = {
          baseSalary: "",
          bonus: "",
          deductions: "",
        };
      }
    });
    setStipends(data);
  };

  /* ================= FETCH INTERNS ================= */
  const fetchInterns = async () => {
    try {
      const res = await api.get("/users/manager/interns");

      const safeInterns =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];

      setInterns(safeInterns);
      initStipends(safeInterns);
    } catch (err) {
      console.error("Failed to load interns", err);
      toast.error("Failed to load interns");
      setInterns([]);
      setStipends({});
    }
  };

  useEffect(() => {
    if (manager) fetchInterns();
  }, [manager]);

  /* ================= INPUT HANDLER ================= */
  const updateField = (id, field, value) => {
    setStipends((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  /* ================= UPDATE STIPEND ================= */
  const handleUpdate = async (internId) => {
    const s = stipends[internId];

    if (!s || Number(s.baseSalary) <= 0) {
      toast.error("Enter valid stipend amount");
      return;
    }

    try {
      setLoadingId(internId);

      await api.post("/salary/set", {
        userId: internId,
        baseSalary: Number(s.baseSalary),
        bonus: Number(s.bonus || 0),
        deductions: Number(s.deductions || 0),
        month,
      });

      toast.success("Stipend updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stipend");
    } finally {
      setLoadingId(null);
    }
  };

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
        <Navbar user={manager} onMenuClick={() => setSidebarOpen(true)} />

        <h1 className="text-2xl font-bold mb-6">
          Intern Stipend Management
        </h1>

        {/* MONTH */}
        <div className="mb-6 flex items-center gap-3">
          <label className="font-medium">Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>

        {interns.length === 0 ? (
          <p className="text-gray-500">No interns assigned to you.</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Intern</th>
                  <th className="p-3">Gross</th>
                  <th className="p-3">Incentives</th>
                  <th className="p-3">Deductions</th>
                  <th className="p-3">Net</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {interns.map((i) => {
                  const s = stipends[i._id] || {};
                  const net =
                    Number(s.baseSalary || 0) +
                    Number(s.bonus || 0) -
                    Number(s.deductions || 0);

                  return (
                    <tr key={i._id} className="border-t">
                      <td className="p-3 font-medium">{i.name}</td>

                      <td className="p-3">
                        <input
                          type="number"
                          className="border p-2 rounded w-28"
                          value={s.baseSalary || ""}
                          onChange={(e) =>
                            updateField(i._id, "baseSalary", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          className="border p-2 rounded w-28"
                          value={s.bonus || ""}
                          onChange={(e) =>
                            updateField(i._id, "bonus", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          className="border p-2 rounded w-28"
                          value={s.deductions || ""}
                          onChange={(e) =>
                            updateField(i._id, "deductions", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-3 font-semibold">₹ {Math.max(net, 0)}</td>

                      <td className="p-3">
                        <button
                          onClick={() => handleUpdate(i._id)}
                          disabled={loadingId === i._id}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          {loadingId === i._id ? "Saving…" : "Update"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerStipend;
