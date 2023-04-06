import { SolverBoard } from "$types/Board";
import { cloneDeep } from "lodash";
import { earlySuccess } from "$src/helpers/functions";
import { nakedSingle } from "./Strategies/NakedSingle";
import { hiddenSingle } from "./Strategies/HiddenSingle";
import { nakedPair } from "./Strategies/NakedPair";

export const solveNextMove = (board: SolverBoard) => {
    const newBoard = cloneDeep(board);

    const move = earlySuccess(
        () => nakedSingle(newBoard),
        () => hiddenSingle(newBoard),
        () => nakedPair(newBoard),
    );

    if (!move) {
        return null;
    }

    return { board: newBoard, move };
};
