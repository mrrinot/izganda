import { proxy } from "valtio";
import { devtools } from "valtio/utils";

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

interface EditorBoardState {
    clues: Array<number | null>;
    cornerHints: Array<Array<number>>;
    centerHints: Array<Array<number>>;
}

const defaultValue: EditorBoardState = {
    clues: Array.from({ length: 81 }).map(() => null),
    cornerHints: Array.from({ length: 81 }).map(() => []),
    centerHints: Array.from({ length: 81 }).map(() => []),
};

export const editorBoardState = proxy(defaultValue);

devtools(editorBoardState, { name: "editorBoard", enabled: true });
