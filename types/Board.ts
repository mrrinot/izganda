import ObjectOf from "./helpers/ObjectOf";

export interface SolverBoard {
    clues: Array<string>;
    candidates: Array<ObjectOf<boolean>>;
}
