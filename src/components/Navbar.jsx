import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { getUser } from "../api/userApi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleClose();
    navigate("/Login");
  };

  const handleHome = () => {
    handleClose();
    navigate("/");
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <AppBar
        position="static"
        color="header"
        className="p-2"
        sx={{
          borderBottom: "2px solid #dedede",
        }}
      >
        <div className="flex justify-between items-center w-full px-2">
          <h1 className="text-2xl font-bold" style={{ color: "#E94E1A" }}>
            Mini Trello
          </h1>
          <Button onClick={handleClick}>
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <AccountCircleIcon
                sx={{ color: "orangebutton.main", fontSize: "3rem" }}
              ></AccountCircleIcon>
            )}
          </Button>
        </div>
      </AppBar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="bg-[#F5F5F5] w-40 flex flex-col">
          <Button
            onClick={handleHome}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "black",
              fontWeight: 500,
              py: 1.5,
              px: 3,
            }}
          >
            Home
          </Button>
          <Button
            onClick={handleLogout}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "black",
              fontWeight: 500,
              py: 1.5,
              px: 3,
            }}
          >
            Logout
          </Button>
        </div>
      </Popover>
    </div>
  );
}

export default Navbar;
