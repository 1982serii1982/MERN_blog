import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Header from "../components/Header";

const MainTemplate = () => {
  return (
    <div className="wrapper">
      <Header />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </div>
  );
};

export default MainTemplate;
