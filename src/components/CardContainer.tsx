import React from "react";
import Container from "@mui/material/Container";

interface CardContainerProps {
  children: React.ReactNode;
}

function CardContainer({ children }: CardContainerProps) {
  return <Container>{children}</Container>;
}

export default CardContainer;
