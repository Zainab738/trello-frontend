import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutelogin = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};
export default ProtectedRoutelogin;
