import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";

import { fetchRegister } from "../../redux/slices/auth";
import { authSelector } from "../../redux/slices/auth";
import {
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import styles from "./Register.module.scss";

const Register = () => {
  const [passInput, setPassInput] = React.useState(false);

  const navigate = useNavigate();
  const { isAuth, data, error } = useSelector(authSelector);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Sergiu",
      email: "1982serii1982@gmail.com",
      password: "12345",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data, e) => {
    dispatch(fetchRegister(data));
  };

  const onError = (errors, e) => {
    console.log(errors, e);
  };

  React.useEffect(() => {
    if (isAuth && "token" in data) {
      window.localStorage.setItem("token", data.token);
    }

    if (error === 11000) {
      setError("email", {
        type: "Register",
        message: "Email is already in use",
      });
    }

    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, error]);

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create Account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextField
          required={true}
          className={styles.field}
          placeholder="Tap your name"
          label="Full Name"
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: { value: true, message: "Name missing" },
            minLength: { value: 3, message: "Name too short" },
          })}
        />
        <TextField
          required={true}
          className={styles.field}
          placeholder="Tap your email"
          label="Email"
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {
            required: { value: true, message: "Email missing" },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email format",
            },
          })}
        />
        {/* Exemplele de mai jos sint identice, numai ca unul a fost creat cu 
        componentul "TextField", iar al doilea a fost creat cu componentu "FormControl" */}
        {/* ****************************************************************************** */}
        <TextField
          variant="outlined"
          required={true}
          type={showPassword ? "text" : "password"}
          className={styles.field}
          placeholder="Tap your password"
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          {...register("password", {
            required: { value: true, message: "Password missing" },
            minLength: { value: 5, message: "Password too short" },
            onChange: (e) => {
              if (e.target.value === "") {
                setPassInput(true);
              } else {
                setPassInput(false);
              }
            },
          })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    disabled={passInput}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}

          /* Acest InputProps de mai jos a fost deprecat si nu se mai va folosi, dar ideea lui a fost de a transmite propsuri
          (de exemplu "endAdornment", care normal nu pot fi transmise prin intermediul lui <TextField/> ) catre componentul MUI 
          in care trebuie sa se transforme <TextField/> dupa rendering, in dependenta de atributul "variant"
          ---> Daca variant="outlined" din "TextField" atunci se vor transmite catre componentul "OutlinedInput"
          ---> Daca variant="filled" din "TextField" atunci se vor transmite catre componentul "FilledInput"
          ---> Daca variant="standard" din "TextField" atunci se vor transmite catre componentul "Input".
          De exemplu vrem sa punem <TextField/> cu variant="outlined", pentru ca el sa se transforme in <OutlinedInput/>
          (care la rindul lui dupa rendering se va transforma in <input/>), uitindune in caracteristicele API ale lui
          <TextField/> noi observam ca lipseste propsul "endAdornment" care ar putea fi transmis prin intermediul lui <TextField/>
          catre <OutlinedInput/> (care la rindul lui are asa tip de props). Si aici ne vine in ajutor "InputProps" prin care deja
          putem transmite acest props.
          Cam acelasi sens il are propsul "inputProps" a lui <TextField/>, dar care ne ajuta sa transmitem direct atribute (pe care normal 
          le poate avea tagul <input/> Ex: form, disabled, name. etc., dar care nu pot fi transmise prin careva propsuri ale lui <TextField/>) lui tagul <input/>
          (in care se transforma <TextField/> dupa rendering ).
          */
          /*InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  disabled={passInput}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}*/
        />
        {/* *************************************************************************** */}
        {/* <FormControl
          required={true}
          variant="outlined"
          className={styles.field}
          error={Boolean(errors.password?.message)}
          fullWidth
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            placeholder="Tap your password"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: { value: true, message: "Password missing" },
              minLength: { value: 5, message: "Password too short" },
            })}
            endAdornment={
              <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password" //Este folosit pentru a tine locul (layout-ul)
            //pentru labelul adevarat care este controlat de catre "InputLabel".
            //Trebuie sa fie acelasi string(cuvint) ca si cel folosit in
            //"InputLabel" (cazul nostru este "Password"). Daca de exemplu vom folosi
            //in acest label un alt cuvint care ca lungime (e mai mic) nu corespunde
            //cu cel din "InputLabel" atunci locul rezervat va fi mai mic si se va primi
            //o suprapunere a chenarului "input" peste label.
          />
          <FormHelperText>{errors.password?.message}</FormHelperText>
        </FormControl> */}
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
