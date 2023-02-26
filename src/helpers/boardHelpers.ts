import { SolverBoard } from "$types/Board";

export const parseBoardFile = (file: string): SolverBoard => {
    const lines = file.split("\n");

    const res: SolverBoard = {
        clues: Array.from({ length: 81 }).map(() => "-"),
        candidates: Array.from({ length: 81 }).map(() => []),
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
        }
    }

    return res;
};
