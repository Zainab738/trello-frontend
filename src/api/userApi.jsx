import axios from "axios";

const userApi = axios.create({ baseURL: "http://localhost:3000/users" });

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//signup
export const signup = (data) => {
  return userApi.post("/signup", data);
};
//login
export const login = (data) => {
  return userApi.post("/login", data);
};
//getuser
export const getUser = () => {
  return userApi.get("/getUser");
};
// send password reset email
export const sendResetPasswordEmail = (email) =>
  userApi.post("/ResetPassword", { email });
