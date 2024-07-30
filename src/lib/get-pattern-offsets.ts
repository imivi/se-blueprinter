import { Vector3 } from "three"


/**
 * Returns an array of offsets that represent the positions of the corner and
 * edge points that must be scanned in order to analyze the shape of a block.
 * - The first 8 offsets represent the corner points
 * - The next 24 offsets represent the edge points
 * - The next 6 offsets represent the face points
 * - The center points are not included
 */
export function getCornerEdgeCenterPatternOffsets(pattern: number[]): Vector3[] {

    const cornerOffsets: Vector3[] = []
    const edgeOffsets: Vector3[] = []

    function isCornerOrEdgeOrFace(index: number) {
        return index === 0 || index === pattern.length - 1
    }

    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern.length; j++) {
            for (let k = 0; k < pattern.length; k++) {
                const cornersOrEdges = [i, j, k].filter(pos => isCornerOrEdgeOrFace(pos))

                const pointIsCorner = cornersOrEdges.length === 3
                const pointIsEdge = cornersOrEdges.length === 2

                const x = pattern[i]
                const y = pattern[j]
                const z = pattern[k]

                if (pointIsCorner) {
                    cornerOffsets.push(new Vector3(x, y, z))
                }
                else if (pointIsEdge) {
                    edgeOffsets.push(new Vector3(x, y, z))
                }
                // Else do nothing, we only care about corner/edge/face points, not centers
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

    // The first 8 offsets represent the corners, the next 24 offsets represent the edges
    return [...cornerOffsets, ...edgeOffsets, ...faceOffsets]
}
