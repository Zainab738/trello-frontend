import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6C6FF1",
    },
    header: {
      main: "#F5F5F5",
    },
    deletebutton: {
      main: red[400],
    },
    orangebutton: {
      main: "#E94E1A",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          width: "15rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          //color: "white",
          border: "1px solid white",
          backgroundColor: "transparent",
          borderRadius: "10px",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
