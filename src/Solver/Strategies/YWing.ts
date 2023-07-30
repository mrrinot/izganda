import {
    checkCandidate,
    getCandidatesCount,
    getCellCandidates,
    removeCandidatesFromSubSet,
} from "$src/helpers/candidatesHelpers";
import { earlySuccess } from "$src/helpers/functions";
import {
    getColumn,
    getRow,
    getBox,
    getTilesSeenBy,
} from "$src/helpers/tileHelpers";
import { Move, SolverBoard } from "$types/Board";

// The hidden triple map does not match this, you have to disable the other strategies to test this one.
const STRATEGY_NAME = "YWing";

const checkSubSet = (
    board: SolverBoard,
    index: number,
    // For example: 38
    pair: string,
    // These are named like that, but they are purely interchangeable
    row: Array<number>,
    col: Array<number>,
    box: Array<number>,
) => {
    // Ex: 3
    const c1 = pair[0];
    // Ex: 8
    const c2 = pair[1];

    for (const s1 of row) {
        const second = getCellCandidates(board.candidates[s1]);

        let lookingFor: string;

        if (s1 === index || second.length !== 2 || second === pair) {
            continue;
        }

        // Assume we are starting with 38
        // Second is 34, the 3 matches
        if (second[0] === c1) {
            // We are looking for 48 then
            lookingFor = second[1] + c2;
        }
        // Second is 89, the 8 matches
        else if (second[0] === c2) {
            // We are looking for 39 then
            lookingFor = second[1] + c1;
        }
        // Second is 13, the 3 matches
        else if (second[1] === c1) {
            // We are looking for 18 then
            lookingFor = second[0] + c2;
        }
        // Second is 28, the 8 matches
        else if (second[1] === c2) {
            // We are looking for 23 then
            lookingFor = second[0] + c1;
        }
        // Second has both digit not match a single one of the original pair, ignore
        else {
            continue;
        }

        console.log(
            "HAVING PAIR",
            pair,
            "and second one is",
            second,
            "looking for ",
            lookingFor,
        );

        const checkSecondSubset = (secondSubset: Array<number>) => {
            for (const s2 of secondSubset) {
                const third = getCellCandidates(board.candidates[s2]);

                if (s2 === index || s2 === s1 || third.length !== 2) {
                    continue;
                }

                // Have to use `includes` because `lookingFor` might not be ordered like the candidates (could be 81)
                if (
                    lookingFor.includes(third[0]) &&
                    lookingFor.includes(third[1])
                ) {
                    console.log(
                        "Y WING FOUND ON",
                        pair,
                        "with",
                        second,
                        "and",
                        third,
                        index,
                        s1,
                        s2,
                    );

                    const tilesSeen = getTilesSeenBy(s1, s2);
                    console.log("WE CAN REMOVE FROm", tilesSeen);
                    // WE HAVE A Y-WING
                }
            }
        };

        return earlySuccess(
            () => checkSecondSubset(col),
            () => checkSecondSubset(box),
        );
    }
};

/*
Look for Y-Wings
A Y-wing appear when 3 naked pairs "see" each other and are comprised of 3 different candidates A, B and C
No matter what the anchor (the pair in the middle) would be (A or B), one of the 2 prongs would then be C, so any cells that "see" both prongs, cannot be C

----AB--BC-
----------
----------
----AC--C-
----------
----------
*/
export const yWing = (board: SolverBoard): Move | null => {
    for (const index of board.emptyCellIndices) {
        const pair = getCellCandidates(board.candidates[index]);

        if (pair.length === 2) {
            const row = getRow(index);
            const col = getColumn(index);
            const box = getBox(index);

            const move = earlySuccess(
                () => checkSubSet(board, index, pair, row, col, box),
                () => checkSubSet(board, index, pair, col, row, box),
                () => checkSubSet(board, index, pair, box, col, row),
            );

            if (move) {
                return move;
            }
        }
    }

    return null;
};
