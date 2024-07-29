import { Vector3 } from "three";
import { getOffsetPositions } from "./analyze-block";
import { formatSignature, getBlockSignature } from "./misc";
import { MeshBT } from "./MeshBT";
import { getPointDistanceToMeshBT, pointIsInsideMesh } from "./point-utils";
import { MatchingBlock, ReplacementPolicy } from "../types";
import { getScanPoints, PointFeature } from "./get-scan-points";
import { BlockFinder } from "./BlockFinder";
import { BlockSignatures } from "./BlockSignatures";


type Point = {
    position: Vector3
    inside: boolean // using raycast
    near: boolean | null // using closestPointToPoint
}

type ScanMeshForPointsOptions = {
    blockFinder: BlockFinder,
    mesh: MeshBT, raycastDirection: Vector3,
    closenessThreshold: number
    signatures: BlockSignatures,
    disabledBlocks: Set<string>,
    replacementPolicy: ReplacementPolicy
    maxDistanceFromMeshSurface: number | null
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

    isHollow(mesh: MeshBT, maxDistanceFromMeshSurface: number): boolean {

        for (const direction of sixRaycastDirections) {
            const { inside, distance } = pointIsInsideMesh(this.worldPosition, mesh, direction)
            if (!inside)
                return false
            if (distance && distance < maxDistanceFromMeshSurface)
                return false
        }

        return true
    }

    scanMeshForPoints(options: ScanMeshForPointsOptions): boolean {

        const {
            blockFinder,
            mesh,
            raycastDirection,
            closenessThreshold,
            disabledBlocks,
            replacementPolicy,
            signatures,
            maxDistanceFromMeshSurface,
        } = options

        // Avoid overwriting this grid space
        // with a possibly empty mesh scan
        if (!this.isEmpty()) {
            return this.isEmpty()
        }

        // If hollow option is enabled, first check if
        // this block is too far from the mesh surface.
        if (maxDistanceFromMeshSurface && this.isHollow(mesh, maxDistanceFromMeshSurface)) {
            this.matchingBlock = null
            return this.empty = false
        }

        // If we are looking for cubes only (no slopes)
        // we just have to scan the center position
        if (this.pattern.length === 1) {
            const point = this.scanPoint(this.worldPosition, 0, mesh, raycastDirection, closenessThreshold)
            if (point) {
                if (point.inside || point.near) {
                    this.matchingBlock = {
                        blockName: "blockfu",
                        perfect: true,
                    }
                    return this.empty = false
                }
                return this.empty = true
            }
        }

        const pointPositions = getOffsetPositions(this.pattern, this.worldPosition)

        // Scan just the 8 corner points for now
        this.scanFeature("corners", pointPositions, mesh, raycastDirection, closenessThreshold)

        // If the 8 corner points are empty,
        // we don't need to check any other point
        if (this.cornersAreEmpty()) {
            return this.empty = true
        }

        if (this.cornersAreFull()) {
            this.matchingBlock = {
                blockName: "blockfu",
                perfect: true,
            }
            return this.empty = false
        }

        // Scan all non-corner points
        this.scanFeature("edges", pointPositions, mesh, raycastDirection, closenessThreshold)
        this.scanFeature("center", pointPositions, mesh, raycastDirection, closenessThreshold)
        this.scanFeature("faces", pointPositions, mesh, raycastDirection, closenessThreshold)

        const signature = this.getSignature()

        const match = blockFinder.findBestMatch(signature, signatures, disabledBlocks, replacementPolicy)

        if (match) {
            this.matchingBlock = {
                blockName: match.name,
                perfect: match.signature === signature,
            }
        }

        return this.updateEmptyStatus()
    }

    private updateEmptyStatus() {
        this.empty = this.points.length === 0 || this.points.every(point => !point?.inside && !point?.near)
        return this.empty
    }

    private scanFeature(feature: PointFeature, pointPositions: Vector3[], mesh: MeshBT, raycastDirection: Vector3, closenessThreshold: number) {
        for (const i of getScanPoints(feature, this.pattern.length)) {
            this.scanPoint(pointPositions[i], i, mesh, raycastDirection, closenessThreshold)
        }
    }

    /*
    private checkCornerPoints(): "empty" | "full" | "mixed" {
        let emptyPoints = 0
        let fullPoints = 0
        for (const i of getScanPoints("corners", this.pattern.length)) {
            const point = this.points[i]
            if (point?.inside || point?.near)
                fullPoints += 1
            else
                emptyPoints += 1
            if (emptyPoints > 0 || fullPoints > 0)
                break
        }
        if (emptyPoints > 0 && fullPoints > 0)
            return "mixed"
        if (emptyPoints === 0)
            return "full"
        else
            return "empty"
    }
    */

    private cornersAreEmpty() {
        for (const i of getScanPoints("corners", this.pattern.length)) {
            if (this.points[i]?.inside || this.points[i]?.near)
                return false
        }
        return true
    }

    private cornersAreFull() {
        for (const i of getScanPoints("corners", this.pattern.length)) {
            const point = this.points[i]
            if (!point || !point.inside || !point.near)
                return false
        }
        return true
    }

    private edgesAreFull() {
        for (const i of getScanPoints("corners", this.pattern.length)) {
            const point = this.points[i]
            const pointExists = point && (point.inside || point.near)
            if (!pointExists)
                return false
        }
        for (const i of getScanPoints("edges", this.pattern.length)) {
            const point = this.points[i]
            const pointExists = point && (point.inside || point.near)
            if (!pointExists)
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
            const result = getPointDistanceToMeshBT(point.position, mesh)

            if (result) {
                point.near = result.distanceToMesh < closenessThreshold
            }
            else {
                point.near = null
            }
        }

        return this.points[pointIndex]
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

    public isFullCube(): boolean {
        return this.matchingBlock?.blockName === "blockfu"

        // return (
        //     this.points.length > 0 &&
        //     this.points.every(point => point?.inside || point?.near)
        // )
    }
}


export function hashPosition(position: Vector3): string {
    return position.round().toArray().join(",")
}


const sixRaycastDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),
]
