import { playMove } from "$src/helpers/boardHelpers";
import {
    removeCandidate,
    getCellCandidates,
    getCandidatesCount,
    getFirstCandidate,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Pair";

const removePairFromSubSet = (
    board: SolverBoard,
    pair: string,
    subSet: Array<number>,
    pairIndices: [number, number],
) => {
    for (let m = 0; m < subSet.length; m++) {
        const count = getCandidatesCount(board.candidates[subSet[m]]);

        if (count > 0 && !pairIndices.includes(m)) {
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                Number(pair[0]),
            );
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                Number(pair[1]),
            );

            if (getCandidatesCount(board.candidates[subSet[m]]) === 1) {
                const move: Move = {
                    clue: Number(
                        getFirstCandidate(board.candidates[subSet[m]]),
                    ),
                    index: subSet[m],
                    strategy: STRATEGY_NAME,
                };
                playMove(board, move);

                return move;
            }
        }
    }

    return null;
};

const checkSubSet = (
    board: SolverBoard,
    pair: string,
    subSet: Array<number>,
) => {
    const pairIndices = [];

    for (let r = 0; r < subSet.length; r++) {
        if (getCellCandidates(board.candidates[subSet[r]]) === pair) {
            pairIndices.push(r);
        }

        if (pairIndices.length === 2) {
            const move = removePairFromSubSet(
                board,
                pair,
                subSet,
                pairIndices as [number, number],
            );

            if (move) {
                return move;
            }

            break;
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
