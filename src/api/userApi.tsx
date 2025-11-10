import axios from "axios";
export const getUploadUrl = () => userApi.get("/generate-upload-url");
export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
}
export const uploadImageToS3 = async (file: File) => {
  const { data } = await getUploadUrl();
  const uploadUrl = data.uploadURL;

  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return uploadUrl.split("?")[0];
};
const userApi = axios.create({
  baseURL: "http://localhost:3000/users",
});

//token
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//error
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong!";
    const { response } = error;

    if (!response) {
      message = "Network error: " + error.message;
      return Promise.reject({ message });
    }

    const { status, data } = response;

    if (status === 500) {
      message = data?.error?.errorResponse?.errmsg || "Server error";
    } else if (status === 401) {
      message = data?.message;
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

// signup
export const signup = (data: User) => userApi.post("/signup", data);

// login
export const login = (data: User) => userApi.post("/login", data);

// get user
export const getUser = () => userApi.get("/getUser");

// send password reset email
export const sendResetPasswordEmail = (email: string) =>
  userApi.post("/ResetPassword", { email });

export default userApi;
