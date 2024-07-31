import { Point } from "./Point"

/** Compares two signatures, and returns true if the corners are the same (i.e. the first 8 points) */
export function compareCorners(signature1: string, signature2: string): boolean {
    for (let i = 0; i < 8; i++) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}



export function countSameCharacters(text1: string, text2: string): number {
    let sameCharacterCount = 0
    for (let i = 0; i < text1.length; i++) {
        if (text1[i] === text2[i])
            sameCharacterCount += 1
    }
    return sameCharacterCount
}


export function getSignature(points: Point[]): string {
    return points.map(point => point.isFull() ? "1" : "0").join("")
}
