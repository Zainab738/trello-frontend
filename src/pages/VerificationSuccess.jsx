import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verification } from "../api/verificationApi";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function VerificationSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await verification(token);
        if (res.data?.message === "Verified") {
          setMessage("Verification Successful!");
          console.log("User successfully verified!");
        }
      } catch (err) {
        console.error("Verification failed:", err.response?.data || err);
        setMessage(err.response?.data?.message || "Token expired or invalid.");
      }
    };

    if (token) verifyUser();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col justify-center items-center rounded-md p-6 space-y-4 ">
        <p className="font-bold text-center text-xl ">{message}</p>
        {message == "Verification Successful!" && (
          <Button
            variant="contained"
            color="orangebutton"
            onClick={() => {
              navigate("/Login ");
            }}
          >
            <p className="text-white text-xs"> Back to login</p>
          </Button>
        )}
      </div>
    </div>
  );
}

export default VerificationSuccess;
