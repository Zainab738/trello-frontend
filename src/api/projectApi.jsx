import axios from "axios";

const projectApi = axios.create({ baseURL: "http://localhost:3000/projects" });
//token
projectApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token);
  }
  return config;
});
//fetch
export const getProject = () => {
  return projectApi.get("/getprojects");
};
//create
export const createProject = (data) => {
  return projectApi.post("/create", data);
};
//delete
export const deleteProject = (id) => {
  return projectApi.delete(`/deleteprojects/${id}`);
};
