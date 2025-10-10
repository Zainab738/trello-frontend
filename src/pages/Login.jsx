import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/userApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.data?.token);
      localStorage.setItem("token", res.data.token);
      if (res.data?.message === "auth success") {
        navigate("/");
      } else {
        setError(res.data?.message || "login failed!");
      }
    } catch (error) {
      if (!error.response) {
        setError("Network error: " + error.message);
        return;
      }

      const { status, data } = error.response;

      let message = "Something went wrong!";
      if (status === 500) {
        message = data?.error?.errorResponse?.errmsg || "Server error";
      } else if (status === 400) {
        if (Array.isArray(data?.error?.errors)) {
          message = data.error.errors.join(" , ");
        } else if (status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
        } else {
          message =
            data?.message || data?.error?.message || "Validation failed";
        }
      } else {
        message = data?.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center w-60 bg-[#164B35] text-white rounded-sm p-5 space-y-2">
          <form className="space-y-2" onSubmit={handleSubmit}>
            <p>Login</p>
            <input
              type="text"
              placeholder="email"
              className="bg-gray-900 p-1 rounded-sm"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
            <input
              type="password"
              placeholder="password"
              className="bg-gray-900 p-1 rounded-sm"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <div className="text-sm text-white underline">
              {error && <div className="text-sm text-red-500">{error}</div>}
              <button type="submit">
                {" "}
                {loading ? "Loging in..." : "Login"}
              </button>
              <p
                onClick={() => {
                  navigate("/Signup");
                }}
              >
                Dont have an account? signup
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
