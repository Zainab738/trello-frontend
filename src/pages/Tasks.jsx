import { useEffect, useState } from "react";
import { getTasks, updateTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import { Button, IconButton } from "@mui/material";
import { handleerror } from "../api/handleError";
import CreateTask from "../components/CreateTask";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getProject } from "../api/projectApi";
import { useSortable } from "@dnd-kit/sortable";
export default function Task() {
  const { projectId } = useParams();
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [Create, setCreate] = useState(null);
  const [projectName, setProjectName] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks(projectId);
        if (
          res.data?.message === "Tasks fetched successfully" ||
          res.data?.message === "No tasks yet"
        ) {
          setTasks(res.data.task || []);
        } else {
          setError("Unexpected response from server");
        }
        const projectRes = await getProject();
        if (projectRes.data?.project) {
          const currentProject = projectRes.data.project.find(
            (p) => p._id === projectId
          );

          if (currentProject) {
            setProjectName(currentProject.title);
          } else {
            setProjectName("Unknown Project");
          }
        }
      } catch (error) {
        handleerror(error, setError, navigate);
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleMove = async (task, newStatus) => {
    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    await updateTasks(task._id, { ...task, status: newStatus });
  };

  return (
    <div className="flex flex-col   mt-2  ">
      <div className="flex flex-col md:flex-row gap-6 mb-5 items-start ml-5">
        <h1 className="text-2xl font-semibold">
          <IconButton
            variant="outlined"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          {projectName}
        </h1>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            setCreate({ projectId, setTasks });
          }}
        >
          Create new task
        </Button>
      </div>
      <div className="w-full max-w-[100vw] overflow-x-auto px-4">
        <div className="mt-10 flex space-x-5 items-start md:justify-center justify-start min-w-max mx-auto">
          <TaskColumn
            title="Tasks"
            bgColor="bg-[#FA5A7C]"
            tasks={tasks.filter((t) => {
              return t.status === "Tasks";
            })}
            moveRight={(task) => handleMove(task, "In Progress")}
            projectId={projectId}
            error={error}
            setTasks={setTasks}
          />
          <TaskColumn
            title="In Progress"
            bgColor="bg-[#FF947A]"
            tasks={tasks.filter((t) => t.status === "In Progress")}
            moveLeft={(task) => handleMove(task, "Tasks")}
            moveRight={(task) => handleMove(task, "In Review")}
            projectId={projectId}
            error={error}
            setTasks={setTasks}
          />
          <TaskColumn
            title="In Review"
            bgColor="bg-[#38D857]"
            tasks={tasks.filter((t) => t.status === "In Review")}
            moveLeft={(task) => handleMove(task, "In Progress")}
            moveRight={(task) => handleMove(task, "Done")}
            projectId={projectId}
            error={error}
            setTasks={setTasks}
          />
          <TaskColumn
            title="Done"
            bgColor="bg-[#BF83FF]"
            tasks={tasks.filter((t) => t.status === "Done")}
            moveLeft={(task) => handleMove(task, "In Review")}
            moveRight={null}
            projectId={projectId}
            error={error}
            setTasks={setTasks}
          />
        </div>
      </div>
      {Create && (
        <CreateTask
          open={true}
          projectId={Create.projectId}
          setTasks={Create.setTasks}
          onClose={() => setCreate(null)}
        />
      )}
    </div>
  );
}
