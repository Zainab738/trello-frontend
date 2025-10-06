import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../api/taskApi";

function CreateNewTask() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createTask({
        title,
        description,
        status,
        deadline,
        project: projectId,
      });

      if (res.data?.message === "task saved") {
        navigate(`/Tasks/${projectId}`);
      } else {
        setError(res.data?.message || "Task creation failed!");
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
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center w-72 bg-[#164B35] text-white rounded-sm p-5 space-y-2">
        <p>Create Task</p>

        <form className="space-y-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="bg-gray-900 p-1 rounded-sm w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="bg-gray-900 p-1 rounded-sm w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            className="bg-gray-900 p-1 rounded-sm w-full"
            value={status}
            placeholder="status"
            onChange={(e) => setStatus(e.target.value)}
          ></input>

          <input
            type="text"
            className="bg-gray-900 p-1 rounded-sm w-full"
            value={deadline}
            placeholder="deadline"
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-3 py-1 rounded-sm ${
              loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Creating..." : "Submit"}
          </button>

          {error && <div className="text-sm text-red-500">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default CreateNewTask;
