import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import { TextField, Input, Button, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { handleerror } from "../api/handleError";
import { getProject, updateProject } from "../api/projectApi";

export default function EditTask({
  open = true,
  onClose,
  projectId,
  setProject,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const id = projectId;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getProject(projectId);

        if (res.data?.project) {
          const project = res.data.project.find((p) => p._id === id);
          console.log(project);
          console.log(res.data.project);
          if (!project) {
            console.log(project);
            setError("project not found");
            return;
          }
          setTitle(project.title);
          setContent(project.content);
        }
      } catch (error) {
        handleerror(error, setError, navigate);
      }
    };
    fetchTask();
  }, [projectId]);

  const handleSubmit = async (e) => {
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
              onClick={handleSubmit}
              color="orangebutton"
            >
              {loading ? <CircularProgress size={30} /> : "Save Changes"}
            </Button>
            <Button onClick={handleBack} color="deletebutton">
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
