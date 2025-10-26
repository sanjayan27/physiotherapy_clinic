"use client";
import React from "react";
import { X, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";

type Status = "cancelled" | "rescheduled" | "delayed" | "available" | "";

interface TimeSlotsUpdateProps {
  time: string;
  status: Status;
  primaryAction?: () => void;
  primaryActionText?: string;
  secondaryAction?: () => void;
  secondaryActionText?: string;
}

const TimeSlotsUpdate: React.FC<TimeSlotsUpdateProps> = ({
  time,
  status,
  primaryAction,
  primaryActionText,
  secondaryAction,
  secondaryActionText,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "cancelled":
        return { icon: <X size={16} />, label: "Cancelled", color: "error.main" } as const;
      case "rescheduled":
        return { icon: <RefreshCw size={16} />, label: "Rescheduled", color: "warning.main" } as const;
      case "delayed":
        return { icon: <Clock size={16} />, label: "Delayed", color: "warning.light" } as const;
      case "available":
        return { icon: <CheckCircle size={16} />, label: "Available", color: "success.main" } as const;
      default:
        return { icon: null, label: "", color: "text.secondary" } as const;
    }
  };

  const cfg = getStatusConfig();

  return (
    <Paper variant="outlined" sx={{ p: 2, boxShadow: "none" }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
          Upcoming time slot
        </Typography>
        <Typography variant="h6" fontWeight={600}>{time}</Typography>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ color: cfg.color }}>{cfg.icon}</Box>
          <Typography fontWeight={600} sx={{ color: cfg.color }}>{cfg.label}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {primaryAction && (
            <Button size="small" variant="contained" color="error" onClick={primaryAction}>
              {primaryActionText}
            </Button>
          )}
          {secondaryAction && (
            <Button size="small" variant="contained" color="warning" onClick={secondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TimeSlotsUpdate;
