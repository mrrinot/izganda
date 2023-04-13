export interface SolverBoard {
    clues: Array<number>;
    candidates: Array<number>;
    emptyCellIndices: Array<number>;
}

export interface Move {
    // 0 based index between 0 and 80
    index: number;
    clue: number;
    strategy: string;
}

export interface MoveHistory {
    move: Move | null;
    board: SolverBoard;
}
