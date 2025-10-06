import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";

function createNewProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await createProject({ title, content });

      if (res.data?.message === "project created") {
        navigate("/");
      } else {
        console.log(res.data?.message || "Project creation failed!");
      }
    } catch (error) {
      if (!error.response) {
        setError("Network error: " + error.message);
        return;
      }

      const { status, data } = error.response;

      let message = "Something went wrong!";
      if (status === 500) {
        message = data?.error?.errorResponse?.errmsg || "Server error";
      } else if (status === 400) {
        if (Array.isArray(data?.error?.errors)) {
          message = data.error.errors.join(" , ");
        } else if (status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
        } else {
          message =
            data?.message || data?.error?.message || "Validation failed";
        }
      } else {
        message = data?.message || message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center w-60 bg-[#164B35] text-white rounded-sm p-5 space-y-2">
          <p>Project</p>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="title"
              className="bg-gray-900 p-1 rounded-sm"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <input
              type="text"
              placeholder="content"
              className="bg-gray-900 p-1 rounded-sm"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></input>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Submit"}
            </button>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default createNewProject;
