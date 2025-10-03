import axios from "axios";

const userApi = axios.create({ baseURL: "http://localhost:3000/users" });

//signup
export const signup = (data) => {
  userApi.post("/signup", data);
};
