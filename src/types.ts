import { Box3, Vector3 } from "three"
import { GridSpace } from "./lib/GridSpace"

export type Pattern = "basic" | "slopes_fast" | "slopes_full"

export type FindMatchFn = (signature: string) => BlockSignature | null

export type Direction = "Forward" | "Backward" | "Right" | "Left" | "Up" | "Down"

export type BlocksByLayer = Map<number, { firstIndex: number, lastIndex: number }>

export type GridSize = "Large" | "Small"

export type Proximity = "inside" | "near" | "outside"

export type ArmorType = "Heavy" | "Light"

export type ReplacementPolicy = "next best" | "empty"

export type BlockSignature = {
    name: string
    signature: string
}

export type BlockPoints = {
    name: string
    signature: string
    points: Point[]
}

export type Point = {
    position: Vector3
    inside: boolean
    near: boolean | null
}

export type MeshScanResult = {
    meshName: string
    position: Vector3
    blockResults: BlockResult[]
}

export type BlockResult = {
    position: Vector3
    points: Point[]
    name: string
    blockSignature: string
    isEmpty: boolean
    perfectMatch: boolean
}

export type ScanOutput = {
    gridSpaces: GridSpace[]
    gridSize: Vector3
    bbox: Box3
    meshBboxes: Box3[]
    markersInside: Vector3[]
    markersOutside: Vector3[]
    markersNear: Vector3[]
}


export type BlockData = {
    baseName: string
    position: [number, number, number]
    forward: Direction
    up: Direction
}

export type MatchingBlock = {
    perfect: boolean
    blockName: string
}
