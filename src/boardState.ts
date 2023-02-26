import { proxy } from "valtio";
import { devtools } from "valtio/utils";

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

interface BoardState {
    clues: Array<number | null>;
    cornerHints: Array<Array<number>>;
    centerHints: Array<Array<number>>;
}

const defaultValue: BoardState = {
    clues: Array.from({ length: 81 }).map(() => null),
    cornerHints: Array.from({ length: 81 }).map(() => []),
    centerHints: Array.from({ length: 81 }).map(() => []),
};

export const boardState = proxy(defaultValue);

devtools(boardState, { name: "board", enabled: true });
