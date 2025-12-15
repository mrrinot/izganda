import { describe, it, expect } from "vitest";
import { parsePrettyBoardString } from "$src/helpers/boardHelpers";
import { getCellCandidates } from "$src/helpers/candidatesHelpers";
import { hiddenSingle } from "$src/Solver/Strategies/HiddenSingle";

const boardStr = `
#comment here
7 2 · | · 9 6 | · · 3
· · · | 2 · 5 | · · ·
· 8 · | · · 4 | · 2 ·
------+-------+------
· · · | · · · | · 6 ·
1 · 6 | 5 · 3 | 8 · 7
· 4 · | · · · | · · ·
------+-------+------
· 3 · | 8 · · | · 9 ·
· · · | 7 · 2 | · · ·
2 · · | 4 3 · | · 1 8
`;

describe("HiddenSingle strategy", () => {
    it("should convert old text to new text", () => {
        const board = parsePrettyBoardString(boardStr);

        // console.log("WTF", board.emptyCellIndices, board.candidates.map(getCellCandidates));
        expect(getCellCandidates(3)).toMatchInlineSnapshot(`"1"`);

        const move = hiddenSingle(board);

        expect(move).toMatchInlineSnapshot(`
          {
            "clue": 1,
            "index": 3,
            "strategy": "Naked Single",
          }
        `);

        expect(board.clues[3]).toMatchInlineSnapshot(`1`);
    });
});
