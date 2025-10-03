import React from "react";

function Card({ children }) {
  return (
    <div className=" text-white p-10 rounded-sm w-50 h-100">{children}</div>
  );
}

export default Card;
