import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data); //Acest 'error.response.data' va fi plasat in action.payload ce corespunde reducerului 'fetchAuth.rejected'
    }
  }
);

export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/login", params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.err); //Acest 'error.response.data' va fi plasat in action.payload ce corespunde reducerului 'fetchAuth.rejected'
    }
  }
);

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/auth/me");
      return data;
    } catch (error) {
      if (error.response.status === 401) {
        window.localStorage.removeItem("token");
      }
      return rejectWithValue(error.response.data); //Acest 'error.response.data' va fi plasat in action.payload ce corespunde reducerului 'fetchAuthMe.rejected'
    }
  }
);

//{rejectWithValue} -- Trebuie sa spunem ca daca dorim sa utilizam "rejectWithValue"
//noi trebuie sa folosim constructia "try .. catch".
//In cazul in care nu folosim acest parametru, atunci nu avem acces la descrierea erorii
//pe care am facuto in backend (Ex: res.status(400).json(errors.array())). La aparitia
//erorii generata de backend  se va executa reducerul
// fetchAuth.rejected, si in action.payload nu se va afla nimic (undefined), in schimb
//in action.error vom avea ceva informatie despre eroare, numai ca ea va fi una
//superficiala si nedetalizata

const initialState = {
  isAuth: Boolean(window.localStorage.getItem("token")),
  data: null,
  status: "Loading",
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.data = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state, action) => {
      state.data = null;
      state.status = "Loading";
      state.error = null;
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isAuth = true;
      state.status = "Loaded";
      state.error = null;
    });
    builder.addCase(fetchAuth.rejected, (state, action) => {
      state.data = null;
      state.status = "Error";
      state.error = action.payload;
    });
    builder.addCase(fetchAuthMe.pending, (state, action) => {
      state.data = null;
      state.status = "Loading";
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isAuth = true;
      state.status = "Loaded";
    });
    builder.addCase(fetchAuthMe.rejected, (state, action) => {
      state.data = null;
      state.isAuth = false;
      state.status = "Error";
    });
    builder.addCase(fetchRegister.pending, (state, action) => {
      state.data = null;
      state.status = "Loading";
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isAuth = true;
      state.status = "Loaded";
      state.error = null;
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.data = null;
      state.isAuth = false;
      state.status = "Error";
      state.error = action.payload.err.code;
    });
  },
});

export const authSelector = (state) => state.auth;

export const { logout } = authSlice.actions;

export default authSlice.reducer;
