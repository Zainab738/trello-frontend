import axios from "axios";

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
//updatestatuss
export const updateTaskStatus = (id, status) => {
  return taskApi.patch(`/update-status/${id}`, { status });
};
