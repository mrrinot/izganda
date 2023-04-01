export const initCandidates = () => {
    let ret = 0;

    for (let i = 1; i <= 9; i++) {
        ret |= 1 << i;
    }

    return ret | (9 << 10);
};

export const getCandidatesCount = (candidates: number) => candidates >> 10;

export const checkClue = (candidates: number, clue: number) =>
    (candidates >> clue) % 2 !== 0;

export const removeClue = (candidates: number, clue: number) => {
    if (checkClue(candidates, clue)) {
        let ret = 0;

        for (let i = 1; i <= 9; i++) {
            if ((candidates >> i) % 2 && i !== clue) {
                ret |= 1 << i;
            }
        }

        return ret | ((getCandidatesCount(candidates) - 1) << 10);
    }

    return candidates;
};

export const getCandidateClues = (candidates: number) => {
    const ret = [];

    for (let i = 1; i <= 9; i++) {
        if (candidates & (1 << i)) {
            ret.push(i);
        }
    }

    return ret;
};
