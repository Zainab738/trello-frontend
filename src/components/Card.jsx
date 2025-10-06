import React from "react";
import { getTasks } from "../api/taskApi";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Trash2, Pencil, ArrowBigRight, ArrowBigLeft } from "lucide-react";

function Card({ children }) {
  return (
    <div className="text-white p-10 rounded-sm w-64 shadow-lg">{children}</div>
  );
}

export default Card;
