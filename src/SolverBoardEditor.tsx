import { SolverBoard } from "$types/Board";
import { Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import BoardDisplay from "./BoardDisplay";
import { parseBoardFile } from "./helpers/boardHelpers";

interface SolverBoardEditorProps {
    boardName: string;
}

const SolverBoardEditor = ({ boardName }: SolverBoardEditorProps) => {
    const [board, setBoard] = useState<SolverBoard | null>(null);

    useEffect(() => {
        (async () => {
            const data = await fetch(`boards/${boardName}`);

            const boardStr = await data.text();
            setBoard(parseBoardFile(boardStr));
        })();
    }, [boardName]);

    return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
            <Button variant="contained">Next move</Button>
            {board && <BoardDisplay board={board} />}
        </Stack>
    );
};

export default SolverBoardEditor;
