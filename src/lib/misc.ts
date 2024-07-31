import { Direction } from "../types"


const directions: Record<string, Direction> = {
    "b": "Backward",
    "f": "Forward",
    "r": "Right",
    "l": "Left",
    "u": "Up",
    "d": "Down",
}


export function getBlockOrientation(blockName: string): [Direction, Direction] {
    const forwardInitial = blockName[blockName.length - 2].toLowerCase()
    const upInitial = blockName[blockName.length - 1].toLowerCase()

    return [
        directions[forwardInitial] || "Forward",
        directions[upInitial] || "Up",
    ]
}


export function generate17digitsID(): string {
    return Math.random().toFixed(17).slice(2, 19);
}
