import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./style/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </>
  );
}

export default App;
