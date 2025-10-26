import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Box, Fab, useTheme } from "@mui/material";

export const WhatsappChatbot: React.FC = () => {
  const theme = useTheme();
  const openChat = () => {
    window.open(
      "https://wa.me/+914426790071?text=Hi%20I%20want%20to%20book%20an%20appointment",
      "_blank"
    );
  };
  return (
    <Box sx={{ position: "fixed", right: 32, bottom: 32 }}>
      <Fab
        onClick={openChat}
        aria-label="WhatsApp chat"
        sx={{ bgcolor: "success.main", color: "common.white", "&:hover": { bgcolor: "success.dark" } }}
      >
        <FaWhatsapp size={24} />
      </Fab>
    </Box>
  );
};

export default WhatsappChatbot;
