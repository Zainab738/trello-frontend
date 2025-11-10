import axios from "axios";
export interface Project {
  _id: string;
  title: string;
  content: string;
}
interface CreateProjectResponse {
  message: string;
  project: Project;
}

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
export const getProject = () => {
  return projectApi.get("/getprojects");
};

// Create project
export const createProject = (data: { title: string; content: string }) => {
  return projectApi.post<CreateProjectResponse>("/create", data);
};

// Delete project
export const deleteProject = (id: string) => {
  return projectApi.delete<{ message: string }>(`/deleteprojects/${id}`);
};

// Update project
export const updateProject = (
  id: string,
  data: { title: string; content: string }
) => {
  return projectApi.patch<{ message: string }>(`/update/${id}`, data);
};

// Get one project
export const getoneproject = (id: string) => {
  return projectApi.get<{ project: Project }>(`/getoneproject/${id}`);
};
