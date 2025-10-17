import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Project from "./pages/Project";
import "./App.css";
import CreateNewProject from "./pages/CreateNewProject";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DelProject from "./pages/DelProject";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../src/ProtectedRoute";
import ProtectedRoutelogin from "../src/ProtectedRoutelogin";

function fileRoutes() {
  return (
    <>
      <Router>
        {<Navbar />}
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Project />} />
            <Route path="/Tasks/:projectId" element={<Tasks />} />
            <Route path="/createnewproject" element={<CreateNewProject />} />
            <Route path="/deleteproject/:id" element={<DelProject />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route element={<ProtectedRoutelogin />}>
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default fileRoutes;
