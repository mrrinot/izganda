import { describe, it, expect } from "vitest";
import { boardToText, parsePrettyBoardString } from "$src/helpers/boardHelpers";
import { getCellCandidates } from "$src/helpers/candidatesHelpers";
import { nakedSingle } from "$src/Solver/Strategies/NakedSingle";

const boardStr = `
#       v Naked Single here
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

describe("NakedSingle strategy", () => {
    it("should find the first naked single", () => {
        const board = parsePrettyBoardString(boardStr);

        expect(getCellCandidates(3)).toMatchInlineSnapshot(`"1"`);

        const move = nakedSingle(board);

        expect(move).toMatchInlineSnapshot(`
          {
            "clue": 1,
            "index": 3,
            "strategy": "Naked Single",
          }
            `);

        expect(boardToText(board.clues)).toMatchInlineSnapshot(`
          "# Filler Header
          7 2 · | 1 9 6 | · · 3
          · · · | 2 · 5 | · · ·
          · 8 · | · · 4 | · 2 ·
          ------+-------+------
          · · · | · · · | · 6 ·
          1 · 6 | 5 · 3 | 8 · 7
          · 4 · | · · · | · · ·
          ------+-------+------
          · 3 · | 8 · · | · 9 ·
          · · · | 7 · 2 | · · ·
          2 · · | 4 3 · | · 1 8"
        `);
    });
});
