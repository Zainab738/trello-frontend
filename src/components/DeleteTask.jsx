import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { deleteTasks } from "../api/taskApi";
import { handleerror } from "../api/handleError";

export default function DeleteTask({
  open = true,
  onClose,
  projectId,
  taskId,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteTasks(taskId);
      if (res.data?.message === "task deleted successfully") {
        window.location.reload();

        handleBack();
      } else {
        setError("Unexpected response from server");
      }
    } catch (error) {
      handleerror(error, setError, navigate);
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <Modal open={open} onClose={handleBack}>
      <Container className="flex flex-col justify-center items-center bg-white ">
        <p className=" font-semibold text-gray-800">
          Are you sure you want to delete this task?
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex space-x-4">
          <Button onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Yes, delete"}
          </Button>

          <Button onClick={handleBack} color="deletebutton">
            cancel{" "}
          </Button>
        </div>
      </Container>
    </Modal>
  );
}
