import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Project from "./pages/Project";
import CreateNewProject from "./pages/CreateNewProject";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import ProtectedRoutelogin from "./ProtectedRoutes/ProtectedRoutelogin";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import Navbar from "../src/components/Navbar";
import VerificationSuccess from "./pages/VerificationSuccess";

function FileRoutesInner() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/Login" &&
        location.pathname !== "/Signup" &&
        location.pathname !== "/ResetPassword" &&
        location.pathname !== "/PasswordResetSuccess" &&
        location.pathname !== "/UpdatePassword" &&
        location.pathname !== "/verification-success" && <Navbar />}

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Project />} />
          <Route path="/Tasks/:projectId" element={<Tasks />} />
          <Route path="/createnewproject" element={<CreateNewProject />} />
          /<Route path="*" element={<Navigate to="/" replace />} />
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
      </Routes>
    </>
  );
}

function FileRoutes() {
  return (
    <Router>
      <FileRoutesInner />
    </Router>
  );
}

export default FileRoutes;
