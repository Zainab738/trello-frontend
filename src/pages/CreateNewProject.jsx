import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import { TextField, Input, Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

function createNewProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
