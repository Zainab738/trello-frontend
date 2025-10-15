import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTasks } from "../api/taskApi";
import { Button } from "@mui/material";

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
        <Button onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Yes, delete"}
        </Button>

        <Button
          onClick={() => navigate(`/Tasks/${projectId}`)}
          color="deletebutton"
        >
          cancel{" "}
        </Button>
      </div>
    </div>
  );
}

export default DelTask;
