export const initCellCandidates = () => {
    let ret = 0;

    for (let i = 1; i <= 9; i++) {
        ret |= 1 << i;
    }

    return ret | (9 << 10);
};

export const getCandidatesCount = (candidates: number) => candidates >> 10;

export const checkCandidate = (candidates: number, clue: number) =>
    (candidates & (1 << clue)) !== 0;

export const removeCandidate = (candidates: number, clue: number) => {
    if (checkCandidate(candidates, clue)) {
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

export const initCellWith = (possibleCandidates: Array<number>) => {
    let ret = 0;

    for (let i = 0; i < possibleCandidates.length; i++) {
        ret |= 1 << possibleCandidates[i];
    }

    return ret | (possibleCandidates.length << 10);
};

export const getCellCandidates = (candidates: number) => {
    let ret = "";

    for (let i = 1; i <= 9; i++) {
        if (candidates & (1 << i)) {
            ret += String(i);
        }
    }

    return ret;
};

export const getFirstCandidate = (candidates: number) => {
    for (let i = 1; i <= 9; i++) {
        if (candidates & (1 << i)) {
            return i;
        }
    }

    return 1;
};
