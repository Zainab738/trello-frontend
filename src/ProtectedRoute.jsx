import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  console.log("protected route working");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
