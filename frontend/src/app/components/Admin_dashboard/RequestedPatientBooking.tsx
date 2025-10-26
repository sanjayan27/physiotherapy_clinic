"use client";

import React, { useMemo, useState } from "react";
import { updatePatientPayment } from "@/app/services/adminAppointment.service";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip } from "@mui/material";

interface AppointmentUser { name: string; phoneNumber: string }
interface AppointmentSlot { slot: string }
interface RequestedAppointment {
  appointment_id: string | number;
  user: AppointmentUser;
  appointmentDate: string;
  slot: AppointmentSlot;
  concerns: string;
  status: string;
}

export const RequestedPatientBooking: React.FC<{
  activeTab: string;
  allAppointments: RequestedAppointment[];
  getStatusColor: (status: string) => string;
}> = ({ activeTab, allAppointments, getStatusColor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestedAppointments = useMemo(
    () => allAppointments.filter((a) => a.status === "requested"),
    [allAppointments]
  );

  const handleUpdateStatus = async (appointmentId: string | number, newStatus: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updatePatientPayment(String(appointmentId), { status: newStatus });
      toast.success(`Appointment ${newStatus}.`);
      // Ideally: emit an event or call a refresh function from parent
    } catch (err: any) {
      console.error("Failed to update appointment status:", err);
      toast.error(err?.response?.data?.message || "Failed to update appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeTab !== "requested") return null;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Requested Patient Bookings</Typography>
      {requestedAppointments.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography color="text.secondary">No new appointment requests.</Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date & Slot</TableCell>
              <TableCell>Concern</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestedAppointments.map((appointment) => (
              <TableRow key={appointment.appointment_id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{appointment.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{appointment.user.phoneNumber}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{new Date(appointment.appointmentDate).toLocaleDateString()}</Typography>
                  <Typography variant="caption" color="text.secondary">{appointment.slot.slot}</Typography>
                </TableCell>
                <TableCell>{appointment.concerns}</TableCell>
                <TableCell>
                  <Chip size="small" label={appointment.status} className={getStatusColor(appointment.status)} sx={{ textTransform: "capitalize" }} />
                </TableCell>
                <TableCell>
                  <IconButton color="success" disabled={isSubmitting} onClick={() => handleUpdateStatus(appointment.appointment_id, "approved")}>
                    <Check size={18} />
                  </IconButton>
                  <IconButton color="error" disabled={isSubmitting} onClick={() => handleUpdateStatus(appointment.appointment_id, "rejected")}>
                    <X size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
