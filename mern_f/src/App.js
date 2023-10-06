import React from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainTemplate from "./templates/MainTemplate";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import FullPost from "./pages/FullPost";
import AddPost from "./pages/AddPost";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { fetchAuthMe } from "./redux/slices/auth";

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
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
  );
};

export default App;
