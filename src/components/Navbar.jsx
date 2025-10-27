import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { getUser } from "../api/userApi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data);
      } catch (err) {
        console.log("Error fetching user", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <div>
      <AppBar
        position="static"
        color="header"
        className="p-2 flex  items-start"
        sx={{
          borderBottom: "2px solid #dedede",
        }}
      >
        <Button onClick={() => setIsOpen(!isOpen)}>
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <AccountCircleIcon
              sx={{ color: "primary", fontSize: "3rem" }}
            ></AccountCircleIcon>
          )}
        </Button>
      </AppBar>

      {isOpen && (
        <div className=" ml-2  bg-[#F5F5F5] shadow-md rounded-lg p-4 w-30 flex flex-col space-y-2 text-black font-semibold ">
          <Button
            onClick={() => navigate("/")}
            fullWidth
            sx={{ justifyContent: "flex-start", color: "black" }}
          >
            Home
          </Button>
          <Button
            onClick={handleLogout}
            fullWidth
            sx={{ justifyContent: "flex-start", color: "black" }}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
