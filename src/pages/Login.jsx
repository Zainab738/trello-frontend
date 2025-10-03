import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center w-60 bg-[#164B35] text-white rounded-sm p-5 space-y-2">
          <p>Login</p>
          <input
            type="text"
            placeholder="email"
            className="bg-gray-900 p-1 rounded-sm"
          ></input>
          <input
            type="password"
            placeholder="password"
            className="bg-gray-900 p-1 rounded-sm"
          ></input>
          <div className="text-sm text-white underline">
            <p
              onClick={() => {
                navigate("/Signup");
              }}
            >
              Dont have an account? signup
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
