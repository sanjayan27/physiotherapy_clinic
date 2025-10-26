"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAdminAppointments, updatePatientPayment } from "@/app/services/adminAppointment.service";
import toast from "react-hot-toast";
import { Box, Paper, Stack, Typography, TextField, Select, MenuItem, Button, Chip, InputAdornment } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { CheckCircle } from "lucide-react";

// Types
interface AppointmentUser { name: string; phoneNumber: string; email: string; id?: string }
interface AppointmentSlot { slot: string; date?: string }
interface AppointmentItem {
  appointment_id: string | number;
  user: AppointmentUser;
  appointmentDate: string;
  slot: AppointmentSlot;
  status: string;
  concerns: string;
  payment: string;
}

export const TodayAppointmentPage: React.FC<{
  activeTab: string;
  getStatusColor: (status: string) => string;
  openBilling: (apt: AppointmentItem) => void;
}> = ({ activeTab, getStatusColor, openBilling }) => {
  const [todaysAppointments, setTodaysAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toggleUpdateDiv, setToggleUpdateDiv] = useState<string | number | null>(null);
  const [paymentValue, setPaymentValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAppointmentsByDate = async (date: string) => {
    setIsLoading(true);
    try {
      const response: any = await getAdminAppointments(date);
      if (response && Array.isArray(response)) {
        setTodaysAppointments(response as AppointmentItem[]);
      } else {
        setTodaysAppointments([]);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setTodaysAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (selectedDate) fetchAppointmentsByDate(selectedDate);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedDate]);

  const toggleUpdatePaymentDiv = (id: string | number) => {
    setToggleUpdateDiv(toggleUpdateDiv === id ? null : id);
  };

  const handleUpdatePaymentAndStatus = async (appointmentId: string | number) => {
    if (isSubmitting) return;
    const payload: any = {};
    if (paymentValue) payload.payment = paymentValue;
    if (statusValue) payload.status = statusValue;
    if (Object.keys(payload).length === 0) {
      toast.error("Please select a payment or status value to update.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response: any = await updatePatientPayment(String(appointmentId), payload);
      toast.success(response?.message || "Appointment updated successfully!");
      fetchAppointmentsByDate(selectedDate);
      setToggleUpdateDiv(null);
      setPaymentValue("");
      setStatusValue("");
    } catch (err: any) {
      console.error("Failed to update appointment:", err);
      toast.error(err?.response?.message || "Failed to update appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return todaysAppointments;
    const q = searchTerm.toLowerCase();
    return todaysAppointments.filter((a) => a.user.name.toLowerCase().includes(q) || String(a.appointment_id).includes(q));
  }, [todaysAppointments, searchTerm]);

  return (
    <Box>
      {activeTab === "appointments" && (
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
            <Typography variant="h6" fontWeight={600} color="text.primary">Appointments for</Typography>
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={(d: Date | null) => {
              if (!d) return;
              setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
            }}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
              popperModifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
              calendarClassName="rdp-calendar"
              popperClassName="rdp-popper"
              showPopperArrow={false}
              customInput={
                <TextField
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={16} />
                      </InputAdornment>
                    ),
                  }}
                /> as any
              }
            />
          </Stack>

          <TextField
            fullWidth
            size="small"
            placeholder="Search by patient name or appointment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isLoading ? (
            <Typography align="center" color="text.secondary" sx={{ py: 5 }}>Loading appointments...</Typography>
          ) : filteredAppointments.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
              <Typography color="text.secondary">No appointments are scheduled for today.</Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {filteredAppointments.map((appointment) => (
                <Box key={appointment.appointment_id}>
                  <Paper sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                      <Box flex={1}>
                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                          <Button onClick={() => openBilling(appointment)} variant="text" sx={{ textTransform: "none", fontWeight: 600 }}>
                            {appointment.user.name}
                          </Button>
                          <Chip size="small" label={appointment.status} className={getStatusColor(appointment.status)} sx={{ textTransform: "capitalize" }} />
                          <Chip size="small" color="warning" label={appointment.payment.toUpperCase()} sx={{ textTransform: "uppercase" }} />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircle size={16} />
                            <Typography variant="body2">Slot: {appointment.slot.slot}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(appointment.appointmentDate).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="primary.main">
                            Concern: <Typography component="span" color="text.primary">{appointment.concerns}</Typography>
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1 }}>
                          <Typography variant="body2">+91 {appointment.user.phoneNumber}</Typography>
                          <Typography variant="body2">{appointment.user.email}</Typography>
                        </Stack>
                      </Box>

                      <Stack spacing={1} alignItems="stretch">
                        <Button variant="contained" size="small" onClick={() => toggleUpdatePaymentDiv(appointment.appointment_id)}>
                          Update Payment & Status
                        </Button>
                        <Button variant="contained" color="success" size="small" onClick={() => openBilling(appointment)}>
                          Update Bill
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>

                  {toggleUpdateDiv === appointment.appointment_id && (
                    <Paper sx={{ p: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdatePaymentAndStatus(appointment.appointment_id);
                        }}
                      >
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">Update Payment</Typography>
                            <Select size="small" value={paymentValue} onChange={(e) => setPaymentValue(e.target.value as string)} displayEmpty>
                              <MenuItem value=""><em>Select Payment</em></MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="unpaid">Unpaid</MenuItem>
                            </Select>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">Update Status</Typography>
                            <Select size="small" value={statusValue} onChange={(e) => setStatusValue(e.target.value as string)} displayEmpty>
                              <MenuItem value=""><em>Select Status</em></MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="in-progress">In Progress</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                            </Select>
                          </Stack>
                          <Button type="submit" variant="contained" color="success" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update"}
                          </Button>
                        </Stack>
                      </form>
                    </Paper>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
};
