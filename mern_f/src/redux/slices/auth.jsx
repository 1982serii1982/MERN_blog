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
  mode: "light",
};

/* Cum functioneaza Redux store ==> https://www.digitalocean.com/community/tutorials/how-to-manage-state-in-react-with-redux


Acest "createSlice()" returneaza un obiect ("authSlice") ce contine state-ul initial (ce corespunde acestui slice, adica state-ul 
slice-ului "auth", ca mai apoi sa fie utilizat in fisierul store.jsx. Unde prin "configureStore" sa se creeze un state general
in care se combina state-urile din mai multe slice-uri(daca exista)). 


In cazul nostru avem 2 slice-uri "auth.jsx" si "post.jsx", care genereaza doua reduce-re finale "postReducer = postSlice.reducer" si 
"authReducer = authSlice.reducer" [care in sine este o combinatie de reducere mai mici (mai vechi se folosea acest "combineReducers()" 
acuma acest lucru este efectuat automat de "createSlice"), care in cazul nostru
se regasesc sub property-ul "reducers" si  "extraReducers"]. Totodata aceste reducere finale "postReducer" si "authReducer" mai aduc cu ele la pachet si
state-urile corspunzatoare fiecarui slice, care mai apoi, in fisierul "store.jsx", sa fie combinate prin intermediul functiei
"configureStore" (se creeze un state general):

{
  posts: state din slice-ul post.jsx, 
  auth: state din slice-ul auth.jsx,
}

si sint atribuite property-urilor "posts" si "auth", care apoi sa fie accesate mai usor (stiindule property-ul sub carea fost 
inregistrat "auth" sau "posts") in codul principal prin intermediul hook-ului "useSelector":

export const store = configureStore({
  reducer: {
    posts: postReducer, 
    auth: authReducer,
  },
});

 acest "store" apoi este propulsat catre toate componentele din aplicatie cu ajutorul
 componentei <Provider/>
  "
    Like with context, every child component will be able to access the store without any additional props. To access items in 
    your Redux store, use a Hook called useSelector from the react-redux package. The useSelector Hook takes a selector function 
    as an argument. The selector function will receive the state of your store as an argument that you will use to return the field you want.
  " 

Acest "createSlice()" genereaza action-urile, in cazul nostru unul din action pe care il avem este action-ul "logout"
ce se triggereaza in momentul cind in codul principal se face dispatch(logout()). Triggerat, acest action are "action.type" = "auth/logout" si 
"action.payload" = parametrul ce poate fi transmis prin actionul "logout" (Ex. logout(param)). Exact dupa ce sa facut acest dispatch, programul
se duce in storul nostru creat de "configureStore" si cauta in reducerele din acest store daca nu cumva este ceva ce poate sa prelucreze "action.type" = "auth/logout".
Si in final gaseste ca este asa portiune in reducer-ul final care poate prelucra acest "action.type", plus i se transmite si "action.payload" (daca este), pentru
a putea face schimbarile in state-ul general din store-ul nostru (acest "store" apoi este propulsat catre toate componentele din aplicatie cu ajutorul
 componentei <Provider/>, daca intr-adevar in state-ul general sau produs careva schimabri).
*/

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

export const { logout, test } = authSlice.actions;

export default authSlice.reducer;
