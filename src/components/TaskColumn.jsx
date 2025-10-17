import React from "react";
import CardContainer from "./CardContainer";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CreateIcon from "@mui/icons-material/Create";
import DeleteTask from "./DeleteTask";
import { useState } from "react";
import EditTask from "./EditTask";
function TaskColumn({
  title,
  bgColor,
  tasks,
  moveLeft,
  moveRight,
  projectId,
  error,
}) {
  const navigate = useNavigate();
  const [DelTask, setDelTask] = useState(null);
  const [Edit, setEdit] = useState(null);

  return (
    <div className={`rounded-lg ${bgColor}`}>
      <CardContainer>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {tasks.length > 0 ? (
            <ol className="space-y-2 w-full">
              {tasks.map((task) => (
                <li key={task._id}>
                  <Card>
                    <CardContent>
                      <p>
                        <span className="font-bold">Title:</span> {task.title}
                      </p>
                      <p>
                        <span className="font-bold">Description:</span>{" "}
                        {task.description}
                      </p>
                      <p>
                        <span className="font-bold">Status:</span> {task.status}
                      </p>
                      <p>
                        <span className="font-bold">Deadline:</span>{" "}
                        {task.deadline}
                      </p>

                      <div className="flex flex-row justify-between">
                        {moveLeft && (
                          <IconButton onClick={() => moveLeft(task)}>
                            <ArrowBackIosNewIcon sx={{ color: "white" }} />
                          </IconButton>
                        )}

                        <IconButton
                          onClick={() =>
                            setEdit({ projectId, taskId: task._id })
                          }
                        >
                          <CreateIcon sx={{ color: "white" }} />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            setDelTask({ projectId, taskId: task._id })
                          }
                        >
                          <DeleteIcon sx={{ color: "white" }} />
                        </IconButton>
                        {moveRight && (
                          <IconButton onClick={() => moveRight(task)}>
                            <ArrowForwardIosIcon sx={{ color: "white" }} />
                          </IconButton>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          ) : (
            <p>No tasks here</p>
          )}

          {DelTask && (
            <DeleteTask
              open={true}
              projectId={DelTask.projectId}
              taskId={DelTask.taskId}
              onClose={() => setDelTask(null)}
            />
          )}
          {Edit && (
            <EditTask
              open={true}
              projectId={Edit.projectId}
              taskId={Edit.taskId}
              onClose={() => setEdit(null)}
            />
          )}
        </div>
      </CardContainer>
    </div>
  );
}

export default TaskColumn;
