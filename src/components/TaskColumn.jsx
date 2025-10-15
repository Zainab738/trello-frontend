import React from "react";
import CardContainer from "./CardContainer";
import { Trash2, Pencil, ArrowBigRight, ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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
                          <button onClick={() => moveLeft(task)}>
                            <ArrowBigLeft size={18} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            navigate(`/edittask/${projectId}/${task._id}`)
                          }
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/DelTask/${projectId}/${task._id}`)
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                        {moveRight && (
                          <button onClick={() => moveRight(task)}>
                            <ArrowBigRight size={18} />
                          </button>
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
        </div>
      </CardContainer>
    </div>
  );
}

export default TaskColumn;
