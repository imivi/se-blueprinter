import { Vector3 } from "three"


/**
 * Returns an array of offsets that represent the positions of the corner and
 * edge points that must be scanned in order to analyze the shape of a block.
 * - The first 8 offsets represent the corner points
 * - The next 24 offsets represent the edge points
 * - The next 24 offsets represent the face points
 * - The next 4 offsets represent the center points
 */
export function getCornerEdgeCenterPatternOffsets(pattern: number[]): Vector3[] {

    const cornerOffsets: Vector3[] = []
    const edgeOffsets: Vector3[] = []
    // const faceOffsets: Vector3[] = []
    // const centerOffsets: Vector3[] = []

    function isCornerOrEdgeOrFace(index: number) {
        return index === 0 || index === pattern.length - 1
    }

    /*
    function isCenter(index: number) {
        // If the pattern is odd, the middle value is the center
        if (pattern.length % 2 === 1)
            return index === (pattern.length - 1) / 2

        // If the pattern is even, the middle two values are the center
        return (index === pattern.length / 2) || (index == pattern.length / 2 - 1)
    }
    */

    for (let i = 0; i < pattern.length; i++) {
        // const isCornerOrEdgeX = isCornerOrEdge(i)
        for (let j = 0; j < pattern.length; j++) {
            // const isCornerOrEdgeY = isCornerOrEdge(j)
            for (let k = 0; k < pattern.length; k++) {
                // const isCornerOrEdgeZ = isCornerOrEdge(k)

                // The corner positions have all (x,y,z) equal to 0 or the pattern length
                // The edge positions have at least 2 (x,y,z) equal to 0 or the pattern length

                // const cornersOrEdges = [isCornerOrEdgeX]
                const cornersOrEdges = [i, j, k].filter(pos => isCornerOrEdgeOrFace(pos))

                const pointIsCorner = cornersOrEdges.length === 3
                const pointIsEdge = cornersOrEdges.length === 2
                // const pointIsFace = cornersOrEdges.length === 1

                const x = pattern[i]
                const y = pattern[j]
                const z = pattern[k]

                if (pointIsCorner) {
                    cornerOffsets.push(new Vector3(x, y, z))
                }
                else if (pointIsEdge) {
                    edgeOffsets.push(new Vector3(x, y, z))
                }
                // else {
                //     const pointIsCenter = isCenter(i) && isCenter(j) && isCenter(k)
                //     if (pointIsCenter) {
                //         centerOffsets.push(new Vector3(x, y, z))
                //     }
                // }
                // Else do nothing, we only care about corner and edge and center points, not faces
            }
        }
    }

    // Add 6 face points
    const a = pattern[0]
    const b = pattern[pattern.length - 1]

    const faceOffsets = [
        new Vector3(a, 0, 0),
        new Vector3(b, 0, 0),
        new Vector3(0, a, 0),
        new Vector3(0, b, 0),
        new Vector3(0, 0, a),
        new Vector3(0, 0, b),
    ]

    // for (const x of offsets) {
    //     for (const y of offsets) {
    //         for (const z of offsets) {
    //             const pos = new Vector3(x, y, z)
    //             console.log("Face:", [x, y, z])
    //             faceOffsets.push(pos)
    //         }
    //     }
    // }

    // The first 8 offsets represent the corners, the next 24 offsets represent the edges
    return [...cornerOffsets, ...edgeOffsets, ...faceOffsets, /*...centerOffsets*/]
}
