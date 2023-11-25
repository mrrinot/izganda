import { Move, SolverBoard } from "$types/Board";
import { playMove } from "./boardHelpers";

export const initCellCandidates = (
    candidates: Array<number>,
    index: number,
) => {
    candidates[index] = 0;

    for (let i = 1; i <= 9; i++) {
        candidates[index] |= 1 << i;
    }

    candidates[index] |= 9 << 10;
};

export const getCandidatesCount = (candidates: number) => candidates >> 10;

export const checkCandidate = (candidates: number, clue: number) =>
    (candidates & (1 << clue)) !== 0;

export const removeCandidate = (
    boardCandidates: Array<number>,
    index: number,
    clue: number,
) => {
    if (checkCandidate(boardCandidates[index], clue)) {
        let ret = 0;

        for (let i = 1; i <= 9; i++) {
            if ((boardCandidates[index] >> i) % 2 && i !== clue) {
                ret |= 1 << i;
            }
        }

        boardCandidates[index] =
            ret | ((getCandidatesCount(boardCandidates[index]) - 1) << 10);

        return true;
    }

    return false;
};

export const initCellWith = (possibleCandidates: Array<number>) => {
    let ret = 0;

    for (let i = 0; i < possibleCandidates.length; i++) {
        ret |= 1 << possibleCandidates[i];
    }

    return ret | (possibleCandidates.length << 10);
};

export const keepCandidates = (
    boardCandidates: Array<number>,
    index: number,
    candidatesKept: Array<number>,
) => {
    let ret = 0;
    let count = 0;

    for (let i = 1; i <= 9; i++) {
        if (
            checkCandidate(boardCandidates[index], i) &&
            candidatesKept.includes(i)
        ) {
            ret |= 1 << i;
            count++;
        }
    }

    ret |= count << 10;

    if (ret === boardCandidates[index]) {
        return false;
    }

    boardCandidates[index] = ret;
    return true;
};

export const getCellCandidates = (candidates: number) => {
    let ret = "";

    for (let i = 1; i <= 9; i++) {
        if (candidates & (1 << i)) {
            ret += String(i);
        }
    }

    return ret;
};

export const getFirstCandidate = (candidates: number) => {
    for (let i = 1; i <= 9; i++) {
        if (candidates & (1 << i)) {
            return i;
        }
    }

    return 1;
};

export const removeCandidatesFromSubSet = (
    board: SolverBoard,
    candidates: string,
    subSet: Array<number>,
    excludedIndices: Array<number>,
    strategy: string,
) => {
    let ret: Move | null = null;

    for (let m = 0; m < subSet.length; m++) {
        const count = getCandidatesCount(board.candidates[subSet[m]]);

        if (count > 0 && !excludedIndices.includes(subSet[m])) {
            for (let i = 0; i < candidates.length; i++) {
                const removed = removeCandidate(
                    board.candidates,
                    subSet[m],
                    Number(candidates[i]),
                );

                if (!ret && removed) {
                    ret = {
                        clue: null,
                        index: null,
                        strategy,
                    };
                }
            }

            if (getCandidatesCount(board.candidates[subSet[m]]) === 1) {
                const move: Move = {
                    clue: Number(
                        getFirstCandidate(board.candidates[subSet[m]]),
                    ),
                    index: subSet[m],
                    strategy,
                };
                playMove(board, move);

                return move;
            }
        }
    }

    return ret;
};
