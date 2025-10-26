"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getAllAppointments } from "@/app/services/adminAppointment.service";
import { Box, Paper, Stack, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TextField } from "@mui/material";

interface AppointmentUser { name: string; phoneNumber: string; email: string }
interface AppointmentSlot { date?: string }
interface PatientAppointment {
  user: AppointmentUser;
  slot: AppointmentSlot;
  status: string;
  appointments:any
  name:string;
  email:string;
  phoneNumber:string;

}

export const PatientInformations: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [allPatients, setAllPatients] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "booked" | "completed" | "requested">("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchAndProcessAppointments = async () => {
      if (activeTab !== "patients") return;
      setIsLoading(true);
      try {
        const response: any = await getAllAppointments();
        console.log('responseg',response)
        if (response && Array.isArray(response)) {
          setAllPatients(response as PatientAppointment[]);
        } else {
          setAllPatients([]);
        }
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        setAllPatients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessAppointments();
  }, [activeTab]);

  const filteredPatients = useMemo(() => {
    const base = activeFilterTab === "all" ? allPatients : allPatients.filter((p) => p.appointments[0].status === activeFilterTab);
    if (!search) return base;
    const q = search.toLowerCase();
    return base.filter((p) => p?.name?.toLowerCase().includes(q) || p?.email?.toLowerCase().includes(q));
  }, [allPatients, activeFilterTab, search]);

  if (activeTab !== "patients") return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h6" fontWeight={600}>Patient Records</Typography>
        <TextField size="small" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: { xs: "100%", md: 320 } }} />
      </Stack>

      <Paper>
        <Tabs
          value={activeFilterTab}
          onChange={(_, v) => setActiveFilterTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          <Tab label="Booked" value="booked" />
          <Tab label="Completed" value="completed" />
          <Tab label="Requested" value="requested" />
        </Tabs>

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Last Visit</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">Loading patient records...</TableCell>
                </TableRow>
              </TableBody>
            ) : filteredPatients.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">No patient records found for this filter.</TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ textTransform: "capitalize" }}>{patient.user.name}</TableCell>
                    <TableCell>
                      <div>{patient.user.phoneNumber}</div>
                      <div>{patient.user.email}</div>
                    </TableCell>
                    <TableCell>
                      {patient.slot?.date ? new Date(patient.slot.date).toISOString().split("T")[0] : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Typography color="primary" sx={{ cursor: "pointer" }}>View Details</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Box>
      </Paper>
    </Box>
  );
};
