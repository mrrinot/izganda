import {
    checkCandidate,
    removeCandidatesFromSubSet,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import {
    columnIndices,
    rowIndices,
    getColumn,
    getRow,
} from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

// The hidden triple map does not match this, you have to disable the other strategies to test this one.
const STRATEGY_NAME = "XWing";

const checkSubSet = (
    board: SolverBoard,
    allSubsets: Array<Array<number>>,
    getOtherSubset: (index: number) => Array<number>,
) => {
    const possibleCellsByClues: Array<
        Array<Array<{ index: number; positionInSubset: number }>>
    > = Array.from({
        length: 9,
    }).map(() => Array.from({ length: 9 }).map(() => []));

    for (let s = 0; s < allSubsets.length; s++) {
        for (let r = 0; r < allSubsets[s].length; r++) {
            for (let clue = 1; clue <= 9; clue++) {
                if (checkCandidate(board.candidates[allSubsets[s][r]], clue)) {
                    possibleCellsByClues[s][clue - 1].push({
                        index: allSubsets[s][r],
                        positionInSubset: r,
                    });
                }
            }
        }
    }

    for (let s = 0; s < allSubsets.length; s++) {
        for (let i = 0; i < 9; i++) {
            if (possibleCellsByClues[s][i].length !== 2) {
                continue;
            }

            for (let m = 0; m < allSubsets.length; m++) {
                // Same subset as the one that matched, skipping
                if (m === s) {
                    continue;
                }

                // The subset does not have 2 possible cells for the candidate we are looking for
                if (possibleCellsByClues[m][i].length !== 2) {
                    continue;
                }

                // Two cells on the first subset;
                const a1 = possibleCellsByClues[s][i][0];
                const a2 = possibleCellsByClues[s][i][1];

                // Two cells on the second subset;
                const b1 = possibleCellsByClues[m][i][0];
                const b2 = possibleCellsByClues[m][i][1];

                // Both possible cells are on the same column, we got a match
                if (
                    a1.positionInSubset === b1.positionInSubset &&
                    a2.positionInSubset === b2.positionInSubset
                ) {
                    const m1 = removeCandidatesFromSubSet(
                        board,
                        String(i + 1),
                        // Line 1
                        allSubsets[s],
                        [a1.index, a2.index],
                        STRATEGY_NAME,
                    );
                    const m2 = removeCandidatesFromSubSet(
                        board,
                        String(i + 1),
                        // Line 2
                        allSubsets[m],
                        [b1.index, b2.index],
                        STRATEGY_NAME,
                    );
                    const m3 = removeCandidatesFromSubSet(
                        board,
                        String(i + 1),
                        // Gets the column for the first position in subset
                        getOtherSubset(a1.index),
                        [a1.index, b1.index],
                        STRATEGY_NAME,
                    );
                    const m4 = removeCandidatesFromSubSet(
                        board,
                        String(i + 1),
                        // Gets the column for the second position in subset
                        getOtherSubset(a2.index),
                        [a2.index, b2.index],
                        STRATEGY_NAME,
                    );

                    const move = m1 ?? m2 ?? m3 ?? m4;

                    if (move) {
                        return move;
                    }
                }
            }
        }
    }

    return null;
};

/*
Look for X-Wings
When two row or column have identical pair of candidates that see each others, they eliminate this candidate from other cells in the opposite row or column

xxxx2xx2x
----x--x-
----x--x-
xxxx2xx2x
----x--x-
----x--x-

Here the pair of 2s eliminate 2 as a candidate from the x cells
*/
export const xWing = (board: SolverBoard): Move | null => {
    const move = earlySuccess(
        () => checkSubSet(board, rowIndices, getColumn),
        () => checkSubSet(board, columnIndices, getRow),
    );

    if (move) {
        return move;
    }

    return null;
};
