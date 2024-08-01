import { Point } from "./Point"

/** Compares two signatures, and returns true if the corners are the same (i.e. the first 8 points) */
export function compareCorners(signature1: string, signature2: string): boolean {
    for (let i = 0; i < 8; i++) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}

/** Compares two signatures, and returns true if the faces are the same (i.e. the last 6 points) */
export function compareFaces(signature1: string, signature2: string): boolean {
    for (let i = 32; i < 38; i++) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}


export function countSameCharacters(text1: string, text2: string, start: number, end: number): number {
    let sameCharacterCount = 0
    for (let i = start; i < end; i++) {
        if (text1[i] === text2[i])
            sameCharacterCount += 1
    }
    return sameCharacterCount
}


export function getSignature(points: Point[]): string {
    return points.map(point => point.isFull() ? "1" : "0").join("")
}
