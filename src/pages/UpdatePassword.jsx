import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import ResetPasswordSuccess from "./PasswordResetSuccess";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center  max-w-sm  rounded-md p-6 gap-3 ">
        <p className="font-bold text-center text-xl ">Update password?</p>
        <p className=" text-center text-xs text-gray-600 ">
          Secure your account by setting a new password. Make sure it's strong
          and easy for you to remember.
        </p>

        <form className="flex flex-col  w-full gap-3">
          <p>Password</p>
          <Input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
          <p>Confirm Password</p>
          <Input
            type="password"
            placeholder="confirm password"
            value={confirmpassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
          ></Input>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            color="orangebutton"
            onClick={() => {
              navigate("/PasswordResetSuccess");
            }}
          >
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <p className="text-white text-xs">Update Password</p>
            )}
          </Button>
          <Link
            href="/Login "
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
