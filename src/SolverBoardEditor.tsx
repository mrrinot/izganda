import { MoveHistory, SolverBoard } from "$types/Board";
import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import MoveHistoryList from "$components/MoveHistoryList";
import BoardDisplay from "./BoardDisplay";
import { boardToText, parseBoardFile } from "./helpers/boardHelpers";
import { solveNextMove } from "./Solver/Solver";

interface SolverBoardEditorProps {
    boardName: string;
}

const SolverBoardEditor = ({ boardName }: SolverBoardEditorProps) => {
    const [board, setBoard] = useState<SolverBoard | null>(null);
    const [moves, setMoves] = useState<Array<MoveHistory>>([]);

    useEffect(() => {
        (async () => {
            const data = await fetch(`boards/${boardName}`);

            const boardStr = await data.text();

            setBoard(parseBoardFile(boardStr));
        })();
    }, [boardName]);

    const handleNextMove = () => {
        if (board) {
            const ret = solveNextMove(board);

            if (!ret) {
                console.log("YOU WON??");
            } else {
                const { board: newBoard, move } = ret;

                setMoves([...moves, { move, board: newBoard }]);
                setBoard(newBoard);
            }
        }
    };

    if (!board) {
        return null;
    }

    const handleCopyBoard = async () => {
        await navigator.clipboard.writeText(boardToText(board.clues));
    };

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                <BoardDisplay board={board} />
            </Grid>
            <Grid container direction="column" item xs>
                <Grid item>
                    <Button variant="contained" onClick={handleNextMove}>
                        Next move
                    </Button>
                </Grid>
                <Grid item container>
                    <MoveHistoryList moveHistory={moves} />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={handleCopyBoard}>
                        Get board string
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SolverBoardEditor;
