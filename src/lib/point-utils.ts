import { MeshBT } from "./MeshBT";
import { Vector3, Mesh, Raycaster } from "three"


type PointData = {
    position: Vector3
    inside: boolean
    near: boolean | null
}

export function pointIsInsideOrNearMesh(pos: Vector3, mesh: MeshBT, raycastDirection: Vector3, CLOSENESS_THRESHOLD: number): PointData {
    const { inside } = pointIsInsideMesh(pos, mesh, raycastDirection)
    const near = inside ? null : pointIsNearMeshSurface(pos, mesh, CLOSENESS_THRESHOLD)
    return {
        position: pos,
        inside,
        near,
    }
}



type PointInside = {
    inside: boolean
    distance: number | null
}

export function pointIsInsideMesh(position: Vector3, mesh: MeshBT, raycastDirection: Vector3): PointInside {
    const intersections = getIntersections(position, mesh, raycastDirection)

    if (intersections.length === 0) {
        return {
            inside: false,
            distance: null,
        }
    }

    const firstIntersection = intersections[0]

    const distance = firstIntersection.point.distanceTo(position)
    const inside = !!(firstIntersection.face && firstIntersection.face?.normal.dot(raycastDirection) > 0)

    return {
        inside,
        distance,
    }
}


export function pointIsNearMeshSurface(point: Vector3, mesh: MeshBT, CLOSENESS_THRESHOLD: number): boolean {
    const distance = getPointDistanceToMesh(point, mesh)
    if (distance)
        return distance.distanceToMesh < CLOSENESS_THRESHOLD
    return false
}


type Distance = {
    pointOnMesh: Vector3
    distanceToMesh: number
}

export function getPointDistanceToMesh(point: Vector3, mesh: MeshBT, min = 0, max = 1): Distance | null {

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


export function getIntersections(point: Vector3, mesh: Mesh, direction: Vector3) {
    const raycaster = new Raycaster(point, direction)
    const intersections = raycaster.intersectObject(mesh)

    return intersections
}
