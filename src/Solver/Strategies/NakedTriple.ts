import { playMove } from "$src/helpers/boardHelpers";
import {
    removeCandidate,
    getCellCandidates,
    getCandidatesCount,
    getFirstCandidate,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import { getBox, getColumn, getRow } from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

const STRATEGY_NAME = "Naked Triple";

const removeTripleFromSubSet = (
    board: SolverBoard,
    triple: string,
    subSet: Array<number>,
    tripleIndices: [number, number, number],
) => {
    for (let m = 0; m < subSet.length; m++) {
        const count = getCandidatesCount(board.candidates[subSet[m]]);

        if (count > 0 && !tripleIndices.includes(subSet[m])) {
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                Number(triple[0]),
            );
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                Number(triple[1]),
            );
            board.candidates[subSet[m]] = removeCandidate(
                board.candidates[subSet[m]],
                Number(triple[2]),
            );

            if (getCandidatesCount(board.candidates[subSet[m]]) === 1) {
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
    tripleOrPair: string,
    subSet: Array<number>,
) => {
    const candidate1 = tripleOrPair[0];
    const candidate2 = tripleOrPair[1];
    let candidate3 = tripleOrPair[2] ?? "0";

    const tripleIndices = [];

    for (let r = 0; r < subSet.length; r++) {
        if (getCandidatesCount(board.candidates[subSet[r]]) === 0) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const candidates = getCellCandidates(board.candidates[subSet[r]]);

        // Check for exact match
        if (tripleOrPair === candidates) {
            tripleIndices.push(subSet[r]);
        } else {
            const matches =
                (candidates.includes(candidate1) ? 1 : 0) +
                (candidates.includes(candidate2) ? 1 : 0) +
                (candidates.includes(candidate3) ? 1 : 0);

            if (candidates.length === 3) {
                if (candidate3 === "0") {
                    // Ex: we are looking for 12 and this is 128, we want to extract 8
                    if (matches === 2) {
                        // Extract the third number from the candidates
                        candidate3 = candidates
                            .replace(candidate1, "")
                            .replace(candidate2, "");

                        tripleIndices.push(subSet[r]);
                    }
                }
            } else if (candidates.length === 2) {
                if (candidate3 === "0") {
                    // Ex: we are looking for 12 and this is 13, we want to extract 3
                    if (matches === 1) {
                        // Extract the third number from the candidates
                        candidate3 = candidates
                            .replace(candidate1, "")
                            .replace(candidate2, "");

                        tripleIndices.push(subSet[r]);
                    }
                } else if (matches === 2) {
                    tripleIndices.push(subSet[r]);
                }
            }
        }

        if (tripleIndices.length === 3) {
            return removeTripleFromSubSet(
                board,
                `${candidate1}${candidate2}${candidate3}`,
                subSet,
                tripleIndices as [number, number, number],
            );
        }
    }
    return null;
};

/*
Look for naked triples
*/
export const nakedTriple = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const candidates = getCellCandidates(board.candidates[index]);

        if (candidates.length === 2 || candidates.length === 3) {
            const move = earlySuccess(
                () => checkSubSet(board, candidates, getRow(index)),
                () => checkSubSet(board, candidates, getColumn(index)),
                () => checkSubSet(board, candidates, getBox(index)),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
