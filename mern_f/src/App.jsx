import { useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import MainTemplate from "./templates/MainTemplate";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import FullPost from "./pages/FullPost";
import AddPost from "./pages/AddPost";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { fetchAuthMe } from "./redux/slices/auth";
import { themeSettings } from "./themes/theme";

const App = () => {
  const { mode } = useSelector((state) => state.auth);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            <Route path="/" element={<MainTemplate />}>
              <Route path="" element={<Home />} />
              <Route path="tags/:name" element={<Home />} />
              <Route path="posts/:id" element={<FullPost />} />
              <Route path="posts/:id/edit" element={<AddPost />} />
              <Route path="add-post" element={<AddPost />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
