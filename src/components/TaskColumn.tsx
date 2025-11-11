import React, { useState } from "react";
import CardContainer from "./CardContainer";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import DeleteTask from "./DeleteTask";
import EditTask from "./EditTask";
import type { Task } from "../components/type";

interface TaskColumnProps {
  title: string;
  bgColor: string;
  tasks: Task[];
  moveLeft?: (task: Task) => void;
  moveRight?: (task: Task) => void;
  projectId: string;
  error?: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeId?: string | null;
}

interface DelTaskType {
  projectId: string;
  taskId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface EditTaskType {
  projectId: string;
  taskId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskColumn({
  title,
  bgColor,
  tasks,
  moveLeft,
  moveRight,
  projectId,
  error,
  setTasks,
  activeId,
}: TaskColumnProps) {
  const [DelTask, setDelTask] = useState<DelTaskType | null>(null);
  const [Edit, setEdit] = useState<EditTaskType | null>(null);

  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: title });

  return (
    <div className={`rounded-lg ${bgColor}`}>
      <CardContainer>
        <div
          ref={setDroppableNodeRef}
          className="flex flex-col items-center space-y-2"
        >
          <h1 className="text-lg font-semibold">{title}</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {tasks.length > 0 ? (
            <div className="space-y-2 w-full list-none">
              {tasks
                .filter((t) => t._id !== activeId)
                .map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    moveLeft={moveLeft ?? (() => {})}
                    moveRight={moveRight ?? (() => {})}
                    projectId={projectId}
                    setTasks={setTasks}
                    setEdit={setEdit}
                    setDelTask={setDelTask}
                  />
                ))}
            </div>
          ) : (
            <p className="w-full text-center py-6">No tasks here</p>
          )}
          {DelTask && (
            <DeleteTask
              open
              projectId={DelTask.projectId}
              taskId={DelTask.taskId}
              setTasks={DelTask.setTasks}
              onClose={() => setDelTask(null)}
            />
          )}
          {Edit && (
            <EditTask
              open
              projectId={Edit.projectId}
              taskId={Edit.taskId}
              setTasks={Edit.setTasks}
              onClose={() => setEdit(null)}
            />
          )}
        </div>
      </CardContainer>
    </div>
  );
}
