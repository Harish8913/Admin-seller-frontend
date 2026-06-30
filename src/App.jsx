import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const App = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={token && role === "SELLER" ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin"
        element={token && role === "ADMIN" ? <AdminDashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={token ? (role === "ADMIN" ? "/admin" : "/dashboard") : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
