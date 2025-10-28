import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import { TextField, Input, Button, Snackbar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { handleerror } from "../api/handleError";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

export default function CreateProject({ open = true, onClose, setProject }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState("");

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
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
