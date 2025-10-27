import { useState } from "react";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createTask } from "../api/taskApi";
import {
  TextField,
  Input,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { handleerror } from "../api/handleError";
import Alert from "@mui/material/Alert";
import TaskValidation from "../validation/TaskValidation";

export default function CreateTask({
  open = true,
  onClose,
  projectId,
  setTasks,
}) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState("");

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TaskValidation.validate(
        { title, description, status, deadline },
        { abortEarly: false }
      );
    } catch (validationError) {
      if (validationError) {
        const messages = validationError.inner
          .map((err) => err.message)
          .join(", ");
        setAlertType("error");
        setError(messages);
        handleSnackbarOpen();
        return;
      }
    }
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
        setAlertType("success");
        setError(res.data?.message);
        handleSnackbarOpen();
        setTasks((prev) => [...prev, res.data.task]);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setAlertType("error");
        setError(res.data?.message || "Task creation failed!");
        handleSnackbarOpen();
      }
    } catch (error) {
      setAlertType("error");
      handleerror(error, setError, navigate);
      handleSnackbarOpen();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onClose();
  };
  return (
    <Modal open={open} onClose={handleBack}>
      <Container className="flex flex-col justify-center items-center bg-white ">
        <p className=" font-semibold text-gray-800">Create Task</p>

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
          <div className="flex space-x-4">
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? <CircularProgress size={30} /> : "Save Changes"}
            </Button>
            <Button onClick={handleBack}>cancel </Button>
          </div>
          {/* Snackbar */}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            autoHideDuration={2000}
          >
            <Alert severity={alertType}>{error}</Alert>
          </Snackbar>
        </form>
      </Container>
    </Modal>
  );
}
