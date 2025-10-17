import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProject } from "../api/projectApi";
import { Button } from "@mui/material";
import { handleerror } from "../api/handleError";

function DelProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("id");
      console.log(id);
      const res = await deleteProject(id);
      if (res.data?.message === "Project deleted successfully") {
        navigate("/");
      } else {
        setError("Unexpected response from server");
      }
    } catch (error) {
      handleerror(error, setError, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 ">
      <h1 className="text-2xl font-semibold text-gray-800">
        Are you sure you want to delete this project?
      </h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4">
        <Button onClick={handleDelete} disabled={loading} color="deletebutton">
          {loading ? "Deleting..." : "Yes, delete"}
        </Button>

        <Button onClick={() => navigate("/")}>Cancel</Button>
      </div>
    </div>
  );
}

export default DelProject;
