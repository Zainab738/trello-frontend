import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { Input } from "@mui/material";
import { login } from "../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import Link from "@mui/material/Link";
import { handleerror } from "../api/handleError";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { open } = snackbarState;

  const handleClick = () => {
    setSnackbarState({ open: true });
  };

  const handleClose = () => {
    setSnackbarState({ open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.data?.token) localStorage.setItem("token", res.data.token);

      if (res.data?.message === "login success") {
        setMessage(res.data?.message);
        handleClick();
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(res.data?.message || "Login failed!");
        handleClick();
      }
    } catch (error) {
      if (!error.response) {
        setMessage(error.message);
        handleClick();
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
      handleClick();
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-60 max-w-sm bg-white text-blue-600 rounded-md p-6 space-y-4 shadow-lg">
        <form
          className="flex flex-col space-y-4 w-full"
          onSubmit={handleSubmit}
        >
          <p className="font-semibold text-center text-lg">Login</p>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )} */}
          <Button variant="contained" type="submit" color="primary">
            {loading ? <CircularProgress size={30} /> : "Login"}
          </Button>
          <Link href="/Signup " className="text-center">
            Dont have an account? Signup
          </Link>
        </form>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message={message}
        autoHideDuration={1000}
      />
    </div>
  );
}
