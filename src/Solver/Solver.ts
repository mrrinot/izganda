import { SolverBoard } from "$types/Board";
import { cloneDeep } from "lodash";
import { earlySuccess } from "$src/helpers/functions";
import { nakedSingle } from "./Strategies/NakedSingle";
import { hiddenSingle } from "./Strategies/HiddenSingle";

export const solveNextMove = (board: SolverBoard) => {
    const newBoard = cloneDeep(board);

    const move = earlySuccess(
        () => nakedSingle(newBoard),
        () => hiddenSingle(newBoard),
    );

    if (!move) {
        return null;
    }

    return { board: newBoard, move };
};
