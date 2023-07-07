import { playMove } from "$src/helpers/boardHelpers";
import { checkCandidate } from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Hidden Single";

/*
Look for cells that have the only candidate possible for a given clue in each row/column/box
The difference with a naked single is that a naked single is a cell with ONLY ONE candidate possible.
A hidden single is a cell with multiple candidates but one of them can ONLY go in this specific cell related to its row/column/box
*/
export const hiddenSingle = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        for (let clue = 1; clue < 9; clue++) {
            if (!checkCandidate(board.candidates[index], clue)) {
                continue;
            }

            const checkSubSet = (subSet: Array<number>) => {
                let cpt = 0;

                for (let r = 0; r < subSet.length; r++) {
                    if (checkCandidate(board.candidates[subSet[r]], clue)) {
                        cpt++;
                    }

                    // More than 1 candidate present in subset, no hidden possible
                    if (cpt > 1) {
                        return null;
                    }
                }

                // We found the hidden single
                const move: Move = {
                    clue,
                    index,
                    strategy: STRATEGY_NAME,
                };

                playMove(board, move);

                return move;
            };

            const move = earlySuccess(
                () => checkSubSet(getRow(index)),
                () => checkSubSet(getColumn(index)),
                () => checkSubSet(getBox(index)),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
