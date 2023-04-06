import { playMove } from "$src/helpers/boardHelpers";
import {
    removeClue,
    getCandidateClues,
    getCandidatesCount,
    getFirstCandidate,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Pair";

const removePairFromSubSet = (
    board: SolverBoard,
    pair: string,
    subSet: Array<number>,
    pairIndices: [number, number],
) => {
    for (let m = 0; m < subSet.length; m++) {
        const count = getCandidatesCount(board.candidates[subSet[m]]);

        if (count > 0 && !pairIndices.includes(m)) {
            console.log(
                "REMOVING PAIR FROM",
                subSet[m],
                board.candidates[subSet[m]].toString(2),
            );
            board.candidates[subSet[m]] = removeClue(
                board.candidates[subSet[m]],
                Number(pair[0]),
            );
            board.candidates[subSet[m]] = removeClue(
                board.candidates[subSet[m]],
                Number(pair[1]),
            );

            if (getCandidatesCount(board.candidates[subSet[m]]) === 1) {
                console.log("ONLY ONE LEFT POSSIBLE");

                const move: Move = {
                    clue: Number(
                        getFirstCandidate(board.candidates[subSet[m]]),
                    ),
                    index: subSet[m],
                    strategy: STRATEGY_NAME,
                };
                playMove(board, move);

                return move;
            }
        }
    }

    return null;
};

const checkSubSet = (
    board: SolverBoard,
    pair: string,
    subSet: Array<number>,
    testedSubsets: Array<string>,
) => {
    const pairIndices = [];

    // Check if we already searched this subset (row/col/box) for this hidden single
    if (testedSubsets.includes(`${pair}-${subSet[0]}`)) {
        return null;
    }

    testedSubsets.push(`${pair}-${subSet[0]}`);

    for (let r = 0; r < subSet.length; r++) {
        if (getCandidateClues(board.candidates[subSet[r]]) === pair) {
            pairIndices.push(r);
        }

        if (pairIndices.length === 2) {
            console.log("FOUND NAKED PAIR", subSet);
            const move = removePairFromSubSet(board, pair, subSet, pairIndices);

            if (move) {
                return move;
            }

            break;
        }
    }
    return null;
};

/*
Look for naked pairs
*/
export const nakedPair = (board: SolverBoard): Move | null => {
    const rowPairs: Array<string> = [];
    const columnPairs: Array<string> = [];
    const boxPairs: Array<string> = [];

    for (const index of board.emptyCellIndices) {
        const candidatesCount = getCandidatesCount(board.candidates[index]);

        if (candidatesCount === 2) {
            const pair = getCandidateClues(board.candidates[index]);

            console.log("TESTING PAIR", pair);
            const move = earlySuccess(
                () => checkSubSet(board, pair, getRow(index), rowPairs),
                () => checkSubSet(board, pair, getColumn(index), columnPairs),
                () => checkSubSet(board, pair, getBox(index), boxPairs),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
