import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import {
  TextField,
  Input,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { getTasks, updateTasks } from "../api/taskApi";
import Alert from "@mui/material/Alert";
import type { Task } from "../components/type";
import { ValidationError } from "yup";
import TaskValidation from "../validation/TaskValidation";

interface EditTaskProps {
  open?: boolean;
  onClose: () => void;
  projectId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  taskId: string;
}

export default function EditTask({
  open = true,
  onClose,
  projectId,
  taskId,
  setTasks,
}: EditTaskProps) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "Tasks" | "In Progress" | "In Review" | "Done"
  >("Tasks");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const id = taskId;

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTasks(projectId);
        if (res.data?.task) {
          const task = res.data.task.find((t: Task) => t._id === id);
          if (!task) {
            setError("Task not found");
            return;
          }
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setDeadline(dayjs(task.deadline, "DD-MM-YYYY"));
        }
      } catch (err: unknown) {
        setAlertType("error");
        if (err instanceof Error)
          setError(err.message || "Failed to create task");
        handleSnackbarOpen();
      }
    };
    fetchTask();
  }, [id, projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await TaskValidation.validate(
        { title, description, status, deadline },
        { abortEarly: false }
      );
    } catch (err) {
      const validationError = err as ValidationError;

      if (validationError.inner && validationError.inner.length > 0) {
        const messages = validationError.inner.map((e) => e.message).join(", ");
        setAlertType("error");
        setError(messages);
        setLoading(false);
        handleSnackbarOpen();
        return;
      }
    }
    setError("");
    setLoading(true);

    try {
      const res = await updateTasks(id, {
        title,
        description,
        status,
        deadline: deadline ? deadline.format("DD-MM-YYYY") : "",
        project: projectId,
      });

      if (res.data?.message === "updated") {
        setAlertType("success");
        setError(res.data?.message);
        handleSnackbarOpen();
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id
              ? {
                  ...task,
                  title,
                  description,
                  status,
                  deadline: deadline ? deadline.format("DD-MM-YYYY") : "",
                }
              : task
          )
        );
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: unknown) {
      setAlertType("error");
      if (err instanceof Error)
        setError(err.message || "Failed to update task");
      handleSnackbarOpen();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Container className="flex flex-col justify-center items-center bg-white p-6 rounded-md">
        <p className="font-semibold text-gray-800 mb-4">Edit Task</p>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            sx={{ mb: 2 }}
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

          <div className="flex space-x-4 mt-4">
            <Button
              disabled={loading}
              type="submit"
              sx={{ color: "orangebutton.main" }}
            >
              {loading ? <CircularProgress size={30} /> : "Save Changes"}
            </Button>
            <Button onClick={onClose} sx={{ color: "deletebutton.main" }}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity={alertType}>{error}</Alert>
        </Snackbar>
      </Container>
    </Modal>
  );
}
