import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Project from "./pages/Project";
import "./App.css";
import CreateNewProject from "./pages/CreateNewProject";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DelProject from "./pages/DelProject";
import CreateNewTask from "./pages/CreateNewTask";
import EditTask from "./pages/EditTask";
import DelTask from "./pages/DelTask";
import { Navigate } from "react-router-dom";
function fileRoutes() {
  return (
    <>
      <Router>
        {<Navbar />}
        <Routes>
          <Route path="/" element={<Project />} />
          <Route path="/Tasks/:projectId" element={<Tasks />} />
          <Route path="/CreateNewTask/:projectId" element={<CreateNewTask />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/createnewproject" element={<CreateNewProject />} />
          <Route path="/createnewtask" element={<CreateNewTask />} />
          <Route path="/deleteproject/:id" element={<DelProject />} />
          <Route path="/edittask/:projectId/:id" element={<EditTask />} />
          <Route path="/DelTask/:projectId/:taskId" element={<DelTask />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default fileRoutes;
