import React, { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import TaskColumn from "../components/TaskColumn";
import { Pencil, Trash2, ArrowBigLeft, ArrowBigRight } from "lucide-react";

export default function Task() {
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
        const res = await getTasks(projectId);
        if (res.data?.message === "task fetched successfully") {
          setTasks(res.data.task || []);
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
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
    <div className="flex flex-col justify-center items-center">
      <button
        className="text-white mt-2"
        onClick={() => {
          navigate(`/CreateNewTask/${projectId}`);
        }}
      >
        Create new task
      </button>
      <div className="mt-10 flex flex-col space-y-2 items-center lg:flex-row md:space-x-5 lg:items-start justify-center">
        {/* No.1 */}
        <TaskColumn
          title="Tasks"
          bgColor="bg-[#164B35]"
          tasks={tasks}
          moveRight={(task) => {
            setInprogress([...inprogress, task]);
            // setTasks(tasks.filter((t) => t._id !== task._id));
          }}
          projectId={projectId}
          error={error}
        />

        {/* No.2 */}
        <TaskColumn
          title="In Progress"
          bgColor="bg-[#101204]"
          tasks={inprogress}
          moveLeft={(task) => {
            setInprogress(inprogress.filter((t) => t._id !== task._id));
            // setTasks([...tasks, task]);
          }}
          moveRight={(task) => {
            setInreview([...inreview, task]);
            setInprogress(inprogress.filter((t) => t._id !== task._id));
          }}
          projectId={projectId}
          error={error}
        />
        {/* No.3 */}
        <TaskColumn
          title="In Review"
          bgColor="bg-[#533F04]"
          tasks={inreview}
          moveLeft={(task) => {
            setInreview(inreview.filter((t) => t._id !== task._id));
            setInprogress([...inprogress, task]);
          }}
          moveRight={(task) => {
            setDone([...done, task]);
            setInreview(inreview.filter((t) => t._id !== task._id));
          }}
          projectId={projectId}
          error={error}
        />
        {/* No.4 */}
        <TaskColumn
          title="Done"
          bgColor="bg-[#164B35]"
          tasks={done}
          moveLeft={(task) => {
            setDone(done.filter((t) => t._id !== task._id));
            setInreview([...inreview, task]);
          }}
          moveRight={null}
          projectId={projectId}
          error={error}
        />
      </div>
    </div>
  );
}
