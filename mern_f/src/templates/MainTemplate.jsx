import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, useTheme } from "@mui/material";

import Header from "../components/Header/Header";

const MainTemplate = () => {
  const theme = useTheme();
  return (
    <Container maxWidth={false} disableGutters={true}>
      <Box sx={{ backgroundColor: theme.palette.primary.dark }}>
        <Header />
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.light_xlight,
          paddingTopTop: "30px",
          height: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
};

export default MainTemplate;
