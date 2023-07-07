import {
    checkCandidate,
    keepCandidates,
    removeCandidatesFromSubSet,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

// The hidden triple map does not match this, you have to disable the other strategies to test this one.
const STRATEGY_NAME = "Hidden Triple";

const checkSubSet = (
    board: SolverBoard,
    subSet: Array<number>,
    alreadyChecked: Array<number>,
) => {
    if (alreadyChecked.includes(subSet[0])) {
        return null;
    }

    alreadyChecked.push(subSet[0]);

    const possibleCellsByClues: Array<Array<number>> = Array.from({
        length: 9,
    }).map(() => []);

    for (let r = 0; r < subSet.length; r++) {
        for (let clue = 1; clue <= 9; clue++) {
            if (checkCandidate(board.candidates[subSet[r]], clue)) {
                possibleCellsByClues[clue - 1].push(subSet[r]);
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        const cellIndices = possibleCellsByClues[i];

        if (cellIndices.length !== 2 && cellIndices.length !== 3) {
            continue;
        }

        // This is doing the inverse of the Naked Triple in that we are storing the candidates in the array and are comparing the cell indices as matches
        // Here we store the candidates (which are the clues - 1 from above)
        const tripleCandidates: Array<number> = [i];

        // The 1/2/3 potential cell indices
        const cell1 = cellIndices[0];
        const cell2 = cellIndices[1];
        let cell3 = cellIndices[2] ?? -1;

        for (let y = 0; y < 9; y++) {
            if (i === y) {
                continue;
            }

            const otherIndices = possibleCellsByClues[y];

            if (otherIndices.length !== 2 && otherIndices.length !== 3) {
                continue;
            }

            const matches =
                (otherIndices.includes(cell1) ? 1 : 0) +
                (otherIndices.includes(cell2) ? 1 : 0) +
                (otherIndices.includes(cell3) ? 1 : 0);

            if (otherIndices.length === 3) {
                if (cell3 === -1) {
                    // Ex: we are looking for 12 and this is 128, we want to extract 8
                    if (matches === 2) {
                        // Extract the third number from the candidates
                        cell3 = otherIndices.find(
                            (ind) => ![cell1, cell2].includes(ind),
                        )!;

                        tripleCandidates.push(y);
                    }
                } else if (matches === 3) {
                    tripleCandidates.push(y);
                }
            } else if (otherIndices.length === 2) {
                if (cell3 === -1) {
                    // Ex: we are looking for 12 and this is 13, we want to extract 3
                    if (matches === 1) {
                        // Extract the third number from the candidates
                        cell3 = otherIndices.find(
                            (ind) => ![cell1, cell2].includes(ind),
                        )!;

                        tripleCandidates.push(y);
                    }
                } else if (matches === 2) {
                    tripleCandidates.push(y);
                }
            }
        }

        if (tripleCandidates.length === 3) {
            // Removing everything except for the new naked pair
            board.candidates[cell1] = keepCandidates(
                board.candidates[cell1],
                tripleCandidates.map((p) => p + 1),
            );
            board.candidates[cell2] = keepCandidates(
                board.candidates[cell2],
                tripleCandidates.map((p) => p + 1),
            );
            board.candidates[cell3] = keepCandidates(
                board.candidates[cell3],
                tripleCandidates.map((p) => p + 1),
            );

            return removeCandidatesFromSubSet(
                board,
                tripleCandidates.map((p) => p + 1).join(""),
                subSet,
                [cell1, cell2, cell3],
                STRATEGY_NAME,
            );
        }
    }

    return null;
};

/*
Look for hidden triples.
Three candidates that can only go in tree cells, transforming them in naked triple by eliminating every other candidates from the three cells
*/
export const hiddenTriple = (board: SolverBoard): Move | null => {
    const rowChecks: Array<number> = [];
    const colChecks: Array<number> = [];
    const boxChecks: Array<number> = [];

    for (const index of board.emptyCellIndices) {
        const move = earlySuccess(
            () => checkSubSet(board, getRow(index), rowChecks),
            () => checkSubSet(board, getColumn(index), colChecks),
            () => checkSubSet(board, getBox(index), boxChecks),
        );

        if (move) {
            return move;
        }
    }

    return null;
};
