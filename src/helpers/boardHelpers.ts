import { Move, SolverBoard } from "$types/Board";
import { getBox, getColumn, getRow } from "./tileHelpers";

const removeCandidatesForMove = (board: SolverBoard, move: Move) => {
    const row = getRow(move.index);

    // Looping on the row the tile is on.
    for (const rowTile of row) {
        board.candidates[rowTile][move.clue] = false;
    }

    const col = getColumn(move.index);

    // Looping on the column the tile is on.
    for (const colTile of col) {
        board.candidates[colTile][move.clue] = false;
    }

    const box = getBox(move.index);

    // Looping on the box the tile is on.
    for (const boxTile of box) {
        board.candidates[boxTile][move.clue] = false;
    }
};

export const removeInitialCluesCandidates = (board: SolverBoard) => {
    for (let i = 0; i < board.clues.length; i++) {
        const tile = board.clues[i];

        if (tile !== "-") {
            removeCandidatesForMove(board, {
                index: i,
                clue: tile,
                strategy: "",
            });
        }
    }
};

export const parseBoardFile = (file: string): SolverBoard => {
    const lines = file.split("\n");

    const res: SolverBoard = {
        clues: Array.from({ length: 81 }).map(() => "-"),
        candidates: Array.from({ length: 81 }).map(() => ({})),
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
            res.clues[y * 9 + x] = line[x];

            if (line[x] === "-") {
                res.candidates[y * 9 + x] = {
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                    5: true,
                    6: true,
                    7: true,
                    8: true,
                    9: true,
                };
            }
        }
    }

    removeInitialCluesCandidates(res);

    return res;
};

export const playMove = (board: SolverBoard, move: Move) => {
    board.clues[move.index] = move.clue;
    board.candidates[move.index] = {};
    removeCandidatesForMove(board, move);
};

export const boardToText = (clues: Array<string>) => {
    let ret = "";

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            ret += clues[x * 9 + y];
        }
        ret += "\n";
    }

    return ret;
};
