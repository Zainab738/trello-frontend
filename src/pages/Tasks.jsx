import React, { useEffect } from "react";
import Card from "../components/Card";
import { getTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Trash2, Pencil, ArrowBigRight, ArrowBigLeft } from "lucide-react";

function Task() {
  const { projectId } = useParams();
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [inreview, setInreview] = useState([]);
  const [done, setDone] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedinprogress = localStorage.getItem("inprogress");
    const savedinreview = localStorage.getItem("inreview");
    const saveddone = localStorage.getItem("done");

    if (savedinprogress) setInprogress(JSON.parse(savedinprogress));
    if (savedinreview) setInreview(JSON.parse(savedinreview));
    if (saveddone) setDone(JSON.parse(saveddone));
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Project ID:", projectId);

        const res = await getTasks(projectId);
        console.log("Fetched:", res.data);

        if (res.data?.message === "task fetched successfully") {
          setTasks(res.data.task || []);
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
        console.error("Fetch error:", error);

        if (!error.response) {
          setError("Network error: " + error.message);
          return;
        }

        const { status, data } = error.response;

        if (status === 404) {
          setError(data?.message || "No tasks found for this project.");
        } else if (status === 500) {
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

  useEffect(() => {
    localStorage.setItem("inprogress", JSON.stringify(inprogress));
    localStorage.setItem("inreview", JSON.stringify(inreview));
    localStorage.setItem("done", JSON.stringify(done));
  }, [inprogress, inreview, done]);

  return (
    <div className="mt-10 flex flex-col space-y-2 items-center lg:flex-row md:space-x-5 lg:items-start justify-center">
      <div className=" bg-[#164B35] rounded-sm">
        <Card>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold">
              Tasks
              <button
                onClick={() => {
                  navigate(`/CreateNewTask/${projectId}`);
                }}
              >
                +
              </button>
            </h1>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {tasks.length > 0 ? (
              <ol className="space-y-2 ">
                {tasks.map((task, index) => (
                  <li
                    key={task._id}
                    className="border-1 border-white text-white px-5 py-2 rounded-md shadow-sm text-sm"
                  >
                    <p>
                      <span className="font-bold">Title:</span> {task.title}
                    </p>
                    <p>
                      <span className="font-bold">Description:</span>
                      {task.description}
                    </p>
                    <p>
                      <span className="font-bold">Status:</span> {task.status}
                    </p>
                    <p>
                      <span className="font-bold">Deadline:</span>
                      {task.deadline}
                    </p>
                    <div className="flex flex-row justify-between">
                      <button>
                        <ArrowBigLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/edittask/${projectId}/${task._id}`);
                        }}
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
                      <button
                        onClick={() => {
                          setInprogress([...inprogress, task]);
                          console.log(task);
                        }}
                      >
                        <ArrowBigRight size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p>Create a task</p>
            )}
          </div>
        </Card>
      </div>

      {/* NO.2 */}
      <div className=" bg-[#101204] rounded-sm">
        {inprogress.length == 0 && (
          <Card>
            <div className="flex flex-col items-center ">
              <h1 className=" text-lg">In Progress</h1>
            </div>
          </Card>
        )}

        {inprogress.length > 0 && (
          <Card>
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-lg font-semibold">In Progress</h1>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {inprogress.map((task, index) => (
                <ol>
                  <li
                    key={task._id}
                    className="border-1 border-white text-white px-5 py-2 rounded-md shadow-sm text-sm"
                  >
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
                      <button>
                        <ArrowBigLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/edittask/${projectId}/${task._id}`);
                        }}
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
                      <button
                        onClick={() => {
                          setInreview([...inreview, task]);
                          console.log(task);
                        }}
                      >
                        <ArrowBigRight size={18} />
                      </button>
                    </div>
                  </li>
                </ol>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* NO.3 */}

      <div className=" bg-[#533F04] rounded-sm">
        {inreview.length == 0 && (
          <Card>
            <div className="flex flex-col items-center ">
              <h1 className=" text-lg">In Review</h1>
            </div>
          </Card>
        )}

        {inreview.length > 0 && (
          <Card>
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-lg font-semibold">In Review</h1>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {inreview.map((task, index) => (
                <ol>
                  <li
                    key={task._id}
                    className="border-1 border-white text-white px-5 py-2 rounded-md shadow-sm text-sm"
                  >
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
                      <button>
                        <ArrowBigLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/edittask/${projectId}/${task._id}`);
                        }}
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
                      <button
                        onClick={() => {
                          setDone([...done, task]);
                          console.log(task);
                        }}
                      >
                        <ArrowBigRight size={18} />
                      </button>
                    </div>
                  </li>
                </ol>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* NO.4 */}

      <div className=" bg-[#164B35] rounded-sm">
        {done.length == 0 && (
          <Card>
            <div className="flex flex-col items-center ">
              <h1 className=" text-lg">Done</h1>
            </div>
          </Card>
        )}

        {done.length > 0 && (
          <Card>
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-lg font-semibold">Done</h1>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {done.map((task, index) => (
                <ol>
                  <li
                    key={task._id}
                    className="border-1 border-white text-white px-5 py-2 rounded-md shadow-sm text-sm"
                  >
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
                      <button>
                        <ArrowBigLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/edittask/${projectId}/${task._id}`);
                        }}
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
                      <button onClick={() => {}}>
                        <ArrowBigRight size={18} />
                      </button>
                    </div>
                  </li>
                </ol>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Task;
