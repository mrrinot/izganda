import React, { useEffect, useRef } from "react";

interface BoardEditorProps {
    boardName: string;
}

const BoardEditor = ({ boardName }: BoardEditorProps) => {
    const file = useRef<string | null>(null);

    useEffect(() => {
        (async () => {
            const data = await fetch(`boards/${boardName}`);

            file.current = await data.text();
        })();
    }, [boardName]);

    return <div>{boardName}</div>;
};

export default BoardEditor;
