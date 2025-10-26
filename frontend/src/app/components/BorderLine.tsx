import React from "react";
import { Divider, Box } from "@mui/material";

export const BorderLine: React.FC<{ width?: string | number; opacity?: number }> = ({ width = "60vw", opacity = 0.2 }) => {
  return (
    <Box display="flex" justifyContent="center">
      <Divider sx={{ width, opacity }} />
    </Box>
  );
};

export default BorderLine;
