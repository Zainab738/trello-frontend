import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      const res = await signup({ email, password, username });

      if (res.data?.message === "User created") {
        navigate("/Login");
      } else {
        setError(res.data?.message || "Signup failed!");
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
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
          {error && <div className="text-sm text-red-500">{error}</div>}
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
