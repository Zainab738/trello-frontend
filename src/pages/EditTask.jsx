import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks, updateTasks } from "../api/taskApi";
import {
  TextField,
  Input,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";

function EditTask() {
  const { id, projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState(null);
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
          setDeadline(dayjs(task.deadline, "DD-MM-YYYY"));
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
    setLoading(true);

    try {
      const res = await updateTasks(id, {
        title,
        description,
        status,
        deadline: deadline ? deadline.format("DD-MM-YYYY") : null,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-72 max-w-sm bg-white text-blue-600 rounded-md p-6 space-y-4 shadow-lg">
        <p className="font-semibold text-center text-lg">Edit Task</p>

        {error && <p className="text-red-500">{error}</p>}

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <Input
            type="text"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Select Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Select Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Tasks">Tasks</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="In Review">In Review</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline"
              value={deadline ? dayjs(deadline) : null}
              onChange={(newValue) => setDeadline(newValue)}
              minDate={dayjs()}
            />
          </LocalizationProvider>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={30} /> : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
