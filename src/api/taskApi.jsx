import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const { response } = error;

    if (!response) {
      message = error.message || "network error";
      return Promise.reject({ message });
    }

    const { status, data } = response;

    if (status === 500) {
      message = data?.error?.errorResponse?.errmsg || "Server error";
    } else if (status === 401) {
      localStorage.removeItem("token");

      return;
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
export const getTasks = (projectId) => {
  return taskApi.get(`/get/${projectId}`);
};

//create
export const createTask = (data) => {
  return taskApi.post("/create", data);
};
//delete
export const deleteTasks = (id) => {
  return taskApi.delete(`/delete/${id}`);
};
//update
export const updateTasks = (id, data) => {
  return taskApi.patch(`/update/${id}`, data);
};
