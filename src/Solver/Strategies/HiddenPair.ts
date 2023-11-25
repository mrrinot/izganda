import {
    checkCandidate,
    keepCandidates,
    removeCandidatesFromSubSet,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Hidden Pair";

const checkSubSet = (board: SolverBoard, subSet: Array<number>) => {
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
        if (possibleCellsByClues[i].length !== 2) {
            continue;
        }

        const otherClue = possibleCellsByClues.findIndex(
            (indices, i2) =>
                i !== i2 &&
                indices.join("") === possibleCellsByClues[i].join(""),
        );

        if (otherClue !== -1) {
            // Removing everything except for the new naked pair
            const changed1 = keepCandidates(
                board.candidates,
                possibleCellsByClues[i][0],
                [i + 1, otherClue + 1],
            );
            const changed2 = keepCandidates(
                board.candidates,
                possibleCellsByClues[i][1],
                [i + 1, otherClue + 1],
            );

            const changed3 = removeCandidatesFromSubSet(
                board,
                `${i + 1}${otherClue + 1}`,
                subSet,
                possibleCellsByClues[i],
                STRATEGY_NAME,
            );

            if (changed3) {
                return changed3;
            }

            if (changed1 || changed2) {
                return {
                    clue: null,
                    index: null,
                    strategy: STRATEGY_NAME,
                };
            }
        }
    }

    return false;
};

/*
Look for hidden pairs.
A pair of candidates that can both only go in two cells in a single subset, transforming them in naked pair by eliminating every other candidates from the two cells
Also removes the newly naked pair's candidates from other cells in the subset.
*/
export const hiddenPair = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const move = earlySuccess(
            () => checkSubSet(board, getRow(index)),
            () => checkSubSet(board, getColumn(index)),
            () => checkSubSet(board, getBox(index)),
        );

        if (move) {
            return move;
        }
    }

    return null;
};
