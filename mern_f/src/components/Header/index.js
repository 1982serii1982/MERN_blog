import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";

import { authSelector } from "../../redux/slices/auth";
import { logout } from "../../redux/slices/auth";

import styles from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, data } = useSelector(authSelector);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <div>ZeroGround Blog</div>
          </Link>
          <div className={styles.buttons_wrapper}>
            {isAuth ? (
              <>
                <div className={styles.account}>
                  Hello, {data ? data.fullName : ""}
                </div>
                <div className={styles.buttons}>
                  <Link to="/add-post">
                    <Button variant="contained">New Post</Button>
                  </Link>
                  <Button
                    onClick={onClickLogout}
                    variant="contained"
                    color="error"
                  >
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.account}>Account</div>
                <div className={styles.buttons}>
                  <Link to="/login">
                    <Button variant="outlined">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="contained">Create Account</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
