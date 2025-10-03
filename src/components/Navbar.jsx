import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      {/* desktop */}
      <nav>
        <ol className="hidden md:flex flex-row space-x-6 text-md bg-[#803FA5] text-white p-5 font-semibold">
          <li className="font-bold">Navbar</li>
          <li
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li>Projects</li>
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
        </ol>
      </nav>
      {/* mobile */}

      <div className="md:hidden text-md bg-[#164B35] text-white p-5 font-semibold">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Navbar
        </button>
      </div>

      {isOpen && (
        <ol className="flex flex-col space-y-6 text-md bg-[#164B35] text-white p-5 font-semibold  md:hidden">
          <li>Home</li>
          <li>Projects</li>
          <li>Login</li>
          <li>Signup</li>
        </ol>
      )}
    </div>
  );
}

export default Navbar;
