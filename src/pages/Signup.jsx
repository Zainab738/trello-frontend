import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState({ email: "" });
  const [username, setUsername] = useState({ setUsername: "" });
  const [password, setPassword] = useState({ setPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({ email, password, username });
      alert("succesful");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center w-60 bg-[#164B35] text-white rounded-sm p-5 space-y-2">
        <p>Signup</p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="enter name"
            className="bg-gray-900 p-1 rounded-sm"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            type="text"
            placeholder="enter email"
            className="bg-gray-900 p-1 rounded-sm"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="enter password"
            className="bg-gray-900 p-1 rounded-sm"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">submit</button>
          <div className="text-sm text-white underline">
            <p
              onClick={() => {
                navigate("/Login");
              }}
            >
              Already have an account? Login
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
