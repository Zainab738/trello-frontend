import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  project: string;
}

const taskApi = axios.create({ baseURL: "http://localhost:3000/tasks" });
//token
taskApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token);
  }
  return config;
});
//errorhandling
taskApi.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong!";
    const response = error.response;
    if (!response) {
      message = error.message || "network error";
      return Promise.reject({ message });
    }

    const { status, data } = response;

    if (status === 500) {
      message = data?.error?.errorResponse?.errmsg || "Server error";
    } else if (status === 401) {
      localStorage.removeItem("token");
      message = "session expired login again";
      return Promise.reject({ message });
    } else if (status === 400) {
      if (Array.isArray(data?.error?.errors)) {
        message = data.error.errors.join(" , ");
      } else {
        message = data?.message || data?.error?.message || "Validation failed";
      }
    } else {
      message = data?.message || message;
    }

    return Promise.reject({ message });
  }
);
//fetch
export const getTasks = (projectId: string) => {
  return taskApi.get(`/get/${projectId}`);
};

//create
export const createTask = (data: Task) => {
  return taskApi.post("/create", data);
};
//delete
export const deleteTasks = (id: string) => {
  return taskApi.delete(`/delete/${id}`);
};
//update
export const updateTasks = (id: string, data: Task) => {
  return taskApi.patch(`/update/${id}`, data);
};
