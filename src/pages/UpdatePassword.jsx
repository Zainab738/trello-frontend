import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verification, updatePassword } from "../api/verificationApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

function UpdatePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await verification(token);
        if (res.data?.message === "Verified") {
          setMessage("Token verified ");
          console.log("Token verification success");
        } else {
          setMessage(res.data?.message);
        }
      } catch (err) {
        console.error("Verification failed:", err.response?.data || err);
        setError(err.response?.data?.message || "Token expired or invalid.");
      }
    };

    verifyUser();
  }, [token]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmpassword) {
      setError("Please fill both password fields.");
      return;
    }

    if (password !== confirmpassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await updatePassword(token, password);
      console.log("Update response:", res.data);
      navigate("/PasswordResetSuccess");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center max-w-sm rounded-md p-6 gap-3">
        <p className="font-bold text-center text-xl">Update password?</p>

        <form
          className="flex flex-col w-full gap-3"
          onSubmit={handleUpdatePassword}
        >
          <label>Password</label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            color="orangebutton"
          >
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <p className="text-white text-xs">Update Password</p>
            )}
          </Button>
          <p className="text-red-500">{error}</p>

          <Link
            href="/Login"
            sx={{ color: "black", textDecoration: "none" }}
            className="text-center"
          >
            Back to login page
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
