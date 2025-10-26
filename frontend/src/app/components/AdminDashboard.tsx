"use client";

import React, { useEffect, useState } from "react";
import BillingInterface from "@/app/components/Admin_dashboard/BillingInterface";
import { SideBar } from "./Admin_dashboard/SideBar";
import { CalenderSection } from "./Admin_dashboard/slotComponents/CalenderSection";
import { TodayAppointmentPage } from "./Admin_dashboard/TodayAppointmentPage";
import { RequestedPatientBooking } from "./Admin_dashboard/RequestedPatientBooking";
import { PatientInformations } from "./Admin_dashboard/PatientInformations";
import { WhatsappMessageInbox } from "./Admin_dashboard/WhatsappMessageInbox";
import Link from "next/link";
import { getAllAppointments } from "../services/adminAppointment.service";
import { AppBar, Toolbar, Typography, Box, Button, Badge, Paper } from "@mui/material";

const MessageBadge: React.FC<{ count: number }> = ({ count }) => (
  <Badge color="error" badgeContent={count} overlap="circular">
    <span role="img" aria-label="messages">💬</span>
  </Badge>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [showBilling, setShowBilling] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [whatsappMessages, setWhatsappMessages] = useState<any[]>([
    { id: 1, patientName: "Sunita Reddy", phone: "+91 95432 10987", message: "Can I reschedule my appointment from tomorrow to next week?", time: "10:30 AM", status: "unread" },
    { id: 2, patientName: "Vikram Singh", phone: "+91 84321 09876", message: "What documents should I bring for my first visit?", time: "09:15 AM", status: "unread" },
  ]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);

  useEffect(() => { setCurrentDate(new Date().toLocaleDateString()); }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Scheduled": return "text-yellow-600 bg-yellow-100";
      case "Cancelled": return "text-red-600 bg-red-100";
      case "No-show": return "text-body bg-surface-silver";
      default: return "text-body bg-surface-silver";
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await getAllAppointments();
        if (response && Array.isArray(response)) setAllAppointments(response);
      } catch (e) {
        console.error("Failed to fetch all appointments:", e);
      }
    };
    fetchAll();
  }, []);

  const openBilling = (patient: any) => { setSelectedPatient(patient); setShowBilling(true); };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
<AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={800}>PhysioClinic Admin</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button size="small" variant="contained" component={Link as any} href="/list-all-users">+ Book Appointment</Button>
            <MessageBadge count={whatsappMessages.filter((m) => m.status === "unread").length} />
            <Typography variant="body2">Today: {currentDate}</Typography>
            <Button size="small" component={Link as any} href="/">Home</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        <SideBar setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box component="main" sx={{ flex: 1, p: 2 }}>
          <CalenderSection activeTab={activeTab} />
          <TodayAppointmentPage activeTab={activeTab} getStatusColor={getStatusColor} openBilling={openBilling} />
          <WhatsappMessageInbox activeTab={activeTab} whatsappMessages={whatsappMessages} />
          <PatientInformations activeTab={activeTab} />
          <RequestedPatientBooking activeTab={activeTab} allAppointments={allAppointments} getStatusColor={getStatusColor} />
        </Box>
      </Box>

      {showBilling && selectedPatient && (
        <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300 }}>
          <Paper sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflow: "auto" }}>
            <BillingInterface setShowBilling={setShowBilling} showBilling={showBilling} selectedPatient={selectedPatient} />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
