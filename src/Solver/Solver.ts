import { SolverBoard } from "$types/Board";
import { cloneDeep } from "lodash";
import { earlySuccess } from "$src/helpers/functions";
import { nakedSingle } from "./Strategies/NakedSingle";
import { hiddenSingle } from "./Strategies/HiddenSingle";
import { nakedPair } from "./Strategies/NakedPair";
import { intersectionRemoval } from "./Strategies/IntersectionRemoval";
import { nakedTriple } from "./Strategies/NakedTriple";
import { hiddenPair } from "./Strategies/HiddenPair";

export const solveNextMove = (board: SolverBoard) => {
    const newBoard = cloneDeep(board);

    const move = earlySuccess(
        () => nakedSingle(newBoard),
        () => hiddenSingle(newBoard),
        () => intersectionRemoval(newBoard),
        () => nakedPair(newBoard),
        () => nakedTriple(newBoard),
        () => hiddenPair(newBoard),
    );

    return { board: newBoard, move };
};
