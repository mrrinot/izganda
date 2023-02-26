import {
    Container,
    createTheme,
    CssBaseline,
    Grid,
    ThemeProvider,
} from "@mui/material";
import React from "react";
import BoardEditor from "./BoardEditor";

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
            <Container maxWidth="sm" sx={{ marginTop: theme.spacing(5) }}>
                <Grid container spacing={2} justifyItems="center">
                    <Grid item>
                        <BoardEditor boardName="simple.txt" />
                    </Grid>
                </Grid>
            </Container>
        </CssBaseline>
    </ThemeProvider>
);

export default App;
