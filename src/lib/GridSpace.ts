import { Vector3 } from "three";
import { MeshBT } from "./MeshBT";
import { getPointDistanceToMeshBT, pointIsInsideMesh } from "./point-utils";
import { MatchingBlock, ReplacementPolicy } from "../types";
import { BlockFinder } from "./BlockFinder";
import { BlockSignatures } from "./BlockSignatures";
import { Point } from "./Point";



type ScanMeshForPointsOptions = {
    blockFinder: BlockFinder,
    mesh: MeshBT, raycastDirection: Vector3,
    closenessThreshold: number
    signatures: BlockSignatures,
    disabledBlocks: Set<string>,
    replacementPolicy: ReplacementPolicy
    maxDistanceFromMeshSurface: number | null
    pointOffsets: Vector3[]
}

export class GridSpace {

    private pattern: number[] = []
    public points: Point[] = []
    public parentMeshes: number[] = []
    private empty = true

    public matchingBlock: MatchingBlock | null = null

    constructor(public readonly worldPosition: Vector3, public readonly gridPosition: Vector3) { }

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
            pointOffsets,
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
            const point = scanPoint(this.worldPosition, mesh, raycastDirection, closenessThreshold)
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

        // const pointPositions = getOffsetPositions(this.pattern, this.worldPosition)

        const cornerOffsets = pointOffsets.slice(0, 8)
        const edgeAndFaceOffsets = pointOffsets.slice(8, 8 + 24 + 6)

        // Scan just the 8 corner points for now
        const corners = cornerOffsets.map(offset => scanPoint(this.worldPosition.clone().add(offset), mesh, raycastDirection, closenessThreshold))


        // If the 8 corner points are empty there is no block at all,
        // so we don't need to check any other point
        const cornersAreEmpty = corners.every(corner => corner.isEmpty())
        if (cornersAreEmpty) {
            this.points = corners
            return this.empty = true
        }


        // If the 8 corner points are full this is a cube block,
        // so we don't need to check any other point
        const cornersAreFull = corners.every(corner => corner.isFull())
        if (cornersAreFull) {
            this.points = corners
            this.matchingBlock = {
                blockName: "blockfu",
                perfect: true,
            }
            return this.empty = false
        }

        // Scan edge and face points
        const edgesAndFaces = edgeAndFaceOffsets.map(offset => scanPoint(this.worldPosition.clone().add(offset), mesh, raycastDirection, closenessThreshold))

        this.points = [...corners, ...edgesAndFaces]

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

    getSignature(): string {
        return this.points.map(point => point.isFull() ? "1" : "0").join("")
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

function scanPoint(position: Vector3, mesh: MeshBT, raycastDirection: Vector3, closenessThreshold: number): Point {

    // Scan using raycast
    const point = new Point(
        position,
        pointIsInsideMesh(position, mesh, raycastDirection).inside,
        null,
    )

    // Scan using point distance
    // only if raycast didn't find intersections
    if (point && !point.inside) {
        const result = getPointDistanceToMeshBT(point.position, mesh)

        if (result) {
            point.near = result.distanceToMesh < closenessThreshold
        }
        else {
            point.near = null
        }
    }

    return point
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

