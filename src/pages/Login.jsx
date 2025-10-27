import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { Input } from "@mui/material";
import { login } from "../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import Link from "@mui/material/Link";
import LoginValidation from "../validation/LoginValidation";
import Alert from "@mui/material/Alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("");

  const navigate = useNavigate();

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await LoginValidation.validate(
        { email, password },
        { abortEarly: false }
      );
    } catch (validationError) {
      if (validationError) {
        const messages = validationError.inner
          .map((err) => err.message)
          .join(", ");
        setAlertType("error");
        setError(messages);
        handleSnackbarOpen();
        return;
      }
    }

    try {
      setLoading(true);
      const res = await login({ email, password });

      if (res.data?.token) localStorage.setItem("token", res.data.token);

      if (res.data?.message === "login success") {
        setError(res.data?.message);
        setAlertType("success");
        handleSnackbarOpen();
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(res.data?.message || "Login failed!");
        setAlertType("error");
        handleSnackbarOpen();
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong!";
      setAlertType("error");
      setError(message);
      handleSnackbarOpen();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center w-full max-w-sm rounded-md p-6">
        <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
          <p className="font-bold text-center text-xl">Log In</p>
          <p className="text-center text-xs text-gray-600">
            Login to your account
          </p>

          <p>Email</p>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-between items-center">
            <p>Password</p>
            <Link
              href="/ResetPassword"
              sx={{ color: "red", textDecoration: "none" }}
            >
              Forgot password?
            </Link>
          </div>

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" type="submit" color="orangebutton">
            {loading ? <CircularProgress size={30} /> : "Login"}
          </Button>

          <p className="text-center">Or</p>
          <Button variant="outlined">Continue with Google</Button>

          <Link href="/Signup" className="text-center">
            Don't have an account? Signup
          </Link>
        </form>
      </div>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={2000}
      >
        <Alert severity={alertType}>{error}</Alert>
      </Snackbar>
    </div>
  );
}
