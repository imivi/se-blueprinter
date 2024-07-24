import { getCornerOffsets } from "./get-corner-offsets";

/** Compares two signatures, and returns true if the corners are the same */
export function sameCorners(signature1: string, signature2: string): boolean {
    const indexes = getCornerOffsets(signature1.length)
    for (const i of indexes) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}