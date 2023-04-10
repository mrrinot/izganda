import { playMove } from "$src/helpers/boardHelpers";
import {
    removeCandidate,
    getCandidatesCount,
    getFirstCandidate,
    checkCandidate,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Intersection Removal";

const removeClueFromSubset = (
    board: SolverBoard,
    potentialCandidate: number,
    subSet: Array<number>,
    excludedIndices: Array<number>,
) => {
    for (let m = 0; m < subSet.length; m++) {
        const count = getCandidatesCount(board.candidates[subSet[m]]);

        if (count > 0 && !excludedIndices.includes(subSet[m])) {
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                potentialCandidate,
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

const checkIntersectionFromSubsets = (
    board: SolverBoard,
    clue: number,
    subSet1: Array<number>,
    subSet2: Array<number>,
): Move | null => {
    const foundIndices = [];

    for (let r = 0; r < 9; r++) {
        if (checkCandidate(board.candidates[subSet1[r]], clue)) {
            foundIndices.push(subSet1[r]);
        }
    }

    // All available box indices are in the same row => we can remove them for the rest of the row (since one of them has to be in the box)
    if (foundIndices.every((b) => subSet2.includes(b))) {
        const move = removeClueFromSubset(board, clue, subSet2, foundIndices);

        if (move) {
            return move;
        }
    }

    return null;
};

/*
Look for intersection removal https://www.sudokuwiki.org/Intersection_Removal
*/
export const intersectionRemoval = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const box = getBox(index);
        const row = getRow(index);
        const col = getColumn(index);

        // Check for pointing pairs/triples in rows
        for (let clue = 0; clue < 9; clue++) {
            if (!checkCandidate(board.candidates[index], clue)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            const move = earlySuccess(
                () => checkIntersectionFromSubsets(board, clue, box, row),
                () => checkIntersectionFromSubsets(board, clue, box, col),
                () => checkIntersectionFromSubsets(board, clue, col, box),
                () => checkIntersectionFromSubsets(board, clue, row, box),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
