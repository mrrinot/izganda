import {
    checkCandidate,
    initCellWith,
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
            board.candidates[possibleCellsByClues[i][0]] = initCellWith([
                i + 1,
                otherClue + 1,
            ]);
            board.candidates[possibleCellsByClues[i][1]] = initCellWith([
                i + 1,
                otherClue + 1,
            ]);

            return removeCandidatesFromSubSet(
                board,
                `${i + 1}${otherClue + 1}`,
                subSet,
                possibleCellsByClues[i],
                STRATEGY_NAME,
            );
        }
    }

    return null;
};

/*
Look for hidden pairs.
A pair of candidates that can both only go in two cells, transforming them in naked pair by eliminating every other candidates from the two cells
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
