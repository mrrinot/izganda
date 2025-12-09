import { Move, SolverBoard } from "$types/Board";
import { initCellCandidates, removeCandidate } from "./candidatesHelpers";
import { getBox, getColumn, getRow } from "./tileHelpers";

const removeCandidatesForMove = (board: SolverBoard, move: Move) => {
    if (move.clue === null || move.index === null) {
        return;
    }

    const row = getRow(move.index);

    // Looping on the row the tile is on.
    for (const rowTile of row) {
        removeCandidate(board.candidates, rowTile, move.clue);
    }

    const col = getColumn(move.index);

    // Looping on the column the tile is on.
    for (const colTile of col) {
        removeCandidate(board.candidates, colTile, move.clue);
    }

    const box = getBox(move.index);

    // Looping on the box the tile is on.
    for (const boxTile of box) {
        removeCandidate(board.candidates, boxTile, move.clue);
    }
};

export const removeInitialCluesCandidates = (board: SolverBoard) => {
    for (let i = 0; i < board.clues.length; i++) {
        const clue = board.clues[i];

        if (clue) {
            removeCandidatesForMove(board, {
                index: i,
                clue,
                strategy: "",
            });
        }
    }
};

export const parsePrettyBoardString = (file: string): SolverBoard => {
    const lines = file.split("\n");

    const res: SolverBoard = {
        clues: Array.from({ length: 81 }).map(() => 0),
        candidates: Array.from({ length: 81 }).map(() => 0),
        emptyCellIndices: [],
    };

    let realLineIndex = 0;

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];

        if (!line || line === "------+-------+------" || line[0] === "#") {
            continue;
        }

        const match = line.match(
            /^(?<one>[0-9\-.·]) (?<two>[0-9\-.·]) (?<three>[0-9\-.·]) \| (?<four>[0-9\-.·]) (?<five>[0-9\-.·]) (?<six>[0-9\-.·]) \| (?<seven>[0-9\-.·]) (?<eight>[0-9\-.·]) (?<nine>[0-9\-.·])/,
        );

        if (!match) {
            throw new Error(`Invalid line in board file, got ${line}`);
        }

        Object.values(match.groups!).forEach((val, x) => {
            const index = realLineIndex * 9 + x;

            const empty = [" ", "-", ".", "·"].includes(val);

            res.clues[index] = empty ? 0 : Number(val);

            if (empty) {
                res.emptyCellIndices.push(index);
                initCellCandidates(res.candidates, index);
            }
        });

        realLineIndex++;
    }

    removeInitialCluesCandidates(res);

    return res;
};

export const parseRawBoardFile = (file: string): SolverBoard => {
    const lines = file.split("\n");

    const res: SolverBoard = {
        clues: Array.from({ length: 81 }).map(() => 0),
        candidates: Array.from({ length: 81 }).map(() => 0),
        emptyCellIndices: [],
    };

    if (lines.length !== 9) {
        throw new Error(`Invalid input file: need 9 lines, got ${file}`);
    }

    for (let y = 0; y < 9; y++) {
        const line = lines[y];

        if (line.length !== 9) {
            throw new Error(`Invalid line in board file, got ${line}`);
        }

        for (let x = 0; x < 9 && x < line.length; x++) {
            const index = y * 9 + x;

            res.clues[index] = line[x] === "-" ? 0 : Number(line[x]);

            if (res.clues[index] === 0) {
                res.emptyCellIndices.push(index);
                initCellCandidates(res.candidates, index);
            }
        }
    }

    removeInitialCluesCandidates(res);

    return res;
};

export const playMove = (board: SolverBoard, move: Move) => {
    if (move.clue === null || move.index === null) {
        return;
    }

    board.clues[move.index] = move.clue;
    board.candidates[move.index] = 0;
    board.emptyCellIndices = board.emptyCellIndices.filter((a) => a !== move.index);

    removeCandidatesForMove(board, move);
};

export const boardToText = (clues: Array<number>) => {
    let ret = "";

    for (let x = 0; x < 9; x++) {
        if (x % 3 === 0 && x > 0) {
            ret += "------+-------+------\n";
        }

        for (let y = 0; y < 9; y++) {
            const clue = clues[x * 9 + y];

            if (y % 3 === 0 && y > 0) {
                ret += "| ";
            }

            ret += clue === 0 ? "·" : String(clue);

            if (y < 8) {
                ret += " ";
            }
        }
        if (x < 8) {
            ret += "\n";
        }
    }

    return ret;
};
