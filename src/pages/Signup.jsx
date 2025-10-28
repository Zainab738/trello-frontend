import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { handleerror } from "../api/handleError";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SignupValidation from "../validation/SignupValidation";
import InputBase from "@mui/material/InputBase";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState("");

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await SignupValidation.validate(
        { email, password, username },
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
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (pic) formData.append("profilePic", pic);

      const res = await signup(formData);

      if (res.data?.message === "User created") {
        setError("User created check your email to verify");
        setAlertType("success");
        handleSnackbarOpen();
        setTimeout(() => navigate("/Login"), 1000);
      } else {
        setAlertType("error");
        setError(res.data?.message || "Signup failed!");
        handleSnackbarOpen();
      }
    } catch (error) {
      handleerror(error, setError, navigate);
      setAlertType("error");
      handleSnackbarOpen();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center max-w-sm rounded-md p-6 gap-3 w-full">
        <p className="font-bold text-center text-xl ">Create New Account</p>
        <p className=" text-justify text-xs text-gray-600">
          Create a new Account
        </p>
        <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
          <p>Full Name</p>
          <Input
            type="text"
            placeholder="enter name"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Input>
          <p>Email</p>

          <Input
            type="text"
            placeholder="enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Input>
          <p>Password</p>

          <Input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>

          <p>Profile Picture (optional)</p>
          <InputBase
            type="file"
            inputProps={{ accept: ".png, .jpg, .jpeg" }}
            onChange={(e) => setPic(e.target.files[0])}
          />

          <Button variant="contained" type="submit" color="orangebutton">
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <p className="text-white text-xs">Create New Account</p>
            )}
          </Button>
          <p className="text-center">Or</p>
          <Button variant="outlined">
            <p className="text-black text-xs">Continue with Google</p>
          </Button>
          <Link href="/Login " className="text-center">
            Already have an account? Login
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

export default Signup;
