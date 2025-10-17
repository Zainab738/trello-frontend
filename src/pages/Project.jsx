import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProject } from "../api/projectApi";
import Button from "@mui/material/Button";
import { IconButton, Tab } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleerror } from "../api/handleError";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function Project() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [project, setProject] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProject();
        console.log("Fetched:", res.data);

        if (
          res.data?.message === "Project fetched successfully" ||
          res.data?.message === "no projects yet "
        ) {
          setProject(res.data.project || []);
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
        handleerror(error, setError, navigate);
      }
    };

    fetchProjects();
  }, []);

  return (
    <TableContainer className="mt-2 md:mt-20">
      <Table>
        <div className="flex flex-col items-start space-y-2">
          <h1 className="text-lg font-bold">Projects</h1>

          <Button
            variant="contained"
            onClick={() => navigate("/createnewproject")}
            color="primary"
          >
            Create new Project
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {project.length > 0 ? (
          project.map((proj) => (
            <TableRow
              key={proj._id}
              className="flex items-center justify-start text-black "
            >
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/Tasks/${proj._id}`)}
                  color="primary"
                >
                  {proj.title}
                </Button>
                <IconButton
                  onClick={() => navigate(`/deleteProject/${proj._id}`)}
                >
                  <DeleteIcon />
                </IconButton>{" "}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <p className="text-sm text-gray-500">No projects found</p>
        )}
      </Table>
    </TableContainer>
  );
}

export default Project;
