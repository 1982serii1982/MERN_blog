import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { authSelector } from "../../redux/slices/auth";
import { HourglassBottom } from "@mui/icons-material";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useSelector(authSelector);

  const [fileData, setFileData] = React.useState(null);
  const [filePreview, setFilePreview] = React.useState(null);
  const [filePath, setFilePath] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [text, setText] = React.useState("");

  const inputFileRef = React.useRef(null);

  const handleChangeFile = (e) => {
    setFileData(e.target.files[0]);
  };

  const onClickRemoveImage = () => {
    inputFileRef.current.value = null;
    setFileData(null);
    setFilePreview(null);
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      let result;

      if (fileData) {
        const formData = new FormData();
        formData.append("image", fileData);

        result = await axios.post("/upload", formData);
      }

      const fields = {
        title,
        tags: tags ? tags.split(" ") : [],
        text,
      };

      if (!filePreview && !fileData) {
        fields.imageUrl = "";
        fields.imagePath = "";
      }

      if (filePreview && fileData) {
        fields.imageUrl = result.data.url;
        fields.imagePath = result.data.path;
      }

      if (id) {
        await axios.patch(`/posts/${id}`, fields);
        if (filePath) {
          if (fileData || (!filePreview && !fileData)) {
            await axios.post("/delete/upload", {
              imagePath: filePath,
            });
          }
        }
      } else {
        await axios.post("/posts", fields);
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Type text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  React.useEffect(() => {
    if (!fileData) {
      setFilePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(fileData);
    setFilePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileData]);

  React.useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  React.useEffect(() => {
    const fetchData = async (ident) => {
      const { data } = await axios.get(`/posts/${ident}/edit`);
      setTitle(data.title);
      setTags(data.tags.length > 0 ? data.tags.join(" ") : "");
      setText(data.text);
      setFilePath(data.imagePath ? data.imagePath : "");
      setFilePreview(
        //data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""
        data.imageUrl ? `api.mern2.sergiucotruta.co.uk${data.imageUrl}` : ""
      );
    };

    if (id) {
      fetchData(id);
    }
  }, []);

  return (
    <Paper style={{ padding: 30 }}>
      <div>
        <Button
          variant="outlined"
          size="large"
          onClick={() => inputFileRef.current.click()}
        >
          Upload preview
        </Button>
        <input
          name="image"
          ref={inputFileRef}
          type="file"
          onChange={(e) => handleChangeFile(e)}
          hidden
        />
        {filePreview && (
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
        )}
        {filePreview && (
          <img className={styles.image} src={filePreview} alt="Uploaded" />
        )}
      </div>

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post header..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button
          disabled={loading}
          onClick={onSubmit}
          size="large"
          variant="contained"
        >
          {loading ? <HourglassBottom /> : id ? "Update" : "Post"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};

export default AddPost;
