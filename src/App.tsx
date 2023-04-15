import {
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import React from "react";
import SolverBoardEditor from "./SolverBoardEditor";

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
        <CssBaseline enableColorScheme>
            <Container maxWidth="md" sx={{ marginTop: theme.spacing(5) }}>
                <SolverBoardEditor boardName="hiddenTriple.txt" />
            </Container>
        </CssBaseline>
    </ThemeProvider>
);

export default App;
