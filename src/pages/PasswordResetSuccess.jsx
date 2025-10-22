import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import celebration from "../assets/celebration.png";
function ResetPasswordSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center rounded-md p-6 space-y-4 ">
        <img src={celebration} className="w-20 h-20"></img>
        <p className="font-bold text-center text-xl ">
          Your password has been reset successfully
        </p>
        <p className=" text-center text-xs text-gray-600">
          Your new password is set! You're all set to log back in and continue
          securely.
        </p>
        <Button
          variant="contained"
          color="orangebutton"
          onClick={() => {
            navigate("/Login ");
          }}
        >
          <p className="text-white text-xs"> Back to login</p>
        </Button>
      </div>
    </div>
  );
}

export default ResetPasswordSuccess;
