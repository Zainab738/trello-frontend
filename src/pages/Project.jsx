import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProject } from "../api/projectApi";
import Button from "@mui/material/Button";
import { IconButton, Tab } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditProject from "../components/EditProject";
import CreateIcon from "@mui/icons-material/Create";
import DeleteProject from "../components/DeleteProject";
import CreateProject from "../components/CreateProject";

function Project() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [project, setProject] = useState([]);
  const [DelProject, setDelProject] = useState(null);
  const [Edit, setEdit] = useState(null);
  const [Create, setCreate] = useState(null);

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
      } catch (err) {
        setError(err.message || "Failed to fetch project");
      }
    };

    fetchProjects();
  }, []);

  return (
    <TableContainer className=" mt-2 ">
      <div className="m-5">
        <div className="flex flex-row gap-6 mb-5">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Button
            variant="outlined"
            onClick={() => {
              setCreate({ project, setProject });
            }}
            color="orangebutton"
          >
            Create new Project
          </Button>
        </div>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="bg-[#F5F5F5]">
              <TableCell>Projects</TableCell>
              <TableCell>Content</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                      color="orangebutton"
                    >
                      {proj.title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <p>{proj.content}</p>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        setDelProject({ projectId: proj._id, setProject })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setEdit({ projectId: proj._id, setProject })
                      }
                    >
                      <CreateIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p className="text-sm text-gray-500">No projects found</p>
            )}
          </TableBody>
        </Table>
        {Edit && (
          <EditProject
            open={true}
            projectId={Edit.projectId}
            onClose={() => setEdit(null)}
            setProject={Edit.setProject}
          />
        )}
        {DelProject && (
          <DeleteProject
            open={true}
            projectId={DelProject.projectId}
            onClose={() => setDelProject(null)}
            setProject={DelProject.setProject}
          />
        )}
      </div>
      {Create && (
        <CreateProject
          open={true}
          project={Create.project}
          onClose={() => setCreate(null)}
          setProject={Create.setProject}
        />
      )}
    </TableContainer>
  );
}

export default Project;
