import { Move, SolverBoard } from "$types/Board";
import { initCellCandidates, removeCandidate } from "./candidatesHelpers";
import { getBox, getColumn, getRow } from "./tileHelpers";

const removeCandidatesForMove = (board: SolverBoard, move: Move) => {
    const row = getRow(move.index);

    // Looping on the row the tile is on.
    for (const rowTile of row) {
        board.candidates[rowTile] = removeCandidate(
            board.candidates[rowTile],
            move.clue,
        );
    }

    const col = getColumn(move.index);

    // Looping on the column the tile is on.
    for (const colTile of col) {
        board.candidates[colTile] = removeCandidate(
            board.candidates[colTile],
            move.clue,
        );
    }

    const box = getBox(move.index);

    // Looping on the box the tile is on.
    for (const boxTile of box) {
        board.candidates[boxTile] = removeCandidate(
            board.candidates[boxTile],
            move.clue,
        );
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

export const parseBoardFile = (file: string): SolverBoard => {
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
                res.candidates[index] = initCellCandidates();
            }
        }
    }

    removeInitialCluesCandidates(res);

    return res;
};

export const playMove = (board: SolverBoard, move: Move) => {
    board.clues[move.index] = move.clue;
    board.candidates[move.index] = 0;
    board.emptyCellIndices = board.emptyCellIndices.filter(
        (a) => a !== move.index,
    );

    removeCandidatesForMove(board, move);
};

export const boardToText = (clues: Array<number>) => {
    let ret = "";

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const clue = clues[x * 9 + y];

            ret += clue === 0 ? "-" : String(clue);
        }
        ret += "\n";
    }

    return ret;
};
