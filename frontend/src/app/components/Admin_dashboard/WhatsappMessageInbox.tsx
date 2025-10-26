"use client";

import React from "react";
import { Box, Paper, Stack, Typography, Button, Chip } from "@mui/material";

interface MessageItem {
  id: string | number;
  patientName: string;
  phone: string;
  message: string;
  time: string;
  status: "unread" | "read";
}

export const WhatsappMessageInbox: React.FC<{ activeTab: string; whatsappMessages: MessageItem[] }> = ({ activeTab, whatsappMessages }) => {
  if (activeTab !== "messages") return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>WhatsApp Messages</Typography>
      <Stack spacing={2}>
        {whatsappMessages.map((m) => (
          <Box key={m.id}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                    <Typography fontWeight={600}>{m.patientName}</Typography>
                    <Typography variant="caption" color="text.secondary">{m.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">{m.time}</Typography>
                    {m.status === "unread" && <Chip size="small" color="error" label="New" />}
                  </Stack>
                  <Typography sx={{ mt: 1 }}>{m.message}</Typography>
                </Box>
                <Button variant="contained" color="success" size="small">Reply</Button>
              </Stack>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
