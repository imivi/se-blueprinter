import { Mesh, Vector3 } from "three"
import { getBlockSignature } from "./misc"
import { BlockPoints } from "../types"
import { pointIsInsideOrNearMeshBT, pointIsInsideOrNearMesh } from "./point-utils"
import { MeshBT } from "./MeshBT"
import { getFaces } from "./get-faces"
import { Point } from "./Point"



export function analyzeBlock(block: Mesh, pointOffsets: Vector3[], raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): BlockPoints {

    const positions = pointOffsets.map(offset => block.position.clone().add(offset))
    let points: Point[] = []

    if (block instanceof MeshBT)
        points = positions.map(pos => pointIsInsideOrNearMeshBT(pos, block, raycastDirection, CLOSENESS_THRESHOLD))
    else {
        const faces = getFaces(block)
        points = positions.map(pos => pointIsInsideOrNearMesh(pos, block, faces, raycastDirection, CLOSENESS_THRESHOLD))
    }

    const signature = getBlockSignature(points)

    return { points, signature, name: block.name }
}
