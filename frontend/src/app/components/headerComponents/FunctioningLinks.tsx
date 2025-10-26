"use client";
import React, { useContext } from "react";
import NextLink from "next/link";
import { AppContext } from "@/app/context/AppContext";
import { HeartPlus, LogOut } from "lucide-react";
import { Box, Button, Stack, useTheme } from "@mui/material";

interface FunctioningLinksProps {
  handleUserAction?: (action: "open" | "close") => void;
  closeMenu?: () => void;
  isMobile?: boolean;
  handleLogout: () => void;
}

const FunctioningLinks: React.FC<FunctioningLinksProps> = ({
  closeMenu,
  isMobile = false,
  handleLogout,
}) => {
  const theme = useTheme();
  const { isLogin, role } = useContext(AppContext)!;

  if (!isLogin) return null;

  const commonButtonSx = {
    justifyContent: "flex-start",
    color: theme.palette.text.primary,
    textTransform: "none" as const,
    borderRadius: 1,
    px: 1,
    py: 1.5,
    gap: 1,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.secondary.main,
    },
  };

  return (
    <Box component="section" sx={{ mb: 3 }}>
      <Stack spacing={1}>
        {(role === "admin") || (role === "superadmin") ? (
          <Button
            component={NextLink}
            href="/admin-dashboard"
            variant="text"
            fullWidth
            startIcon={<HeartPlus size={17} />}
            sx={commonButtonSx}
            onClick={isMobile ? closeMenu : undefined}
          >
            Admin Page
          </Button>
        ) : (
          <Button
            component={NextLink}
            href="/user-details"
            variant="text"
            fullWidth
            startIcon={<HeartPlus size={17} />}
            sx={commonButtonSx}
            onClick={isMobile ? closeMenu : undefined}
          >
            Your Details
          </Button>
        )}

        <Button
          variant="text"
          fullWidth
          onClick={handleLogout}
          startIcon={<LogOut size={17} />}
          sx={{
            ...commonButtonSx,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.error.main,
            },
          }}
        >
          Log Out
        </Button>
      </Stack>
    </Box>
  );
};

export default FunctioningLinks;
