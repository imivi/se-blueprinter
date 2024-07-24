import { Vector3 } from "three"
import { getBlockSignature } from "./misc"
import { MeshBT } from "./MeshBT"
import { BlockPoints, Point } from "../types"
import { pointIsInsideOrNearMesh } from "./point-utils"


export function getOffsetPositions(offsets: number[], blockCenter: Vector3): Vector3[] {

    const positions: Vector3[] = []
    for (let y = 0; y < offsets.length; y++) {
        for (let z = 0; z < offsets.length; z++) {
            for (let x = 0; x < offsets.length; x++) {
                const point = new Vector3(offsets[x], offsets[y], offsets[z])
                point.add(blockCenter)
                positions.push(point)
            }
        }
    }
    return positions
}


export function analyzeBlock(block: MeshBT, offsets: number[], raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): BlockPoints {

    const positions = getOffsetPositions(offsets, block.position)

    const points: Point[] = positions.map(pos => pointIsInsideOrNearMesh(pos, block, raycastDirection, CLOSENESS_THRESHOLD))

    const signature = getBlockSignature(points)

    return { points, signature, name: block.name }
}
