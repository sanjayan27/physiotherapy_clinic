"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const navy = "#0A2540";        // Deep Navy (primary)
const teal = "#00A896";        // Emerald Teal (secondary/primary buttons)
const cloud = "#F9FAFB";       // Cloud White (clean backgrounds)
const silver = "#E5E7EB";      // Silver Mist (dividers/cards)
const slate = "#6B7280";       // Cool Grey (text)
const coral = "#FF6B6B";       // Sunset Coral (error)
const mint = "#D1FAE5";        // Lime Mint (success accents)
const aqua = "#38BDF8";        // Sky Aqua (info highlights)
const gold = "#FACC15";        // Golden Glow (premium accent)

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: navy,           // headers, navbars, CTAs
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: teal,           // buttons, highlights
      contrastText: "#FFFFFF",
    },
    error: { main: coral },
    success: { main: teal, light: mint },
    info: { main: aqua },
    warning: { main: gold },
    background: {
      default: cloud,
      paper: "#FFFFFF",
    },
    divider: silver,
    text: {
      primary: slate,
      secondary: "#7B8594",
    },
  },
  typography: {
    fontFamily: [
      "var(--font-outfit)",
      "var(--font-geist-sans)",
      "Inter",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 800, color: navy },
    h2: { fontWeight: 800, color: navy },
    h3: { fontWeight: 700, color: navy },
    body1: { color: slate },
    body2: { color: slate },
  },
  components: {
    MuiAppBar: {
      defaultProps: { color: "primary" },
      styleOverrides: {
        colorPrimary: {
          backgroundColor: navy,
          color: "#FFFFFF",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 9999 },
        containedPrimary: {
          background: navy,
        },
        containedSecondary: {
          background: teal,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorWarning: { backgroundColor: gold, color: "#1F2937" },
      },
    },
  },
});

const muiTheme = responsiveFontSizes(theme);
export default muiTheme;
