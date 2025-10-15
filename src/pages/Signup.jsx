import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-60 max-w-sm bg-white text-blue-600 rounded-md p-6 space-y-4 shadow-lg">
        <p className="font-semibold text-center text-lg">Signup</p>

        <form
          className="flex flex-col space-y-4 w-full"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="enter name"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Input>
          <Input
            type="text"
            placeholder="enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Input>
          <Input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            color="primary"
          >
            {loading ? <CircularProgress size={30} /> : "Sign up"}
          </Button>

          <Link href="/Login " className="text-center">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
