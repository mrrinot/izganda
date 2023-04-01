import { playMove } from "$src/helpers/boardHelpers";
import { checkClue, getCandidatesCount } from "$src/helpers/candidatesHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Single";

export const nakedSingle = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const candidatesCount = getCandidatesCount(board.candidates[index]);

        if (candidatesCount === 1) {
            for (let i = 1; i <= 9; i++) {
                if (checkClue(board.candidates[index], i)) {
                    const move: Move = {
                        clue: i,
                        index,
                        strategy: STRATEGY_NAME,
                    };

                    playMove(board, move);

                    return move;
                }
            }
        }
    }

    return null;
};
