import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../api/taskApi";
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

function CreateNewTask() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState(null);
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
        deadline: deadline ? deadline.format("DD-MM-YYYY") : null,
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-72 max-w-sm bg-white text-blue-600 rounded-md p-6 space-y-4 shadow-lg">
        <p className="font-semibold text-center text-lg">Create Task</p>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
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
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              minDate={dayjs()}
              format="DD-MM-YYYY"
            />
          </LocalizationProvider>

          <Button
            color="primary"
            sx={{ mt: 2 }}
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={30} /> : "Submit"}
          </Button>

          {error && <div className="text-sm text-red-500">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default CreateNewTask;
