import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Home from "./container";
import { createTheme } from "@mui/material/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 16000;
  return library;
}

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#227093",
        light: "#227093",
        dark: "#227093",
      },
      secondary: {
        main: "#ff5252",
        light: "#ff5252",
        dark: "#ff5252",
      },
    },
    typography: {
      fontFamily: [
        "Rubik",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Web3ReactProvider getLibrary={getLibrary}>
          <CssBaseline />
          <Router>
            <Home />
          </Router>
        </Web3ReactProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
