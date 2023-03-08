import { MoveHistory } from "$types/Board";
import { Grid, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

interface MoveHistoryListProps {
    moveHistory: Array<MoveHistory>;
}

const MoveHistoryList = ({ moveHistory }: MoveHistoryListProps) => (
    <Paper sx={{ padding: "8px" }}>
        <Typography variant="h5">Moves</Typography>
        <Stack>
            {moveHistory.map(({ board, move }) => (
                <div key={move.index}>
                    {move.index} {move.clue} {move.strategy}
                </div>
            ))}
        </Stack>
    </Paper>
);

export default MoveHistoryList;
