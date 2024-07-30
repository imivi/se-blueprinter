import { Direction } from "../types"
import { Point } from "./Point"


export function getBlockSignature(points: Point[]): string {
    return points.map(point => point?.isFull() ? "1" : "0").join("")
}


export function formatSignature(text: string, chunkLength: number): string {
    const chunks: string[] = []
    for (let i = 0; i < chunkLength; i++) {
        const startIndex = i * chunkLength
        const endIndex = startIndex + chunkLength
        const chunk = text.slice(startIndex, endIndex)
        chunks.push(chunk)
    }
    return chunks.join("\n")
}


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
