import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import { TextField, Input, Button, Snackbar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

interface Project {
  _id: string;
  title: string;
  content: string;
}

interface CreateProjectProps {
  open?: boolean;
  onClose: () => void;
  setProject: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function CreateProject({
  open = true,
  onClose,
  setProject,
}: CreateProjectProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await createProject({ title, content });

      if (res.data?.message === "project created") {
        setAlertType("success");
        setError(res.data?.message);
        handleSnackbarOpen();
        setProject((prev) => [...prev, res.data.project]);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setAlertType("error");
        setError(res.data?.message || "Project creation failed!");
        handleSnackbarOpen();
      }
    } catch (err: unknown) {
      setAlertType("error");

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create task");
      }

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
        <p className=" font-semibold text-gray-800">Create Project</p>

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
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <div className="flex space-x-4">
            <Button
              disabled={loading}
              type="submit"
              sx={{ color: "orangebutton.main" }}
            >
              {loading ? <CircularProgress size={30} /> : "Save Changes"}
            </Button>
            <Button onClick={handleBack} sx={{ color: "deletebutton.main" }}>
              cancel{" "}
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
