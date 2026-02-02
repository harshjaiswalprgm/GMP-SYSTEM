// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import ManagerDashboard from "./pages/ManagerDashboard";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import InternDashboard from "./pages/InternDashboard";
// import ManagerStipend from "./pages/ManagerStipend";
// import ManagerRevenue from "./pages/ManagerRevenue";
// import ManagerViewDashboard from "./pages/ManagerViewDashboard";
// import UserProfile from "./pages/UserProfile";
// import AdminProfile from "./pages/AdminProfile";
// import EditUserPage from "./pages/EditUserPage";
// import AddUserPage from "./pages/AddUserPage";
// import ManageUsers from "./pages/ManageUsers";
// import Unauthorized from "./pages/Unauthorized";

// import ProtectedRoute from "./pages/ProtectedRoute";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const App = () => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   const getRedirectPath = () => {
//     if (!user) return "/";
//     return `/${user.role}`;
//   };

//   return (
//     <BrowserRouter>
//       {/* 🔔 GLOBAL TOASTS (SINGLE INSTANCE) */}
//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="light"
//       />

//       <Routes>
//         {/* LOGIN */}
//         <Route
//           path="/"
//           element={
//             user ? <Navigate to={getRedirectPath()} replace /> : <Login />
//           }
//         />

//         {/* ADMIN */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/manage-users"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <ManageUsers />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/add-user"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AddUserPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/edit-user/:id"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <EditUserPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/profile"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AdminProfile />
//             </ProtectedRoute>
//           }
//         />

//         {/* MANAGER */}
//         <Route
//           path="/manager"
//           element={
//             <ProtectedRoute allowedRoles={["manager"]}>
//               <ManagerDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/manager/stipend"
//           element={
//             <ProtectedRoute allowedRoles={["manager"]}>
//               <ManagerStipend />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/manager/revenue"
//           element={
//             <ProtectedRoute allowedRoles={["manager"]}>
//               <ManagerRevenue />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/manager/view-dashboard/:id"
//           element={
//             <ProtectedRoute allowedRoles={["manager"]}>
//               <ManagerViewDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* SHARED */}
//         <Route
//           path="/admin/user/:id"
//           element={
//             <ProtectedRoute allowedRoles={["admin", "manager"]}>
//               <UserProfile />
//             </ProtectedRoute>
//           }
//         />

//         {/* EMPLOYEE */}
//         <Route
//           path="/employee"
//           element={
//             <ProtectedRoute allowedRoles={["employee"]}>
//               <EmployeeDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* INTERN */}
//         <Route
//           path="/intern"
//           element={
//             <ProtectedRoute allowedRoles={["intern"]}>
//               <InternDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* UNAUTHORIZED */}
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import InternDashboard from "./pages/InternDashboard";

import ManagerStipend from "./pages/ManagerStipend";
import ManagerRevenue from "./pages/ManagerRevenue";
import ManagerViewDashboard from "./pages/ManagerViewDashboard";

import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";

import EditUserPage from "./pages/EditUserPage";
import AddUserPage from "./pages/AddUserPage";
import ManageUsers from "./pages/ManageUsers";

import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./pages/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getRedirectPath = () => {
    if (!user) return "/";
    return `/${user.role}`;
  };

  return (
    <BrowserRouter>
      {/* 🔔 GLOBAL TOASTS */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={
            user ? <Navigate to={getRedirectPath()} replace /> : <Login />
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= MANAGER ================= */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ THIS WAS MISSING */}
        <Route
          path="/manager/manage-users"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/stipend"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerStipend />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/revenue"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerRevenue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/view-dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerViewDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SHARED ================= */}
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= INTERN ================= */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= UNAUTHORIZED ================= */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
