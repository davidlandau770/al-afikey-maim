import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#1B6B8A",
      dark: "#14506A",
      light: "#4A9BB5",
    },
    secondary: {
      main: "#C8903A",
      dark: "#A07020",
    },
    background: {
      default: "#F7F4EF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#5D7A8A",
    },
  },
  typography: {
    fontFamily: "'Heebo', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            right: 30,
            left: "auto",
            transformOrigin: "top right",
            "&.MuiInputLabel-shrink": {
              right: 15,
              transform: "translate(0, -9px) scale(0.75)",
            },
          },
          "& .MuiOutlinedInput-notchedOutline legend": {
            textAlign: "right",
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
