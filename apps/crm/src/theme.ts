import { createTheme } from "@mui/material/styles";
import { company } from "@western-mass-septic/config";

const { theme } = company;

export const appTheme = createTheme({
  palette: {
    primary: { main: theme.primaryColor },
    secondary: { main: theme.secondaryColor },
    background: {
      default: theme.backgroundColor,
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: `'${theme.fontFamily}', system-ui, sans-serif`,
  },
  shape: {
    borderRadius: theme.borderRadius,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
        },
      },
    },
  },
});
