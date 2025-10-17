import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      {/* desktop */}
      <AppBar color="primary">
        <ol className="hidden md:flex flex-row space-x-6 text-md  text-white p-5 font-semibold w-full">
          <li className="font-bold">
            <Button color="white">Navbar</Button>
          </li>
          <li>
            <Button
              color="white"
              onClick={() => {
                navigate("/");
              }}
            >
              {" "}
              Home
            </Button>
          </li>

          <li>
            <Button
              color="white"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </li>
        </ol>
      </AppBar>
      {/* mobile */}

      <div className="md:hidden text-md bg-[#6C6FF1] text-white p-5 font-semibold">
        <Button
          color="white"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Navbar
        </Button>
      </div>

      {isOpen && (
        <ol className="flex flex-col space-y-6 text-md bg-[#6C6FF1] text-white p-5 font-semibold  md:hidden w-full">
          <li
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li
            onClick={() => {
              navigate("/Login");
            }}
          >
            Login
          </li>
          <li
            onClick={() => {
              navigate("/Signup");
            }}
          >
            Signup
          </li>
          <li
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </li>
        </ol>
      )}
    </div>
  );
}

export default Navbar;
