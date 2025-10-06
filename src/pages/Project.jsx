import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getProject } from "../api/projectApi";
function Project() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [project, setProject] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProject();
        console.log("Fetched:", res.data);

        if (res.data?.message === "Project fetched successfully") {
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
    <div className="flex flex-col space-y-4 ml-2">
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-lg font-bold">Projects</h1>
        <button
          onClick={() => navigate("/createnewproject")}
          className="text-white bg-[#803FA5] p-2 rounded-sm"
        >
          Create new Project
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ol className="space-y-2">
        {project.length > 0 ? (
          project.map((proj) => (
            <li
              key={proj._id}
              className="flex items-center justify-start text-white "
            >
              <button
                onClick={() => navigate(`/Tasks/${proj._id}`)}
                className="text-base font-medium hover:underline"
              >
                {proj.title}
              </button>

              <button
                onClick={() => navigate(`/deleteProject/${proj._id}`)}
                className="hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
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
