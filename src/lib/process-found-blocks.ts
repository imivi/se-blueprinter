import { Vector3, Box3 } from "three"
import { GridSpace } from "./GridSpace"
import { FindMatchFn } from "../types"


export type Block = {
    // meshName: string
    worldPosition: Vector3
    gridPosition: Vector3
    blockName: string
    empty: boolean
    perfect: boolean
    signature: string
    id: number
}



export function processFoundBlocks(gridSpaces: GridSpace[], findMatch: FindMatchFn) {

    const allBlockPositions: Vector3[] = []
    for (const gridSpace of gridSpaces) {
        allBlockPositions.push(gridSpace.worldPosition)
    }
    const bbox = new Box3().setFromPoints(allBlockPositions)
    const gridSize = bbox.getSize(new Vector3()).add(new Vector3(1, 1, 1))

    const foundBlocks: Block[] = []

    let realBlockCounter = 1

    for (const gridSpace of gridSpaces) {
        const gridPosition = gridSpace.worldPosition.clone().sub(bbox.min)

        let blockId = 0
        const isEmpty = gridSpace.isEmpty()

        if (!isEmpty) {
            blockId = realBlockCounter
            realBlockCounter += 1
        }

        const signature = gridSpace.getSignature()

        const result = findMatch(signature)

        const perfectMatch = signature === result?.signature

        foundBlocks.push({
            // meshName: gridSpace.meshesScanned.join(", "),
            blockName: result?.name || "unknown",
            empty: isEmpty,
            perfect: perfectMatch,
            signature,
            worldPosition: gridSpace.worldPosition,
            gridPosition,
            id: blockId,
        })
    }

    return { foundBlocks, gridSize, bbox }
}