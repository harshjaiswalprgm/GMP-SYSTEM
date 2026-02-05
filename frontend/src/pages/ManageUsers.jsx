// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import UserTable from "../components/UserTable";
// import UserModal from "../components/UserModal";
// import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   /* ================= ROLE GUARD ================= */
//   useEffect(() => {
//     if (!storedUser || !["admin", "manager"].includes(storedUser.role)) {
//       window.location.href = "/unauthorized";
//       return;
//     }
//     fetchUsers();
//     // eslint-disable-next-line
//   }, []);

//   /* ================= FETCH USERS ================= */
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);

//       const res =
//         storedUser.role === "manager"
//           ? await api.get("/users/manager/interns")
//           : await api.get("/users");

//       setUsers(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       toast.error("Failed to fetch users");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */
//   const handleAdd = () => {
//     setSelectedUser(null);
//     setIsEdit(false);
//     setShowModal(true);
//   };

//   const handleEdit = (user) => {
//     if (!user) return;
//     setSelectedUser(user);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   const handleDelete = (user) => {
//     if (!user) return;
//     setSelectedUser(user);
//     setShowDelete(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedUser?._id) return;

//     try {
//       setSaving(true);
//       await api.delete(`/users/${selectedUser._id}`);
//       toast.success("User deleted");
//       setShowDelete(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       toast.error("Failed to delete user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSave = async (data) => {
//   if (!data) return;

//   try {
//     setSaving(true);

//     const payload = { ...data };

//     // 🔒 MANAGER RULE: never send manager field
//     if (storedUser.role === "manager") {
//       delete payload.manager;
//     }

//     if (isEdit && selectedUser?._id) {
//       await api.put(`/users/${selectedUser._id}`, payload);
//       toast.success("User updated");
//     } else {
//       await api.post("/users", payload);
//       toast.success("User created");
//     }

//     setShowModal(false);
//     setSelectedUser(null);
//     fetchUsers();
//   } catch (err) {
//     console.error("Error saving user:", err);
//     toast.error(
//       err.response?.data?.message || "Failed to save user"
//     );
//   } finally {
//     setSaving(false);
//   }
// };


//   /* ================= UI ================= */
//   return (
//     <div className="p-3 sm:p-6 bg-gray-100 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//         className="bg-white shadow-xl rounded-2xl p-4 sm:p-6"
//       >
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//               👥 {storedUser.role === "manager" ? "My Team" : "Manage Users"}
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-500 mt-1">
//               {storedUser.role === "manager"
//                 ? "Add and manage your team members"
//                 : "Create, edit, assign roles & manage team structure"}
//             </p>
//           </div>

//           <button
//             onClick={handleAdd}
//             disabled={saving}
//             className="
//               w-full sm:w-auto
//               bg-gradient-to-r from-orange-500 to-orange-600
//               text-white px-5 py-2.5 rounded-xl font-semibold
//               hover:shadow-lg hover:scale-[1.02]
//               disabled:opacity-60 disabled:cursor-not-allowed
//               transition-all
//             "
//           >
//             + Add User
//           </button>
//         </div>

//         {/* CONTENT */}
//         {loading ? (
//           <div className="text-center py-10 text-gray-500">
//             Loading users…
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-10 text-gray-500">
//             No users found. Start by adding one.
//           </div>
//         ) : (
//           <div className="relative -mx-4 sm:mx-0 overflow-x-auto">
//             <div className="min-w-[700px] sm:min-w-full px-4 sm:px-0">
//               <UserTable
//                 users={users}
//                 onEdit={storedUser.role === "admin" ? handleEdit : null}
//                 onDelete={storedUser.role === "admin" ? handleDelete : null}
//               />
//             </div>
//           </div>
//         )}
//       </motion.div>

//       {/* USER MODAL */}
//       {showModal && (
//         <UserModal
//           user={selectedUser}
//           isEdit={isEdit}
//           allUsers={users}
//           onClose={() => !saving && setShowModal(false)}
//           onSave={handleSave}
//         />
//       )}

//       {/* DELETE CONFIRM */}
//       {showDelete && selectedUser && (
//         <ConfirmDeleteModal
//           user={selectedUser}
//           loading={saving}
//           onClose={() => !saving && setShowDelete(false)}
//           onConfirm={confirmDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default ManageUsers;

// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import UserTable from "../components/UserTable";
// import UserModal from "../components/UserModal";
// import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";


// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);


//   /* 🔑 RESET PASSWORD STATES (NEW) */
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [newPassword, setNewPassword] = useState("");

//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   /* ================= ROLE GUARD ================= */
//   useEffect(() => {
//     if (!storedUser || !["admin", "manager"].includes(storedUser.role)) {
//       window.location.href = "/unauthorized";
//       return;
//     }
//     fetchUsers();
//     // eslint-disable-next-line
//   }, []);

//   /* ================= FETCH USERS ================= */
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);

//       const res =
//         storedUser.role === "manager"
//           ? await api.get("/users/manager/interns")
//           : await api.get("/users");

//       setUsers(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       toast.error("Failed to fetch users");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */
//   const handleAdd = () => {
//     setSelectedUser(null);
//     setIsEdit(false);
//     setShowModal(true);
//   };

//   const handleEdit = (user) => {
//     if (!user) return;
//     setSelectedUser(user);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   const handleDelete = (user) => {
//     if (!user) return;
//     setSelectedUser(user);
//     setShowDelete(true);
//   };

//   /* 🔑 RESET PASSWORD HANDLER (NEW) */
//   const handleResetPassword = (user) => {
//     setSelectedUser(user);
//     setNewPassword("");
//     setShowResetPassword(true);
//   };

//   const submitResetPassword = async () => {
//     if (!newPassword || newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       setSaving(true);
//       await api.post(
//         `/users/${selectedUser._id}/reset-password`,
//         { password: newPassword }
//       );

//       toast.success("Password updated successfully");
//       setShowResetPassword(false);
//       setSelectedUser(null);
//       setNewPassword("");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to reset password"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!selectedUser?._id) return;

//     try {
//       setSaving(true);
//       await api.delete(`/users/${selectedUser._id}`);
//       toast.success("User deleted");
//       setShowDelete(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       toast.error("Failed to delete user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSave = async (data) => {
//     if (!data) return;

//     try {
//       setSaving(true);

//       const payload = { ...data };

//       if (storedUser.role === "manager") {
//         delete payload.manager;
//       }

//       if (isEdit && selectedUser?._id) {
//         await api.put(`/users/${selectedUser._id}`, payload);
//         toast.success("User updated");
//       } else {
//         await api.post("/users", payload);
//         toast.success("User created");
//       }

//       setShowModal(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error saving user:", err);
//       toast.error(err.response?.data?.message || "Failed to save user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-3 sm:p-6 bg-gray-100 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//         className="bg-white shadow-xl rounded-2xl p-4 sm:p-6"
//       >
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//               👥 {storedUser.role === "manager" ? "My Team" : "Manage Users"}
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-500 mt-1">
//               {storedUser.role === "manager"
//                 ? "Add and manage your team members"
//                 : "Create, edit, assign roles & manage team structure"}
//             </p>
//           </div>

//           <button
//             onClick={handleAdd}
//             disabled={saving}
//             className="bg-gradient-to-r from-orange-500 to-orange-600
//               text-white px-5 py-2.5 rounded-xl font-semibold
//               hover:shadow-lg hover:scale-[1.02]
//               disabled:opacity-60 transition-all"
//           >
//             + Add User
//           </button>
//         </div>

//         {/* TABLE */}
//         {loading ? (
//           <div className="text-center py-10 text-gray-500">
//             Loading users…
//           </div>
//         ) : (
//           <UserTable
//             users={users}
//             onEdit={storedUser.role === "admin" ? handleEdit : null}
//             onDelete={storedUser.role === "admin" ? handleDelete : null}
//             onResetPassword={
//               storedUser.role === "admin" ? handleResetPassword : null
//             }
//           />
//         )}
//       </motion.div>

//       {/* USER MODAL */}
//       {showModal && (
//         <UserModal
//           user={selectedUser}
//           isEdit={isEdit}
//           allUsers={users}
//           onClose={() => !saving && setShowModal(false)}
//           onSave={handleSave}
//         />
//       )}

//       {/* DELETE MODAL */}
//       {showDelete && selectedUser && (
//         <ConfirmDeleteModal
//           user={selectedUser}
//           loading={saving}
//           onClose={() => !saving && setShowDelete(false)}
//           onConfirm={confirmDelete}
//         />
//       )}

//       {/* 🔑 RESET PASSWORD MODAL */}
//       {showResetPassword && selectedUser && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-2">
//               Reset Password
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Set new password for <b>{selectedUser.email}</b>
//             </p>

//            <div className="relative mb-4">
//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder="New password"
//     value={newPassword}
//     onChange={(e) => setNewPassword(e.target.value)}
//     className="input pr-10"
//   />

//   <button
//     type="button"
//     onClick={() => setShowPassword((prev) => !prev)}
//     className="absolute right-3 top-1/2 -translate-y-1/2
//       text-gray-500 hover:text-gray-700 transition"
//     aria-label="Toggle password visibility"
//   >
//     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>


//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowResetPassword(false)}
//                 className="px-4 py-2 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitResetPassword}
//                 className="btn-primary"
//                 disabled={saving}
//               >
//                 Update Password
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUsers;



// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import UserTable from "../components/UserTable";
// import UserModal from "../components/UserModal";
// import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   /* 🔑 RESET PASSWORD */
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   /* ================= ROLE GUARD ================= */
//   useEffect(() => {
//     if (!storedUser || !["admin", "manager"].includes(storedUser.role)) {
//       window.location.href = "/unauthorized";
//       return;
//     }
//     fetchUsers();
//     // eslint-disable-next-line
//   }, []);

//   /* ================= FETCH USERS ================= */
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res =
//         storedUser.role === "manager"
//           ? await api.get("/users/manager/interns")
//           : await api.get("/users");

//       setUsers(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       toast.error("Failed to fetch users");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= CRUD HANDLERS ================= */
//   const handleAdd = () => {
//     setSelectedUser(null);
//     setIsEdit(false);
//     setShowModal(true);
//   };

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDelete(true);
//   };

//   /* 🔑 RESET PASSWORD */
//   const handleResetPassword = (user) => {
//     if (storedUser.role !== "admin") return;

//     setSelectedUser(user);
//     setNewPassword("");
//     setShowPassword(false);
//     setShowResetPassword(true);
//   };

//   const submitResetPassword = async () => {
//     if (!newPassword || newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       setSaving(true);
//       await api.post(
//         `/users/${selectedUser._id}/reset-password`,
//         { password: newPassword }
//       );

//       toast.success("Password updated successfully");
//       closeResetModal();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Reset failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const closeResetModal = () => {
//     setShowResetPassword(false);
//     setSelectedUser(null);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   const confirmDelete = async () => {
//     try {
//       setSaving(true);
//       await api.delete(`/users/${selectedUser._id}`);
//       toast.success("User deleted");
//       setShowDelete(false);
//       fetchUsers();
//     } catch {
//       toast.error("Failed to delete user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSave = async (data) => {
//     try {
//       setSaving(true);
//       const payload = { ...data };

//       if (storedUser.role === "manager") delete payload.manager;

//       if (isEdit) {
//         await api.put(`/users/${selectedUser._id}`, payload);
//         toast.success("User updated");
//       } else {
//         await api.post("/users", payload);
//         toast.success("User created");
//       }

//       setShowModal(false);
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//         className="bg-white shadow-xl rounded-2xl p-6"
//       >
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               👥 {storedUser.role === "manager" ? "My Team" : "Manage Users"}
//             </h2>
//             <p className="text-sm text-gray-500">
//               Manage users, roles & credentials
//             </p>
//           </div>

//           <button
//             onClick={handleAdd}
//             disabled={saving}
//             className="bg-gradient-to-r from-orange-500 to-orange-600
//               text-white px-5 py-2 rounded-xl font-semibold
//               hover:shadow-lg transition"
//           >
//             + Add User
//           </button>
//         </div>

//         {/* TABLE */}
//         {loading ? (
//           <div className="text-center py-10 text-gray-500">
//             Loading users…
//           </div>
//         ) : (
//           <UserTable
//             users={users}
//             onEdit={storedUser.role === "admin" ? handleEdit : null}
//             onDelete={storedUser.role === "admin" ? handleDelete : null}
//             onResetPassword={storedUser.role === "admin" ? handleResetPassword : null}
//           />
//         )}
//       </motion.div>

//       {/* MODALS */}
//       {showModal && (
//         <UserModal
//           user={selectedUser}
//           isEdit={isEdit}
//           allUsers={users}
//           onClose={() => !saving && setShowModal(false)}
//           onSave={handleSave}
//         />
//       )}

//       {showDelete && (
//         <ConfirmDeleteModal
//           user={selectedUser}
//           loading={saving}
//           onClose={() => !saving && setShowDelete(false)}
//           onConfirm={confirmDelete}
//         />
//       )}

//       {/* RESET PASSWORD MODAL */}
//       {showResetPassword && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Set new password for <b>{selectedUser.email}</b>
//             </p>

//             <div className="relative mb-4">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="New password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="input pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((p) => !p)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             <div className="flex justify-end gap-3">
//               <button onClick={closeResetModal} className="text-sm">
//                 Cancel
//               </button>
//               <button
//                 onClick={submitResetPassword}
//                 disabled={saving}
//                 className="btn-primary"
//               >
//                 Update Password
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUsers;

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* 🔑 RESET PASSWORD */
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (!storedUser || !["admin", "manager"].includes(storedUser.role)) {
      window.location.href = "/unauthorized";
      return;
    }
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res =
        storedUser.role === "manager"
          ? await api.get("/users/manager/interns")
          : await api.get("/users");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleAdd = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  /* 🔑 RESET PASSWORD */
  const handleResetPassword = (user) => {
    if (storedUser.role !== "admin") return;
    setSelectedUser(user);
    setNewPassword("");
    setShowPassword(false);
    setShowResetPassword(true);
  };

  const submitResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      await api.post(
        `/users/${selectedUser._id}/reset-password`,
        { password: newPassword }
      );
      toast.success("Password updated successfully");
      closeResetModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  const closeResetModal = () => {
    setShowResetPassword(false);
    setSelectedUser(null);
    setNewPassword("");
    setShowPassword(false);
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      await api.delete(`/users/${selectedUser._id}`);
      toast.success("User deleted");
      setShowDelete(false);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SAVE USER (🔥 FIXED) ================= */
  const handleSave = async (data) => {
    try {
      setSaving(true);
      const payload = { ...data };

      // 🔐 Manager can never control manager field
      if (storedUser.role === "manager") {
        delete payload.manager;
      }

      // 🧹 FIX: never send empty manager
      if (payload.manager === "") {
        payload.manager = null;
      }

      // 🧠 Roles that don't need manager
      if (!["intern", "employee"].includes(payload.role)) {
        payload.manager = null;
      }

      if (isEdit) {
        await api.put(`/users/${selectedUser._id}`, payload);
        toast.success("User updated");
      } else {
        await api.post("/users", payload);
        toast.success("User created");
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white shadow-xl rounded-2xl p-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              👥 {storedUser.role === "manager" ? "My Team" : "Manage Users"}
            </h2>
            <p className="text-sm text-gray-500">
              Manage users, roles & credentials
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-orange-600
              text-white px-5 py-2 rounded-xl font-semibold
              hover:shadow-lg transition"
          >
            + Add User
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading users…
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={storedUser.role === "admin" ? handleEdit : null}
            onDelete={storedUser.role === "admin" ? handleDelete : null}
            onResetPassword={
              storedUser.role === "admin" ? handleResetPassword : null
            }
          />
        )}
      </motion.div>

      {/* MODALS */}
      {showModal && (
        <UserModal
          user={selectedUser}
          isEdit={isEdit}
          allUsers={users}
          onClose={() => !saving && setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showDelete && (
        <ConfirmDeleteModal
          user={selectedUser}
          loading={saving}
          onClose={() => !saving && setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set new password for <b>{selectedUser.email}</b>
            </p>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeResetModal} className="text-sm">
                Cancel
              </button>
              <button
                onClick={submitResetPassword}
                disabled={saving}
                className="btn-primary"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
