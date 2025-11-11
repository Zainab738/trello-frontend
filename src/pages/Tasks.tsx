import { useEffect, useState } from "react";
import { getTasks, updateTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
// @ts-ignore
import TaskColumn from "../components/TaskColumn";
import { Button, IconButton } from "@mui/material";
import CreateTask from "../components/CreateTask";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getoneproject } from "../api/projectApi";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import TaskCard from "../components/TaskCard";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { Task } from "../components/type";

export default function Task() {
  const { projectId } = useParams<{ projectId: string }>();
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [Create, setCreate] = useState<{
    projectId: string;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTaskOverlay, setActiveTaskOverlay] = useState<Task | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks(projectId!);

        if (
          res.data?.message === "Tasks fetched successfully" ||
          res.data?.message === "No tasks yet"
        ) {
          setTasks(res.data.task || []);
        } else {
          setError("Unexpected response from server");
        }

        const projectRes = await getoneproject(projectId!);
        const currentProject = projectRes.data.project;
        setProjectName(
          currentProject ? currentProject.title : "Unknown Project"
        );
      } catch (err: unknown) {
        if (err instanceof Error)
          setError(err.message || "Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleMove = async (task: Task, newStatus: Task["status"]) => {
    console.log("task", task);
    console.log("new status", newStatus);

    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: newStatus } : t
    );
    console.log("updated task", updatedTasks);
    setTasks(updatedTasks);
    await updateTasks(task._id, { ...task, status: newStatus });
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTaskOverlay(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      setActiveTaskOverlay(null);
      return;
    }

    const activeTask = tasks.find((t) => t._id === active.id);
    const newStatus = over.id as "Tasks" | "In Progress" | "In Review" | "Done";

    if (activeTask && activeTask.status !== newStatus) {
      handleMove(activeTask, newStatus);
    }

    setActiveId(null);
    setActiveTaskOverlay(null);
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="flex flex-col md:flex-row gap-6 mb-5 items-start ml-5">
        <h1 className="text-2xl font-semibold">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          {projectName}
        </h1>
        <Button
          sx={{ color: "orangebutton.main" }}
          variant="outlined"
          onClick={() => {
            if (!projectId) return;
            setCreate({ projectId, setTasks });
          }}
        >
          Create new task
        </Button>
      </div>
      <div className="w-full max-w-[100vw] overflow-x-auto px-4">
        <div className="mt-10 flex space-x-5 items-start md:justify-center justify-start min-w-max mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <TaskColumn
              title="Tasks"
              bgColor="bg-[#FA5A7C]"
              tasks={tasks.filter((t) => t.status === "Tasks")}
              moveRight={(task: Task) => handleMove(task, "In Progress")}
              projectId={projectId}
              error={error}
              setTasks={setTasks}
              activeId={activeId}
            />
            <TaskColumn
              title="In Progress"
              bgColor="bg-[#FF947A]"
              tasks={tasks.filter((t) => t.status === "In Progress")}
              moveLeft={(task: Task) => handleMove(task, "Tasks")}
              moveRight={(task: Task) => handleMove(task, "In Review")}
              projectId={projectId}
              error={error}
              setTasks={setTasks}
              activeId={activeId}
            />
            <TaskColumn
              title="In Review"
              bgColor="bg-[#38D857]"
              tasks={tasks.filter((t) => t.status === "In Review")}
              moveLeft={(task: Task) => handleMove(task, "In Progress")}
              moveRight={(task: Task) => handleMove(task, "Done")}
              projectId={projectId}
              error={error}
              setTasks={setTasks}
              activeId={activeId}
            />
            <TaskColumn
              title="Done"
              bgColor="bg-[#BF83FF]"
              tasks={tasks.filter((t) => t.status === "Done")}
              moveLeft={(task: Task) => handleMove(task, "In Review")}
              moveRight={null}
              projectId={projectId}
              error={error}
              setTasks={setTasks}
              activeId={activeId}
            />
            <DragOverlay>
              {activeTaskOverlay && projectId && (
                <div style={{}}>
                  <TaskCard
                    task={activeTaskOverlay}
                    projectId={projectId}
                    setTasks={setTasks}
                    moveLeft={() => {}}
                    moveRight={() => {}}
                    color="black"
                    setEdit={() => {}}
                    setDelTask={() => {}}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
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
