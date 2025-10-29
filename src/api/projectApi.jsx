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
//errorhandling
projectApi.interceptors.response.use(
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
//update
export const updateProject = (id, data) => {
  return projectApi.patch(`/update/${id}`, data);
};
