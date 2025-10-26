"use client";

import React from "react";
import { FaUser } from "react-icons/fa";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

interface HandleMobileViewProps {
  isMobile?: boolean;
}

const HandleMobileView: React.FC<HandleMobileViewProps> = ({ isMobile = false }) => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center" gap={isMobile ? 1 : 0}>
      <IconButton
        aria-label="User menu"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 1,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}
      >
        <FaUser size={16} />
      </IconButton>
      {isMobile && (
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          Patient Name
        </Typography>
      )}
    </Box>
  );
};

export default HandleMobileView;
