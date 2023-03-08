import { playMove } from "$src/helpers/boardHelpers";
import { Move, SolverBoard } from "$types/Board";

const STARTEGY_NAME = "Naked Single";

export const nakedCandidates = (board: SolverBoard): Move | null => {
    for (let i = 0; i < board.candidates.length; i++) {
        const possibles = Object.entries(board.candidates[i]).filter(
            ([, isPossible]) => isPossible,
        );

        if (possibles.length === 1) {
            const move: Move = {
                clue: possibles[0][0],
                index: i,
                strategy: STARTEGY_NAME,
            };

            playMove(board, move);

            return move;
        }
    }

    return null;
};
