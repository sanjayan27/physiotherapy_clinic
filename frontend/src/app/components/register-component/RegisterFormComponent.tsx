"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { register } from "@/app/services/authentication.service";
import { Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";

const MobileRegisterForm: React.FC = () => {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bdDate, setBdDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber) || !bdDate || !location) {
      toast.error("Please fill all the fields correctly");
      return;
    }

    try {
      const response = await register({
        name,
        email,
        phoneNumber: mobileNumber,
        bdDate,
        location,
      });
      if (response) {
        toast.success("Registration successful!");
        setEmail("");
        setName("");
        setMobileNumber("");
        setBdDate("");
        setLocation("");
        router.push("/login");
      } else {
        toast.error(response?.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome user, please register to continue
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mobile Number"
            placeholder="10-digit mobile"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
            fullWidth
          />
          <TextField
            label="Birth date (YYYY-MM-DD)"
            placeholder="YYYY-MM-DD"
            value={bdDate}
            onChange={(e) => setBdDate(e.target.value)}
            inputProps={{ maxLength: 10 }}
            fullWidth
          />
          <TextField
            label="Location (e.g., Chennai, Trichy)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            inputProps={{ maxLength: 30 }}
            fullWidth
          />

          <Button variant="contained" color="primary" onClick={handleRegister} sx={{ py: 1.25 }}>
            Register
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary" component="span">
            Already have an account? 
          </Typography>
          <Button component={NextLink} href="/login" variant="text" size="small">
            Sign in here
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileRegisterForm;
