import { Mesh, Vector3 } from "three"
import { getBlockSignature } from "./misc"
import { BlockPoints } from "../types"
import { pointIsInsideOrNearMeshBT, pointIsInsideOrNearMesh } from "./point-utils"
import { MeshBT } from "./MeshBT"
import { getFaces } from "./get-faces"
import { Point } from "./Point"


/*
function getOffsetPositions(offsets: number[], blockCenter: Vector3): Vector3[] {

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
*/


export function analyzeBlock(block: Mesh, pointOffsets: Vector3[], raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): BlockPoints {

    const positions = pointOffsets.map(offset => block.position.clone().add(offset))
    let points: Point[] = []

    if (block instanceof MeshBT)
        points = positions.map(pos => pointIsInsideOrNearMeshBT(pos, block, raycastDirection, CLOSENESS_THRESHOLD))
    else {
        const faces = getFaces(block)
        // console.info("Block mesh:", block)
        // console.info("Found faces:", faces)
        points = positions.map(pos => pointIsInsideOrNearMesh(pos, block, faces, raycastDirection, CLOSENESS_THRESHOLD))
    }

    const signature = getBlockSignature(points)

    return { points, signature, name: block.name }
}
