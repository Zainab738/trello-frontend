import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { handleerror } from "../api/handleError";
import Snackbar from "@mui/material/Snackbar";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
  });
  const [message, setMessage] = useState("");

  const { open } = snackbarState;

  const handleClick = () => {
    setSnackbarState({ open: true });
  };

  const handleClose = () => {
    setSnackbarState({ open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await signup({ email, password, username });

      if (res.data?.message === "User created") {
        setError(res.data?.message);
        handleClick();
        setTimeout(() => navigate("/Login"), 2000);
      } else {
        setError(res.data?.message || "Signup failed!");
      }
    } catch (error) {
      handleerror(error, setError, navigate);
      handleClick();
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message={error}
        autoHideDuration={1000}
      />
    </div>
  );
}

export default Signup;
