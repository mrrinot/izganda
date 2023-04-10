import React from "react";
import { SolverBoard } from "$types/Board";
import { Grid, Typography } from "@mui/material";
import {
    getCellCandidates,
    getCandidatesCount,
} from "./helpers/candidatesHelpers";

interface BoardDisplayProps {
    board: SolverBoard;
}

const BoardDisplay = ({ board }: BoardDisplayProps) => (
    <Grid container sx={{ width: "calc(9 * 64px + 3 * 4px)" }}>
        {Array.from({ length: 3 }).map((v, x) => (
            <Grid container item key={x} xs={12}>
                {Array.from({ length: 3 }).map((o, y) => (
                    <Grid item xs={4} key={y}>
                        <Grid
                            container
                            sx={{
                                border: "2px solid DimGrey",
                                textAlign: "center",
                            }}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {Array.from({ length: 9 }).map((p, i) => {
                                const index =
                                    x * 27 +
                                    y * 3 +
                                    Math.floor(i / 3) * 9 +
                                    (i % 3);

                                const clue = board.clues[index];
                                const candidates = getCellCandidates(
                                    board.candidates[index],
                                );

                                return (
                                    <Grid
                                        item
                                        key={i}
                                        xs={4}
                                        title={String(index)}
                                        alignSelf="center"
                                        sx={{
                                            width: "64px",
                                            height: "64px",
                                            border: "1px solid dimGrey",
                                        }}
                                        container
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {clue ? (
                                            <Typography variant="h4">
                                                {clue}
                                            </Typography>
                                        ) : (
                                            <div
                                                style={{
                                                    fontSize:
                                                        14 -
                                                        candidates.length * 0.5,
                                                }}
                                            >
                                                {candidates}
                                            </div>
                                        )}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        ))}
    </Grid>
);

export default BoardDisplay;
