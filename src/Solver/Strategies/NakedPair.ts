import {
    getCellCandidates,
    getCandidatesCount,
    removeCandidatesFromSubSet,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Pair";

const checkSubSet = (
    board: SolverBoard,
    pair: string,
    subSet: Array<number>,
) => {
    const pairIndices = [];

    for (let r = 0; r < subSet.length; r++) {
        if (getCellCandidates(board.candidates[subSet[r]]) === pair) {
            pairIndices.push(subSet[r]);
        }

        if (pairIndices.length === 2) {
            return removeCandidatesFromSubSet(
                board,
                pair,
                subSet,
                pairIndices,
                STRATEGY_NAME,
            );
        }
    }
    return null;
};

/*
Look for naked pairs
*/
export const nakedPair = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const candidatesCount = getCandidatesCount(board.candidates[index]);

        if (candidatesCount === 2) {
            const pair = getCellCandidates(board.candidates[index]);

            const move = earlySuccess(
                () => checkSubSet(board, pair, getRow(index)),
                () => checkSubSet(board, pair, getColumn(index)),
                () => checkSubSet(board, pair, getBox(index)),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
