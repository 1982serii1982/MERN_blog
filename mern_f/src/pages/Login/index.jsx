import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";

import { fetchAuth } from "../../redux/slices/auth";
import { authSelector } from "../../redux/slices/auth";
import { Typography, Paper, TextField, Button } from "@mui/material";

import styles from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const { isAuth, data, error } = useSelector(authSelector);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "1982serii1982@gmail.com",
      password: "12345",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data, e) => {
    dispatch(fetchAuth(data));
  };

  const onError = (errors, e) => {
    console.log(errors, e);
  };

  React.useEffect(() => {
    if (isAuth && "token" in data) {
      window.localStorage.setItem("token", data.token);
    }

    if (error === "authLoginFailed") {
      setError("email", {
        type: "Login",
        message: "Login or pasword is wrong",
      });
      setError("password", {
        type: "Login",
        message: "Login or pasword is wrong",
      });
    }

    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, error]);

  // if (isAuth) {
  //   return <Navigate to="/" />;
  // }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Log in to account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextField
          className={styles.field}
          placeholder="Tap your email"
          label="Email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          {...register("email", {
            required: { value: true, message: "Email missing" },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email format",
            },
          })}
        />
        <TextField
          className={styles.field}
          placeholder="Tap your password"
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          {...register("password", {
            required: { value: true, message: "Password missing" },
            minLength: { value: 5, message: "Password too short" },
          })}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Log in
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
