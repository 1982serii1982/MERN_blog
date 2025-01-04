import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, useTheme, Box } from "@mui/material";

import { logout } from "../../redux/slices/auth";
import FlexBetween from "../../styled_components/FlexBetween/FlexBetween";

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuth, data } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container
      maxWidth={false}
      fixed={true}
      disableGutters={true}
      sx={{ padding: "10px 0" }}
    >
      <FlexBetween>
        <Typography
          fontFamily="Agbalumo, serif"
          fontSize="clamp(1rem, 2.5rem, 3rem)"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: theme.palette.complementary.light,
              cursor: "pointer",
            },
            color: theme.palette.complementary.light_dark,
          }}
        >
          ZeroGround Blog
        </Typography>
        <Box sx={{ flexDirection: "column", display: "flex" }}>
          {isAuth ? (
            <>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.complementary.main}`,
                  width: "100%",
                  marginBottom: "10px",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  backgroundColor: theme.palette.complementary.light,
                  color: theme.palette.primary.dark,
                }}
              >
                Hello, {data ? data.fullName : ""}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Link to="/add-post">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.complementary.main,
                      fontWeight: "700",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main_light,
                      },
                    }}
                  >
                    New Post
                  </Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.complementary.main,
                    fontWeight: "700",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main_light,
                    },
                  }}
                >
                  Log out
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.complementary.main}`,
                  width: "100%",
                  marginBottom: "10px",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  backgroundColor: theme.palette.complementary.light,
                  color: theme.palette.primary.dark,
                }}
              >
                Account
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Link to="/login">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.complementary.main,
                      fontWeight: "700",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main_light,
                      },
                    }}
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.complementary.main,
                      fontWeight: "700",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main_light,
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </Box>
      </FlexBetween>
    </Container>
  );
};

export default Header;
