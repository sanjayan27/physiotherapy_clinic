"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import muiTheme from "./theme";

export default function MuiThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
