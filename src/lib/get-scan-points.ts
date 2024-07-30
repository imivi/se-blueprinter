/*
32-char signature



*/

const points = [
    [0, "corner"],
    [1, "edge"],
    [2, "edge"],
    [3, "corner"],
    [4, "edge"],
    [5, "edge"],
    [6, "edge"],
    [7, "edge"],
    [8, "corner"],
    [9, "edge"],
    [10, "edge"],
    [11, "corner"],
    [12, "edge"],
    [13, "edge"],
    [14, "edge"],
    [15, "edge"],
    [16, "edge"],
    [17, "edge"],
    [18, "edge"],
    [19, "edge"],
    [20, "corner"],
    [21, "edge"],
    [22, "edge"],
    [23, "corner"],
    [24, "edge"],
    [25, "edge"],
    [26, "edge"],
    [27, "edge"],
    [28, "corner"],
    [29, "edge"],
    [30, "edge"],
    [31, "corner"],
] as const

const cornerPoints = points.filter(point => point[1] === "corner").map(point => point[0])
const edgePoints = points.filter(point => point[1] === "edge").map(point => point[0])


type PointIndexes = {
    corners: number[]
    edges: number[]
    faces: number[]
    center: number[]
}

const indexes3x3x3: PointIndexes = {
    // If signature is 3x3x3, the corners are indexes are:
    corners: [
        0, 2, 6, 8,
        18, 20, 24, 26,
    ],
    edges: [
        1, 3, 5, 7,
        10, 12, 14, 16,
        19, 21, 23, 25,
    ],
    faces: [
        4, 10, 12, 14, 16, 22,
    ],
    center: [13],
}

const indexes4x4x4: PointIndexes = {
    corners: [
        0, 3, 12, 15,
        48, 51, 60, 63,
    ],
    edges: [
        1, 2, 4, 7,
        8, 11, 13, 14,
        16, 19, 28, 31,
        32, 35, 44, 47,
        49, 50, 52, 55,
        56, 59, 61, 62,
    ],
    faces: [
        5, 6, 9, 10,
        17, 18, 33, 34,
        20, 24, 36, 40,
        23, 27, 39, 43,
        29, 30, 45, 46,
        53, 54, 57, 58,
    ],
    center: [
        21, 22, 25, 26,
        37, 38, 41, 42,
    ],
}


export type PointFeature = keyof PointIndexes

export function getScanPoints(Feature: PointFeature, patternLength: number): number[] {

    if (patternLength === 3 || patternLength === 3 * 3 * 3)
        return indexes3x3x3[Feature]

    if (patternLength === 4 || patternLength === 4 * 4 * 4)
        return indexes4x4x4[Feature]

    throw new Error("Pattern must have length of 3 or 4, received " + patternLength.toString())
}