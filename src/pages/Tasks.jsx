import { useEffect, useState } from "react";
import { getTasks, updateTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import { Button } from "@mui/material";
import { handleerror } from "../api/handleError";
import CreateTask from "../components/CreateTask";

export default function Task() {
  const { projectId } = useParams();
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [inreview, setInreview] = useState([]);
  const [done, setDone] = useState([]);
  const [Create, setCreate] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks(projectId);
        if (
          res.data?.message === "Tasks fetched successfully" ||
          res.data?.message === "No tasks yet"
        ) {
          const allTasks = res.data.task || [];
          setTasks(allTasks.filter((t) => t.status === "Tasks"));
          setInprogress(allTasks.filter((t) => t.status === "In Progress"));
          setInreview(allTasks.filter((t) => t.status === "In Review"));
          setDone(allTasks.filter((t) => t.status === "Done"));
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
        handleerror(error, setError, navigate);
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleMoveRight = async (task, from, to, setFrom, setTo, newStatus) => {
    setTo([...to, { ...task, status: newStatus }]);
    setFrom(from.filter((t) => t._id !== task._id));
    await updateTasks(task._id, { ...task, status: newStatus });
  };

  const handleMoveLeft = async (task, from, to, setFrom, setTo, newStatus) => {
    setTo([...to, { ...task, status: newStatus }]);
    setFrom(from.filter((t) => t._id !== task._id));
    await updateTasks(task._id, { ...task, status: newStatus });
  };

  return (
    <div className="flex flex-col justify-center items-center  mt-5 md:mt-25 ">
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          setCreate({ projectId });
        }}
      >
        Create new task
      </Button>
      <div className="w-full max-w-[100vw] overflow-x-auto px-4">
        <div className="mt-10 flex flex-row space-x-5 items-start md:justify-center justify-start min-w-max mx-auto">
          <TaskColumn
            title="Tasks"
            bgColor="bg-[#FA5A7C]"
            tasks={tasks}
            moveRight={(task) =>
              handleMoveRight(
                task,
                tasks,
                inprogress,
                setTasks,
                setInprogress,
                "In Progress"
              )
            }
            projectId={projectId}
            error={error}
          />
          <TaskColumn
            title="In Progress"
            bgColor="bg-[#FF947A]"
            tasks={inprogress}
            moveLeft={(task) =>
              handleMoveLeft(
                task,
                inprogress,
                tasks,
                setInprogress,
                setTasks,
                "Tasks"
              )
            }
            moveRight={(task) =>
              handleMoveRight(
                task,
                inprogress,
                inreview,
                setInprogress,
                setInreview,
                "In Review"
              )
            }
            projectId={projectId}
            error={error}
          />
          <TaskColumn
            title="In Review"
            bgColor="bg-[#38D857]"
            tasks={inreview}
            moveLeft={(task) =>
              handleMoveLeft(
                task,
                inreview,
                inprogress,
                setInreview,
                setInprogress,
                "In Progress"
              )
            }
            moveRight={(task) =>
              handleMoveRight(
                task,
                inreview,
                done,
                setInreview,
                setDone,
                "Done"
              )
            }
            projectId={projectId}
            error={error}
          />
          <TaskColumn
            title="Done"
            bgColor="bg-[#BF83FF]"
            tasks={done}
            moveLeft={(task) =>
              handleMoveLeft(
                task,
                done,
                inreview,
                setDone,
                setInreview,
                "In Review"
              )
            }
            moveRight={null}
            projectId={projectId}
            error={error}
          />
        </div>
      </div>
      {Create && (
        <CreateTask
          open={true}
          projectId={Create.projectId}
          onClose={() => setCreate(null)}
        />
      )}
    </div>
  );
}
