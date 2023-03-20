import { playMove } from "$src/helpers/boardHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Single";

export const nakedSingle = (board: SolverBoard): Move | null => {
    for (let i = 0; i < board.candidates.length; i++) {
        const possibles = Object.entries(board.candidates[i]).filter(
            ([, isPossible]) => isPossible,
        );

        if (possibles.length === 1) {
            const move: Move = {
                clue: possibles[0][0],
                index: i,
                strategy: STRATEGY_NAME,
            };

            playMove(board, move);

            return move;
        }
    }

    return null;
};
