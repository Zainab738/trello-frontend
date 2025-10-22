import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

function VerifyPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center w-full max-w-sm  rounded-md p-6 gap-3 ">
        <p className="font-bold text-center text-xl ">Reset your password?</p>
        <p className=" text-justify text-xs text-gray-600 ">
          Enter the email that you used when you signed up to recover your
          password. You will receive a password reset link.
        </p>

        <form className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            placeholder="enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Input>

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            color="orangebutton"
          >
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <p className="text-white text-xs">Send Link</p>
            )}
          </Button>

          <Link
            href="/Login "
            sx={{ color: "black", textDecoration: "none" }}
            className="text-center"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default VerifyPassword;
