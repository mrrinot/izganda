import { playMove } from "$src/helpers/boardHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Hidden Single";

export const hiddenSingle = (board: SolverBoard): Move | null => {
    const testedRows: Array<string> = [];
    const testedColumns: Array<string> = [];
    const testedBoxes: Array<string> = [];

    for (let i = 0; i < board.clues.length; i++) {
        const clue = board.clues[i];

        if (clue !== "-") {
            // eslint-disable-next-line no-continue
            continue;
        }

        for (let c = 1; c < 9; c++) {
            if (!board.candidates[i][c]) {
                // eslint-disable-next-line no-continue
                continue;
            }

            const checkSubSet = (
                subSet: Array<number>,
                testedSubsets: Array<string>,
            ) => {
                let cpt = 0;

                // Check if we already searched this subset (row/col/box) for this hidden single
                if (testedSubsets.includes(`${c}-${subSet[0]}`)) {
                    return null;
                }

                for (let r = 0; r < subSet.length; r++) {
                    if (board.candidates[subSet[r]][c]) {
                        cpt++;
                    }

                    // More than 1 candidate present in subset, no hidden possible
                    if (cpt > 1) {
                        testedSubsets.push(`${c}-${subSet[0]}`);
                        return null;
                    }
                }

                // We found the hidden single
                const move: Move = {
                    clue: String(c),
                    index: i,
                    strategy: STRATEGY_NAME,
                };

                playMove(board, move);

                return move;
            };

            const move = earlySuccess(
                () => checkSubSet(getRow(i), testedRows),
                () => checkSubSet(getColumn(i), testedColumns),
                () => checkSubSet(getBox(i), testedBoxes),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
