// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// const UserModal = ({ user, isEdit, onClose, onSave, allUsers = [] }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "intern",
//     position: "",
//     teamName: "",
//     manager: "",
//     joiningDate: "",
//     birthday: "",
//     password: "",
//   });

//   // ✅ Always array-safe + memoized
//   const managers = useMemo(() => {
//     if (!Array.isArray(allUsers)) return [];
//     return allUsers.filter((u) => u?.role === "manager");
//   }, [allUsers]);

//   /* ----------------------------------
//      LOAD USER DATA (EDIT MODE)
//   ---------------------------------- */
//   useEffect(() => {
//     if (!user) return;

//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       role: user.role || "intern",
//       position: user.position || "",
//       teamName: user.teamName || "",
//       manager: user.manager?._id || user.manager || "",
//       joiningDate: user.joiningDate
//         ? user.joiningDate.split("T")[0]
//         : "",
//       birthday: user.birthday ? user.birthday.split("T")[0] : "",
//       password: "",
//     });
//   }, [user]);

//   /* ----------------------------------
//      INPUT HANDLER
//   ---------------------------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   /* ----------------------------------
//      SUBMIT HANDLER (VALIDATION)
//   ---------------------------------- */
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const cleaned = {
//       ...formData,
//       name: formData.name.trim(),
//       email: formData.email.trim(),
//       phone: formData.phone.trim(),
//       teamName: formData.teamName.trim(),
//       position: formData.position.trim(),
//     };

//     if (!cleaned.name || !cleaned.email || !cleaned.role) {
//       toast.error("Name, Email & Role are required");
//       return;
//     }

//     // Intern & Employee MUST have manager
//     if (
//       ["intern", "employee"].includes(cleaned.role) &&
//       !cleaned.manager
//     ) {
//       toast.error("Please assign a manager");
//       return;
//     }

//     onSave(cleaned);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <motion.div
//         className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit User" : "Add New User"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           {/* NAME */}
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />

//           {/* EMAIL */}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             disabled={isEdit}
//             className="w-full border rounded p-2 bg-gray-100"
//           />

//           {/* PHONE */}
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />

//           {/* ROLE */}
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           >
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="employee">Probation Employee</option>
//             <option value="intern">Intern</option>
//           </select>

//           {/* MANAGER (INTERN / EMPLOYEE) */}
//           {["intern", "employee"].includes(formData.role) && (
//             <select
//               name="manager"
//               value={formData.manager}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             >
//               <option value="">Select Manager</option>
//               {managers.map((m) => (
//                 <option key={m._id} value={m._id}>
//                   {m.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* INTERN */}
//           {formData.role === "intern" && (
//             <input
//               type="text"
//               name="teamName"
//               placeholder="Team Name"
//               value={formData.teamName}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           )}

//           {/* EMPLOYEE */}
//           {formData.role === "employee" && (
//             <input
//               type="text"
//               name="position"
//               placeholder="Position"
//               value={formData.position}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           )}

//           {/* MANAGER */}
//           {formData.role === "manager" && (
//             <input
//               type="text"
//               name="teamName"
//               placeholder="Team Name"
//               value={formData.teamName}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           )}

//           {/* JOINING DATE */}
//           <label className="text-sm text-gray-600">Joining Date</label>
//           <input
//             type="date"
//             name="joiningDate"
//             value={formData.joiningDate}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />

//           {/* BIRTHDAY */}
//           <label className="text-sm text-gray-600">Birthday</label>
//           <input
//             type="date"
//             name="birthday"
//             value={formData.birthday}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />

//           {/* PASSWORD (ONLY CREATE) */}
//           {!isEdit && (
//             <input
//               type="password"
//               name="password"
//               placeholder="Set Temporary Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           )}

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//             >
//               {isEdit ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default UserModal;

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const UserModal = ({ user, isEdit, onClose, onSave, allUsers = [] }) => {
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const isAdmin = loggedInUser?.role === "admin";
  const isManager = loggedInUser?.role === "manager";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "intern",
    position: "",
    teamName: "",
    manager: "",
    joiningDate: "",
    birthday: "",
    password: "",
  });

  /* ================= MANAGER LIST (ADMIN ONLY) ================= */
  const managers = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers.filter((u) => u?.role === "manager");
  }, [allUsers]);

  /* ================= LOAD USER (EDIT) ================= */
  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "intern",
      position: user.position || "",
      teamName: user.teamName || "",
      manager: user.manager?._id || user.manager || "",
      joiningDate: user.joiningDate
        ? user.joiningDate.split("T")[0]
        : "",
      birthday: user.birthday ? user.birthday.split("T")[0] : "",
      password: "",
    });
  }, [user]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const cleaned = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      teamName: formData.teamName.trim(),
      position: formData.position.trim(),
    };

    if (!cleaned.name || !cleaned.email || !cleaned.role) {
      toast.error("Name, Email & Role are required");
      return;
    }

    // 🔐 Manager auto-assign
    if (isManager) {
      cleaned.manager = loggedInUser._id;
    }

    if (
      ["intern", "employee"].includes(cleaned.role) &&
      !cleaned.manager
    ) {
      toast.error("Manager assignment missing");
      return;
    }

    onSave(cleaned);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isEdit}
            className="w-full border rounded p-2 bg-gray-100"
          />

          {/* PHONE */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {isAdmin && <option value="admin">Admin</option>}
            {isAdmin && <option value="manager">Manager</option>}
            <option value="employee">Probation Employee</option>
            <option value="intern">Intern</option>
          </select>

          {/* MANAGER SELECT (ADMIN ONLY) */}
          {isAdmin &&
            ["intern", "employee"].includes(formData.role) && (
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}

          {/* INTERN */}
          {formData.role === "intern" && (
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* EMPLOYEE */}
          {formData.role === "employee" && (
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* MANAGER */}
          {isAdmin && formData.role === "manager" && (
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* JOINING DATE */}
          <label className="text-sm text-gray-600">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* BIRTHDAY */}
          <label className="text-sm text-gray-600">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* PASSWORD (CREATE ONLY) */}
          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Set Temporary Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;
