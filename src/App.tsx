import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#9a65f1",
        },
        secondary: {
            main: "#f57b20",
        },
        background: {
            default: "#1c1c1c",
            paper: "#202020",
        },
    },
});

const App = () => (
    <ThemeProvider theme={theme}>
        <div>Salut les amis</div>
    </ThemeProvider>
);

export default App;
