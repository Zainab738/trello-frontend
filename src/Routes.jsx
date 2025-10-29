import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Project from "./pages/Project";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import VerificationSuccess from "./pages/VerificationSuccess";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import ProtectedRoutelogin from "./ProtectedRoutes/ProtectedRoutelogin";
import NavbarLayout from "../src/NavbarLayout";

function FileRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<Project />} />
            <Route path="/Tasks/:projectId" element={<Tasks />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutelogin />}>
          <Route path="/Signup" element={<Signup />} />
          <Route
            path="/verification-success"
            element={<VerificationSuccess />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/UpdatePassword" element={<UpdatePassword />} />
          <Route
            path="/PasswordResetSuccess"
            element={<PasswordResetSuccess />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default FileRoutes;
