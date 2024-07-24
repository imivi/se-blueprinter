import { Vector3 } from "three";
import { getOffsetPositions } from "./analyze-block";
import { formatSignature, getBlockSignature } from "./misc";
import { MeshBT } from "./MeshBT";
import { getPointDistanceToMesh, pointIsInsideMesh } from "./point-utils";
import { MatchingBlock } from "../types";
import { getCornerOffsets } from "./get-corner-offsets";


type Point = {
    position: Vector3
    inside: boolean // using raycast
    near: boolean | null // using closestPointToPoint
}

export class GridSpace {

    private pattern: number[] = []
    public points: (Point | null)[] = []
    // public meshesScanned: number[] = []
    // public parentMeshIndex: number | null = null
    public parentMeshes: number[] = []
    // public meshesToScan: number[] = [] // Stores the indexes of the meshes that contain this grid space
    private empty = true

    public matchingBlock: MatchingBlock | null = null

    constructor(public readonly worldPosition: Vector3, public readonly gridPosition: Vector3) { }

    setPattern(pattern: number[]) {
        this.pattern = pattern
        const points = pattern.length * pattern.length * pattern.length
        for (let i = 0; i < points; i++) {
            this.points[i] = null
        }
    }

    scanMeshForPoints(mesh: MeshBT, raycastDirection: Vector3, closenessThreshold: number): boolean {
        // this.meshesScanned.push(mesh.id)

        // Avoid overwriting this grid space
        // with a possibly empty mesh scan
        if (!this.isEmpty()) {
            return this.isEmpty()
        }

        // If we are looking for cubes only (no slopes)
        // we just have the scan the center position
        if (this.pattern.length === 1) {
            this.scanPoint(this.worldPosition, 0, mesh, raycastDirection, closenessThreshold)
            return this.updateEmptyStatus()
        }

        const pointPositions = getOffsetPositions(this.pattern, this.worldPosition)

        // Scan just the 8 corner points for now
        this.scanCorners(pointPositions, mesh, raycastDirection, closenessThreshold)

        // If the 8 corner points are empty,
        // we don't need to check any other point
        if (this.cornersEmpty()) {
            this.empty = true
            return true
        }

        // Scan all non-corner points
        for (let i = 0; i < this.points.length; i++) {
            if (!this.points[i])
                this.scanPoint(pointPositions[i], i, mesh, raycastDirection, closenessThreshold)
        }

        return this.updateEmptyStatus()
    }

    private updateEmptyStatus() {
        this.empty = this.points.length === 0 || this.points.every(point => !point?.inside && !point?.near)
        return this.empty
    }

    private scanCorners(pointPositions: Vector3[], mesh: MeshBT, raycastDirection: Vector3, closenessThreshold: number) {

        // const positions = getOffsetPositions(this.pattern, this.worldPosition)

        for (const i of getCornerOffsets(this.pattern.length)) {
            this.scanPoint(pointPositions[i], i, mesh, raycastDirection, closenessThreshold)
        }
    }

    private cornersEmpty() {
        for (const i of getCornerOffsets(this.pattern.length)) {
            if (this.points[i]?.inside || this.points[i]?.near)
                return false
        }
        return true
    }

    private scanPoint(position: Vector3, pointIndex: number, mesh: MeshBT, raycastDirection: Vector3, closenessThreshold: number) {

        // Scan using raycast
        this.points[pointIndex] = {
            position,
            inside: pointIsInsideMesh(position, mesh, raycastDirection).inside,
            near: null,
        }

        // Scan using point distance
        // only if raycast didn't find intersections
        const point = this.points[pointIndex]
        if (point && !point.inside) {
            const result = getPointDistanceToMesh(point.position, mesh)

            if (result) {
                point.near = result.distanceToMesh < closenessThreshold
            }
            else {
                point.near = null
            }
        }
    }

    getSignature(chunkLength?: number): string {
        const signature = getBlockSignature(this.points)

        if (chunkLength)
            return formatSignature(signature, chunkLength)

        return signature
    }

    public isEmpty(): boolean {
        return this.empty
    }

    public setAsEmpty() {
        this.points = []
        this.empty = true
    }

    public isFull(): boolean {
        return this.points.length > 0 && this.points.every(point => point?.inside || point?.near)
    }
}


export function hashPosition(position: Vector3): string {
    return position.round().toArray().join(",")
}