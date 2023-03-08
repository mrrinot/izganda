import { SolverBoard } from "$types/Board";
import { cloneDeep } from "lodash";
import { nakedCandidates } from "./Strategies/NakedCandidates";

export const solveNextMove = (board: SolverBoard) => {
    const newBoard = cloneDeep(board);

    let move = null;

    // Basic Strategies
    move = nakedCandidates(newBoard);

    if (!move) {
        return null;
    }

    return { board: newBoard, move };
};
