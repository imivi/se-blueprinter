import { ArmorType, GridSize } from "../types"
// import { getBlockNames } from "./get-block-names"
import blockNames from "./block-names.json"

// const blockNames = getBlockNames()

export function getBlockName(baseBlockName: string, gridSize: GridSize, armorType: ArmorType): string {

    const names = blockNames[baseBlockName as keyof typeof blockNames]

    if (!names) {
        throw new Error("No matching block name: " + JSON.stringify({ baseBlockName, gridSize, armorType }))
    }

    if (gridSize === "Small" && armorType === "Heavy") {
        return names.SMALL_HEAVY
    }

    if (gridSize === "Small" && armorType === "Light") {
        return names.SMALL_LIGHT
    }

    if (gridSize === "Large" && armorType === "Heavy") {
        return names.LARGE_HEAVY
    }

    // Default
    return names.LARGE_LIGHT
}
