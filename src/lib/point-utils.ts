import { Vector3, Mesh, Raycaster, Triangle, BufferGeometry } from "three"
import { MeshBT } from "./MeshBT"
import { Point } from "./Point"



export function pointIsInsideOrNearMeshBT(pos: Vector3, mesh: MeshBT, raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): Point {
    const { inside } = pointIsInsideMesh(pos, mesh, raycastDirection)
    let near = null
    if (inside) {
        near = pointIsNearMeshSurfaceBT(pos, mesh, CLOSENESS_THRESHOLD)
    }
    return new Point(pos, inside, near)
}

export function pointIsInsideOrNearMesh(pos: Vector3, mesh: Mesh, meshFaces: Triangle[], raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): Point {
    const { inside } = pointIsInsideMesh(pos, mesh, raycastDirection)
    let near = null
    if (!inside) {
        near = pointIsNearMeshSurface(pos, mesh, meshFaces, CLOSENESS_THRESHOLD)
    }
    return new Point(pos, inside, near)
}


type PointInside = {
    inside: boolean
    distance: number | null
}

export function pointIsInsideMesh(position: Vector3, mesh: Mesh, raycastDirection: Vector3): PointInside {
    const intersections = getIntersections(position, mesh, raycastDirection)

    if (intersections.length === 0) {
        return {
            inside: false,
            distance: null,
        }
    }

    const firstIntersection = intersections[0]

    const distance = firstIntersection.point.distanceTo(position)
    // The dot product between the face normal and the raycast direction is positive when the two vectors are aligned
    const inside = !!(firstIntersection.face && firstIntersection.face?.normal.dot(raycastDirection) > 0)

    return {
        inside,
        distance,
    }
}


export function pointIsNearMeshSurfaceBT(point: Vector3, mesh: MeshBT, CLOSENESS_THRESHOLD: number): boolean {

    const result = getPointDistanceToMeshBT(point, mesh)

    return !!result && result.distanceToMesh < CLOSENESS_THRESHOLD
}

export function pointIsNearMeshSurface(point: Vector3, mesh: Mesh, meshFaces: Triangle[], CLOSENESS_THRESHOLD: number): boolean {
    const result = getPointDistanceToMesh(point, mesh, meshFaces)
    return !!result && result.distanceToMesh < CLOSENESS_THRESHOLD
}

type Distance = {
    pointOnMesh: Vector3
    distanceToMesh: number
}

export function getPointDistanceToMeshBT(point: Vector3, mesh: MeshBT, min = 0, max = 1): Distance | null {

    // 1. convert the world position of the point to the mesh's local space
    // 2. find the closest point to the mesh (this is in local space)
    // 3. convert the local space back to world position

    const tempResult = {
        point: new Vector3(0, 0, 0),
        distance: -1,
        faceIndex: -1,
    }

    const sourceLocal = point.clone()
    mesh.worldToLocal(sourceLocal)

    // @ts-expect-error ...
    mesh.geometry.boundsTree.closestPointToPoint(
        sourceLocal,
        tempResult,
        min,
        max,
    )

    if (tempResult.distance === -1) {
        return null
    }

    const targetWorld = tempResult.point.clone()
    mesh.localToWorld(targetWorld)

    return {
        distanceToMesh: tempResult.distance,
        pointOnMesh: targetWorld,
    }
}


export function getPointDistanceToMesh(point: Vector3, mesh: Mesh, meshFaces: Triangle[]): Distance | null {

    // 1. convert the world position of the point to the mesh's local space
    // 2. find the closest point to the mesh (this is in local space)
    // 3. convert the local space back to world position

    const bestResult = {
        point: new Vector3(0, 0, 0),
        distance: 0,
    }
    const tempResult = new Vector3(0, 0, 0)

    const sourceLocal = point.clone()
    mesh.worldToLocal(sourceLocal)

    for (const face of meshFaces) {
        face.closestPointToPoint(sourceLocal, tempResult)
        const distance = sourceLocal.distanceTo(tempResult)

        // console.log({ face, from: sourceLocal, to: tempResult }, "distance:", distance)

        if (!Number.isNaN(distance))
            if (distance < bestResult.distance || bestResult.distance === 0) {
                // console.log({ distance, bestResult })
                bestResult.distance = distance
                bestResult.point.set(tempResult.x, tempResult.y, tempResult.z)
            }
    }

    const targetWorld = bestResult.point.clone()
    mesh.localToWorld(targetWorld)

    const result = {
        distanceToMesh: bestResult.distance,
        pointOnMesh: targetWorld,
    }

    // console.log("Result", result)
    return result
}


export function getIntersections(point: Vector3, mesh: Mesh, direction: Vector3) {
    const raycaster = new Raycaster(point, direction)
    const intersections = raycaster.intersectObject(mesh)

    return intersections
}
