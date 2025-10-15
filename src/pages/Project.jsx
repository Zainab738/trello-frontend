import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProject } from "../api/projectApi";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Project() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [project, setProject] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProject();
        console.log("Fetched:", res.data);

        if (
          res.data?.message === "Project fetched successfully" ||
          res.data?.message === "no projects yet "
        ) {
          setProject(res.data.project || []);
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
        console.error("Fetch error:", error);

        if (!error.response) {
          setError("Network error: " + error.message);
          return;
        }

        const { status, data } = error.response;

        if (status === 404) {
          setError(data?.message || "No tasks found for this project.");
        } else if (status === 500) {
          setError(data?.message || "Server error. Please try again later.");
        } else if (status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
        } else {
          setError("Something went wrong.");
        }
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col space-y-4 ml-2 mt-20">
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-lg font-bold">Projects</h1>

        <Button
          variant="contained"
          onClick={() => navigate("/createnewproject")}
          color="primary"
        >
          Create new Project
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ol className="space-y-2">
        {project.length > 0 ? (
          project.map((proj) => (
            <li
              key={proj._id}
              className="flex items-center justify-start text-black "
            >
              <Button
                variant="outlined"
                onClick={() => navigate(`/Tasks/${proj._id}`)}
                color="primary"
              >
                {proj.title}
              </Button>

              <IconButton
                onClick={() => navigate(`/deleteProject/${proj._id}`)}
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No projects found</p>
        )}
      </ol>
    </div>
  );
}

export default Project;
