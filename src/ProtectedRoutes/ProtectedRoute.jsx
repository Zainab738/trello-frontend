import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  console.log("protected route working");
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/Login" replace />;
  }
};

export default ProtectedRoute;
