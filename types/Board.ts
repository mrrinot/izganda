import ObjectOf from "./helpers/ObjectOf";

export interface SolverBoard {
    clues: Array<string>;
    candidates: Array<ObjectOf<boolean>>;
}

export interface Move {
    // 0 based index between 0 and 80
    index: number;
    clue: string;
    strategy: string;
}

export interface MoveHistory {
    move: Move;
    board: SolverBoard;
}
