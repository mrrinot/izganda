import { MoveHistory } from "$types/Board";
import React from "react";

interface MoveHistoryListProps {
    moveHistory: Array<MoveHistory>;
}

const MoveHistoryList = ({ moveHistory }: MoveHistoryListProps) => (
    <div sx={{ padding: "8px" }}>
        <div variant="h5">Moves</div>
        <div>
            {moveHistory.map(({ move }, index) => (
                <div key={index}>
                    {move ? (
                        <div>
                            {move.index} {move.clue} {move.strategy}
                        </div>
                    ) : (
                        "No move just removing stuff"
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default MoveHistoryList;
