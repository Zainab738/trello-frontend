import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { deleteProject } from "../api/projectApi";
import Alert from "@mui/material/Alert";

export default function DeleteTask({
  open = true,
  onClose,
  projectId,
  setProject,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const id = projectId;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState("");

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("id");
      console.log(id);
      const res = await deleteProject(id);
      if (res.data?.message === "Project deleted successfully") {
        setAlertType("success");
        setError(res.data?.message);
        handleSnackbarOpen();
        setProject((prev) =>
          prev.filter((project) => project._id !== projectId)
        );
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setAlertType("error");
        setError("Unexpected response from server");
        handleSnackbarOpen();
      }
    } catch (err) {
      setAlertType("error");
      setError(err.message || "Failed to delete project");
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
        <p className=" font-semibold text-gray-800">
          Are you sure you want to delete this project?
        </p>

        <div className="flex space-x-4">
          <Button
            onClick={handleDelete}
            disabled={loading}
            color="orangebutton"
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </Button>

          <Button onClick={handleBack} color="deletebutton">
            cancel{" "}
          </Button>
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
      </Container>
    </Modal>
  );
}
