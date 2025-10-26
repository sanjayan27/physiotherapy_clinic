"use client";

import React, { useContext, useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import { login, requestOtp } from "@/app/services/authentication.service";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const MobileLoginForm: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const COOLDOWN_SEC = Number(
    process.env.NEXT_PUBLIC_OTP_RESEND_COOLDOWN_SEC ??
    process.env.OTP_RESEND_COOLDOWN_SEC ??
    60
  ) || 60;
  const router = useRouter();
  const appCtx: any = useContext(AppContext as any);

  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === "phone" ? "email" : "phone"));
    setIsOtpSent(false);
    setOtp("");
    setEmail("");
    setPhoneNumber("");
    setCooldownLeft(0);
    setIsLoading(false);
  };

  const validateIdentifier = () => {
    if (loginMethod === "email") {
      if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
    } else {
      if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return false;
      }
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateIdentifier()) return;
    setIsLoading(true);
    try {
      const payload =
        loginMethod === "email" ? { email } : { phoneNumber: `${phoneNumber}` };
      const response = await requestOtp(payload);
      if (response?.success) {
        setIsOtpSent(true);
        setCooldownLeft(COOLDOWN_SEC);
        toast.success(response.message || `OTP sent to your ${loginMethod}!`);
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateIdentifier()) return;
    if (!otp) {
      toast.error("Please enter your OTP");
      return;
    }
    const payload =
      loginMethod === "email" ? { email, code: otp } : { phoneNumber, code: otp };
    try {
      const response = await login(payload);
      if (response && response.success) {
        appCtx?.setIsLogin?.(true);
        localStorage.setItem("isLogin", "true");
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success("Login Successful");
        }
        const role = response.data?.user?.role;
        if (role === "superadmin" || role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/user-details");
        }
      } else {
        toast.error(response?.message || "Login failed. Please check your OTP.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed."
      );
    }
  };

  useEffect(() => {
    if (isOtpSent && cooldownLeft > 0) {
      const id = setInterval(() => {
        setCooldownLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [isOtpSent, cooldownLeft]);

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
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome user, please sign in to continue
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {loginMethod === "phone" ? (
            <TextField
              label="Mobile Number"
              placeholder="10-digit mobile"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputProps={{ maxLength: 10, inputMode: "numeric" }}
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleSendOtp}
                        disabled={
                          isLoading ||
                          !/^\d{10}$/.test(phoneNumber) ||
                          (isOtpSent && cooldownLeft > 0)
                        }
                        variant={isOtpSent ? (cooldownLeft > 0 ? "outlined" : "contained") : "contained"}
                        color={isOtpSent && cooldownLeft === 0 ? "primary" : isOtpSent ? "success" : "primary"}
                      >
                        {isLoading
                          ? "Sending..."
                          : isOtpSent && cooldownLeft > 0
                          ? `Resend in ${cooldownLeft}s`
                          : isOtpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleSendOtp}
                        disabled={
                          isLoading ||
                          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
                          (isOtpSent && cooldownLeft > 0)
                        }
                        variant={isOtpSent ? (cooldownLeft > 0 ? "outlined" : "contained") : "contained"}
                        color={isOtpSent && cooldownLeft === 0 ? "primary" : isOtpSent ? "success" : "primary"}
                      >
                        {isLoading
                          ? "Sending..."
                          : isOtpSent && cooldownLeft > 0
                          ? `Resend in ${cooldownLeft}s`
                          : isOtpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          {isOtpSent && (
            <TextField
              label="OTP"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              fullWidth
            />
          )}

          <Button
            variant="contained"
            onClick={handleLogin}
            color="primary"
            sx={{ py: 1.25 }}
          >
            Sign In With {loginMethod === "phone" ? "Phone" : "Email"} and OTP
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Button variant="text" onClick={toggleLoginMethod} size="small">
            Sign in with {loginMethod === "phone" ? "Email" : "Phone Number"}
          </Button>
        </Box>

        <Box mt={1.5} textAlign="center">
          <Typography variant="body2" color="text.secondary" component="span">
            Don't have an account? 
          </Typography>
          <Button component={NextLink} href="/register" variant="text" size="small">
            Register here
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileLoginForm;
