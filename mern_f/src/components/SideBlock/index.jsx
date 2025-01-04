import React from "react";
import { Typography, Paper } from "@mui/material";

import styles from "./SideBlock.module.scss";

const SideBlock = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default SideBlock;
