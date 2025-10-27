import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import { TextField, Input, Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { handleerror } from "../api/handleError";
import ProjectValidation from "../validation/ProjectValidation";

function createNewProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ProjectValidation.validate(
        { title, content },
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
    try {
      setLoading(true);
      const res = await createProject({ title, content });

      if (res.data?.message === "project created") {
        navigate("/");
      } else {
        console.log(res.data?.message || "Project creation failed!");
      }
    } catch (error) {
      handleerror(error, setError, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center w-60 max-w-sm bg-white text-blue-600 rounded-md p-6 space-y-4 shadow-lg">
          <p className="font-semibold text-center text-lg">Project</p>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></Input>
            <TextField
              type="text"
              placeholder="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></TextField>
            <Button type="submit" disabled={loading} color="primary">
              {loading ? <CircularProgress size={30} /> : "Submit"}
            </Button>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default createNewProject;
