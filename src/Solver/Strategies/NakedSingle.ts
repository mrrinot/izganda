import { playMove } from "$src/helpers/boardHelpers";
import {
    getCandidatesCount,
    getFirstCandidate,
} from "$src/helpers/candidatesHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Single";

/*
Look for single candidates 
*/
export const nakedSingle = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const candidatesCount = getCandidatesCount(board.candidates[index]);

        if (candidatesCount === 1) {
            const move: Move = {
                clue: getFirstCandidate(board.candidates[index]),
                index,
                strategy: STRATEGY_NAME,
            };

            playMove(board, move);

            return move;
        }
    }

    return null;
};
