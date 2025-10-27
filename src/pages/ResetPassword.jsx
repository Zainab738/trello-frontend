import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "react-router-dom";
import { sendResetPasswordEmail } from "../api/userApi";
function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    try {
      const res = await sendResetPasswordEmail(email);
      if (res.data.message == "Reset email sent successfully")
        console.log(res.data.message);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err.response?.data?.message || err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center w-80 max-w-sm  rounded-md p-6 gap-3 ">
        <p className="font-bold text-center text-xl ">Reset your password?</p>
        <p className=" text-justify text-xs text-gray-600 ">
          Enter the email that you used when you signed up to recover your
          password. You will receive a password reset link.
        </p>

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
          color="orangebutton"
          onClick={() => {
            handleSendEmail();
          }}
          fullWidth
        >
          <p className="text-white text-sm">Send Link</p>
        </Button>
        <p>{message}</p>
        <Link
          href="/Login "
          sx={{ color: "black", textDecoration: "none" }}
          className="text-center"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
