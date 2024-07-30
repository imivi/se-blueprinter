/** Compares two signatures, and returns true if the corners are the same (i.e. the first 8 points) */
export function sameCorners(signature1: string, signature2: string): boolean {
    for (let i = 0; i < 8; i++) {
        if (signature1[i] !== signature2[i])
            return false
    }
    return true
}
