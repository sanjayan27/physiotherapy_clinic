"use client";
// User dropdown component
import React, { useContext } from "react";
import NextLink from "next/link";
import { AppContext } from "@/app/context/AppContext";
import { FaUser } from "react-icons/fa";
import { HeartPlus } from "lucide-react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { RiArrowDropDownLine } from "react-icons/ri";

interface UserDropdownProps {
  isMobile?: boolean;
  handleUserAction: (action: "open" | "close") => void;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
  userDetails: boolean;
  handleLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isMobile = false,
  handleUserAction,
  dropdownRef,
  userDetails,
  handleLogout,
}) => {
  const theme = useTheme();
  const { role } = useContext(AppContext)!;

  return (
    <Box position={isMobile ? "static" : "relative"} ref={!isMobile ? dropdownRef : undefined}>
      <Box display="flex" alignItems="center" gap={isMobile ? 1 : 0}>
        <IconButton
          onClick={() => handleUserAction("open")}
          aria-label="User menu"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          <FaUser size={16} />
        </IconButton>
        {isMobile && (
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            Patient Name
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "100%",
          right: 0,
          mt: 1,
          zIndex: 50,
          transformOrigin: "top right",
          transition: "all 200ms ease",
          opacity: userDetails ? 1 : 0,
          visibility: userDetails ? "visible" : "hidden",
          transform: userDetails ? "scale(1)" : "scale(0.95)",
        }}
      >
        <Paper variant="outlined" sx={{ width: 220 }}>
          <Box px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="text.primary">
              Your Account
            </Typography>
            <IconButton size="small" onClick={() => handleUserAction("close")}>
              <RiArrowDropDownLine style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </Box>
          <Divider />
          <Box py={0.5}>
            {(role === "admin") || (role === "superadmin") ? (
              <Button
                component={NextLink}
                href="/admin-dashboard"
                fullWidth
                variant="text"
                sx={{ justifyContent: "flex-start", px: 2, color: "text.secondary", "&:hover": { color: "secondary.main" } }}
                startIcon={<HeartPlus size={17} />}
              >
                Admin Page
              </Button>
            ) : (
              <Button
                component={NextLink}
                href="/user-details"
                fullWidth
                variant="text"
                sx={{ justifyContent: "flex-start", px: 2, color: "text.secondary", "&:hover": { color: "secondary.main" } }}
              >
                Your Details
              </Button>
            )}
            <Button
              fullWidth
              variant="text"
              onClick={handleLogout}
              sx={{ justifyContent: "flex-start", px: 2, color: "text.secondary", "&:hover": { color: "error.main" } }}
            >
              Log Out
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserDropdown;
