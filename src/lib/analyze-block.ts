import { Mesh, Triangle, Vector3 } from "three"
import { getBlockSignature } from "./misc"
import { BlockPoints, Point } from "../types"
import { pointIsInsideOrNearMeshBT, pointIsInsideOrNearMesh } from "./point-utils"
import { MeshBT } from "./MeshBT"
import { getFaces } from "./get-faces"


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


export function analyzeBlock(block: Mesh, offsets: number[], raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): BlockPoints {

    const positions = getOffsetPositions(offsets, block.position)

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



function getMeshFaces(mesh: Mesh): Triangle[] {

    const faces: Triangle[] = []

    // Below only works if the mesh IS INDEXED

    const index = mesh.geometry.getIndex()
    const position = mesh.geometry.getAttribute("position")

    if (index) {
        for (let i = 0; i < index.count; i += 3) {
            const vertexIndexes = [i, i + 1, i + 2]
            const [a, b, c] = vertexIndexes.map(i => {
                const x = position.getX(i)
                const y = position.getY(i)
                const z = position.getZ(i)
                return new Vector3(x, y, z)
            })
            const face = new Triangle(a, b, c)
            faces.push(face)
        }
    }
    return faces

    // Below only works if the mesh is NOT INDEXED

    /*
    for (let i = 0; i < position.count; i += 3) {
        const vertexIndexes = [i, i + 1, i + 2]
        const [a, b, c] = vertexIndexes.map(i => {
            const x = position.getX(i)
            const y = position.getY(i)
            const z = position.getZ(i)
            return new Vector3(x, y, z)
        })
        const face = new Triangle(a, b, c)
        faces.push(face)
    }

    return faces
    */
}
