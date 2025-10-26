"use client";

import React, { useEffect, useState } from "react";
import { IoReload, IoReloadCircle } from "react-icons/io5";
import { getLiveStatus } from "@/app/services/patientAppointmentBooking.service";
import { Box, Paper, Stack, Typography, IconButton, useTheme } from "@mui/material";

type LiveApt = {
  status: "in-progress" | "delayed" | string;
  newTime?: string;
  slot?: { slot?: string };
};

const LiveAppointment: React.FC = () => {
  const theme = useTheme();
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liveAppointment, setLiveAppointment] = useState<LiveApt | null>(null);

  const fetchLiveStatus = async () => {
    if (!isReloading) setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await getLiveStatus(today as any);
      const appointments = Array.isArray(response) ? response : [response];
      const currentAppointment = appointments.find(
        (apt: LiveApt) => apt?.status === "in-progress" || apt?.status === "delayed"
      );
      setLiveAppointment(currentAppointment || null);
    } catch (error) {
      console.error("Failed to fetch live appointment status:", error);
      setLiveAppointment(null);
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReload = () => {
    setIsReloading(true);
    fetchLiveStatus();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={5} p={2}>
        <Paper sx={{ p: 4, maxWidth: 480, width: "100%", position: "relative", overflow: "hidden" }} elevation={3}>
          <Box sx={{ position: "absolute", top: -100, right: -100, width: 256, height: 256, borderRadius: "50%", bgcolor: "secondary.main", opacity: 0.1 }} />
          <Typography align="center" color="text.secondary">Loading Live Status...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!liveAppointment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={5} p={2}>
        <Paper sx={{ p: 4, maxWidth: 480, width: "100%", textAlign: "center" }} elevation={3}>
          <Typography color="text.secondary">No live appointments right now.</Typography>
        </Paper>
      </Box>
    );
  }

  const { status, newTime } = liveAppointment;
  const slotTime = liveAppointment.slot?.slot;
  const isDelayed = status === "delayed";

  return (
    <Box display="flex" justifyContent="center" alignItems="center" my={5} p={2}>
      <Paper sx={{ p: 4, maxWidth: 480, width: "100%", position: "relative", overflow: "hidden" }} elevation={3}>
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 256,
            height: 256,
            borderRadius: "50%",
            opacity: 0.1,
            bgcolor: isDelayed ? "error.main" : "secondary.main",
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              component="span"
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDelayed ? theme.palette.error.main : theme.palette.primary.main,
              }}
            >
              •
            </Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {isDelayed ? "Delayed Slot" : "Slot In Progress"}
            </Typography>
          </Stack>
          <IconButton onClick={handleReload} disabled={isReloading} color="default">
            {isReloading ? <IoReloadCircle className="animate-spin" /> : <IoReload />}
          </IconButton>
        </Stack>

        {isDelayed ? (
          <>
            <Typography variant="h5" fontWeight={300} color="text.primary" mb={2}>
              The slot at <Typography component="span" fontWeight={600} color="error.main">{slotTime}</Typography> is delayed.
            </Typography>
            <Box sx={{ borderTop: 2, borderColor: "divider", pt: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary" mb={1}>New Scheduled Time:</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "secondary.main", color: "secondary.contrastText", p: 1, borderRadius: "50%" }}>⏱️</Box>
                <Typography variant="h4" fontWeight={800} color="secondary.main">
                  {newTime || "TBD"}
                </Typography>
              </Stack>
            </Box>
          </>
        ) : (
          <Typography variant="h5" fontWeight={300} color="text.primary">
            The slot at <Typography component="span" fontWeight={600} color="primary.main">{slotTime}</Typography> is currently in progress. Please wait.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LiveAppointment;
