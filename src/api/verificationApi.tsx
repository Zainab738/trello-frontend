import axios from "axios";

const verificationApi = axios.create({
  baseURL: "http://localhost:3000/users",
});

export const verification = (token: string) => {
  return verificationApi.get(`/verification-success?token=${token}`);
};
// update password
export const updatePassword = (token: string, password: string) => {
  return verificationApi.post(`/UpdatePassword?token=${token}`, { password });
};
