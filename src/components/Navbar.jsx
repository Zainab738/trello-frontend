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
        color="primary"
        className="p-4 flex  items-start"
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
              sx={{ color: "white", fontSize: "3rem" }}
            ></AccountCircleIcon>
          )}
        </Button>
      </AppBar>

      {isOpen && (
        <ol className="flex flex-col  space-y-4  text-md bg-[#6C6FF1] text-white p-5 font-semibold w-full items-start justify-start">
          <li>
            <Button onClick={() => navigate("/")} color="white">
              Home
            </Button>
          </li>
          <li>
            <Button onClick={handleLogout} color="white">
              Logout
            </Button>
          </li>
        </ol>
      )}
    </div>
  );
}

export default Navbar;
