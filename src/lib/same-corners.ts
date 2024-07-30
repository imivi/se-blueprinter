import { getScanPoints } from "./get-scan-points"

/** Compares two signatures, and returns true if the corners are the same */
export function sameCorners(signature1: string, signature2: string): boolean {
    const indexes = getScanPoints("corners", signature1.length)
    for (const i of indexes) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}


/** Compares two signatures, and returns true if the corners are the same.
 * 32-char signature version
 */
export function sameCorners32(signature1: string, signature2: string): boolean {
    for (const i of cornerIndexes32) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}

const cornerIndexes32 = [
    0, 3, 8, 11,
    20, 23, 28, 31
]