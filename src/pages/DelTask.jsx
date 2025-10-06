import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTasks } from "../api/taskApi";

function DelTask() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteTasks(taskId);
      if (res.data?.message === "task deleted successfully") {
        navigate(`/Tasks/${projectId}`);
      } else {
        setError("Unexpected response from server");
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
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        Are you sure you want to delete this task?
      </h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>

        <button
          onClick={() => navigate(`/Tasks/${projectId}`)}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          cancel{" "}
        </button>
      </div>
    </div>
  );
}

export default DelTask;
