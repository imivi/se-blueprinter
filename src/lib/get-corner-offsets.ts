
// If signature is 3x3x3, the corners are indexes are:
const indexes3x3x3 = [
    0, 2, 6, 8,
    18, 20, 24, 26,
]

// If signature is 4x4x4, the indexes for the corner positions are:
const indexes4x4x4 = [
    0, 3, 12, 15,
    48, 51, 60, 63,
]


export function getCornerOffsets(patternLength: number): number[] {

    if (patternLength === 3 || patternLength === 3 * 3 * 3)
        return indexes3x3x3

    if (patternLength === 4 || patternLength === 4 * 4 * 4)
        return indexes4x4x4

    throw new Error("Pattern must have length of 3 or 4, received " + patternLength.toString())
}