import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import { TextField, Input, Button, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { getProject, updateProject, getoneproject } from "../api/projectApi";

interface Project {
  _id: string;
  title: string;
  content: string;
}

interface EditTaskProps {
  open?: boolean;
  onClose: () => void;
  projectId: string;
  setProject: React.Dispatch<React.SetStateAction<Project[]>>;
}
export default function EditTask({
  open = true,
  onClose,
  projectId,
  setProject,
}: EditTaskProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const id = projectId;

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getoneproject(projectId);

        if (res.data?.project) {
          const project = res.data.project;
          setTitle(project.title);
          setContent(project.content);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch project");
        }
      }
    };
    fetchTask();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProject(id, {
        title,
        content,
      });
      if (res.data?.message === "updated") {
        setAlertType("success");
        setError("proj updated!");
        handleSnackbarOpen();
        setProject((prev) =>
          prev.map((project) =>
            project._id === id
              ? {
                  ...project,
                  title,
                  content,
                }
              : project
          )
        );
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: unknown) {
      setAlertType("error");

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to edit project");
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
        <p className=" font-semibold text-gray-800">Edit Project</p>

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
            value={content}
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
            fullWidth
          />

          <div className="flex space-x-4">
            <Button
              disabled={loading}
              sx={{ color: "orangebutton.main" }}
              type="submit"
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
