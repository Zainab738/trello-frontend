import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CreateIcon from "@mui/icons-material/Create";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({
  task,
  moveLeft,
  moveRight,
  projectId,
  setTasks,
  setEdit,
  setDelTask,
  color = "white",
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: 1,
    pointerEvents: isDragging ? "none" : "auto",
    transition: "none",
  };

  return (
    <li className="list-none">
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card
          sx={{
            color: { color },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent>
            <p>
              <span className="font-bold">Title:</span> {task.title}
            </p>
            <p>
              <span className="font-bold">Description:</span> {task.description}
            </p>
            <p>
              <span className="font-bold">Status:</span> {task.status}
            </p>
            <p>
              <span className="font-bold">Deadline:</span> {task.deadline}
            </p>
          </CardContent>
          <div className="flex flex-row justify-between p-2">
            {moveLeft && (
              <IconButton
                sx={{ color: { color } }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => moveLeft(task)}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            <IconButton
              sx={{ color: { color } }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setEdit({ projectId, taskId: task._id, setTasks })}
            >
              <CreateIcon />
            </IconButton>
            <IconButton
              sx={{ color: { color } }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() =>
                setDelTask({ projectId, taskId: task._id, setTasks })
              }
            >
              <DeleteIcon />
            </IconButton>
            {moveRight && (
              <IconButton
                sx={{ color: { color } }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => moveRight(task)}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </div>
        </Card>
      </div>
    </li>
  );
}
