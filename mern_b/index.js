import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";

import { registerValidation } from "./validations/auth.js";
import { loginValidation } from "./validations/login.js";
import { postCreateValidation } from "./validations/post.js";
import { commentCreateValidation } from "./validations/comment.js";
import HWE from "./utils/handleValidationError.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";

const unlinkAsync = promisify(fs.unlink);
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Conection success");
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });

//[import.meta.url] ==> The "import.meta" meta-property exposes
//                      context-specific metadata to a JavaScript module.
//                      It contains information about the module, such as the module's URL.
//                      The full URL to the module, includes query parameters and/or hash
//                      (following the ? or #). In browsers, this is either the URL from which
//                      the script was obtained (for external scripts), or the URL of the
//                      containing document (for inline scripts). In Node.js, this is the file
//                      path (including the file:// protocol).
//                      EX: console.log(import.meta.url) --> file:///C:/xampp/htdocs/MERN_app_backend/index.js

//[fileURLToPath] ==>   This function ensures the correct decodings of percent-encoded
//                      characters as well as ensuring a cross-platform valid absolute path string.
//                      EX: fileURLToPath(import.meta.url) --> C:\xampp\htdocs\MERN_app_backend\index.js

//[path.dirname] ==>    The path.dirname() method returns the directory name of a path,
//                      similar to the Unix dirname command. Trailing directory separators are ignored.
//                      EX: path.dirname(fileURLToPath(import.meta.url)) --> C:\xampp\htdocs\MERN_app_backend

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

const whitelist = ["http://localhost:517323"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) === -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/upload", express.static(path.join(__dirname, "uploads")));
//express.static exposes a directory or a file to a particular
//URL so it's contents can be publicly accessed.
//Cind se va face in front end setarea caii catre imagine
//in atributul src alt tagului img, ea va arata ceva de genul (src="http://localhost:4444/upload/numele fisierului generat")
//pai cind pe server va veni astfel de adresa pentru servire, anume de ea se va ocupa
//acest "app.use" si pentru asta el va directiona cautarea fisierului solicitat in directoriul "uploads",
//ca si cum ar preface adresa in (src="http://localhost:4444/uploads/numele fisierului generat")

//AUTH

app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", loginValidation, HWE, UserController.login);
app.post("/auth/register", registerValidation, HWE, UserController.register);

//UPLOAD

app.post(
  "/upload",
  checkAuth,
  upload.single(
    "image"
  ) /*'image' este numele campului din forma sub care va veni imaginea */,
  (req, res) => {
    res.json({
      url: `/upload/${req.file.filename}`, //aceasta este o parte din calea catre imagine pe server
      // care va fi alipita la numele serverului ce deserveste frontendul (http://localhost:4444)
      path: req.file.path, //asta este calea propriu-zisa (pe partea serverului) unde este stocata imaginea
    });
  }
);

app.post("/delete/upload", checkAuth, async (req, res) => {
  try {
    await unlinkAsync(req.body.imagePath);
    res.json({
      message: "success",
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed to delete, file not found",
    });
  }
});

//POSTS

app.get("/posts", PostController.getAllPosts);
app.get("/posts/:id", PostController.getOnePost);
app.get("/posts/:id/edit", PostController.getOnePostEdit);
app.get("/tags", PostController.getAllTags);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  HWE,
  PostController.createPost
);
app.delete("/posts/:id", checkAuth, PostController.deletePost);
app.patch("/posts/:id", checkAuth, PostController.updatePost);

//COMMENTS

app.get("/comments/:id", CommentController.getCommentsById);
app.delete("/comments/:id", CommentController.deleteMultipleComments);
app.post(
  "/comments",
  checkAuth,
  commentCreateValidation,
  HWE,
  CommentController.createComment
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is working!!!");
});
