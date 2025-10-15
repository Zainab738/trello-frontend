import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import { Button } from "@mui/material";

export default function Task() {
  const { projectId } = useParams();
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [inreview, setInreview] = useState([]);
  const [done, setDone] = useState([]);
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
        if (!error.response) {
          setError("Network error: " + error.message);
          return;
        }
        const { status, data } = error.response;
        if (status === 500) {
          setError(data?.message || "Server error. Please try again later.");
        } else if (status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
        } else {
          setError("Something went wrong.");
        }
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleMoveRight = async (task, from, to, setFrom, setTo, newStatus) => {
    setTo([...to, { ...task, status: newStatus }]);
    setFrom(from.filter((t) => t._id !== task._id));
    await updateTaskStatus(task._id, newStatus);
  };

  const handleMoveLeft = async (task, from, to, setFrom, setTo, newStatus) => {
    setTo([...to, { ...task, status: newStatus }]);
    setFrom(from.filter((t) => t._id !== task._id));
    await updateTaskStatus(task._id, newStatus);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          navigate(`/CreateNewTask/${projectId}`);
        }}
      >
        Create new task
      </Button>
      <div className="mt-10 flex flex-col space-y-2 items-center lg:flex-row md:space-x-5 lg:items-start justify-center">
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
            handleMoveRight(task, inreview, done, setInreview, setDone, "Done")
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
  );
}
