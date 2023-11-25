export interface SolverBoard {
    clues: Array<number>;
    candidates: Array<number>;
    emptyCellIndices: Array<number>;
}

// Index can clue can be null to indicate that a move just removed candidates and did not place a clue in.
export interface Move {
    // 0 based index between 0 and 80
    index: number | null;
    clue: number | null;
    strategy: string;
}

export interface MoveHistory {
    move: Move | null;
    board: SolverBoard;
}
