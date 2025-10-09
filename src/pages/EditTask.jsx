import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks, updateTasks } from "../api/taskApi";

function EditTask() {
  const { id, projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTasks(projectId);

        if (res.data?.task) {
          const task = res.data.task.find((t) => t._id === id);
          if (!task) {
            setError("Task not found");
            return;
          }
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setDeadline(task.deadline?.split("T")[0] || "");
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
        } else {
          setError("Something went wrong.");
        }
      }
    };
    fetchTask();
  }, [id, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateTasks(id, {
        title,
        description,
        status,
        deadline,
        project: projectId,
      });
      if (res.data?.message === "updated") {
        console.log("Task updated!");
        navigate(`/Tasks/${projectId}`);
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
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-72 bg-[#164B35] text-white rounded-sm p-5 space-y-3">
        <h2 className="text-lg font-semibold">Edit Task</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            placeholder="Title"
            className="bg-gray-900 p-2 rounded-sm w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            value={description}
            placeholder="Description"
            className="bg-gray-900 p-2 rounded-sm w-full"
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={status}
            className="bg-gray-900 p-2 rounded-sm w-full"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select status</option>
            <option value="Tasks">Tasks</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <input
            type="date"
            value={deadline}
            className="bg-gray-900 p-2 rounded-sm w-full"
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />

          <button
            type="submit"
            className="px-3 py-1 rounded-sm bg-green-600 hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
