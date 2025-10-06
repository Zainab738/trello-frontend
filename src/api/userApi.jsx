import axios from "axios";

const userApi = axios.create({ baseURL: "http://localhost:3000/users" });

//signup
export const signup = (data) => {
  return userApi.post("/signup", data);
};
//login
export const login = (data) => {
  return userApi.post("/login", data);
};
