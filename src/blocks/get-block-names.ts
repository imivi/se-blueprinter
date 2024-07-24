import { z } from "zod"
import { readCsv } from "../lib/read-csv"

const csvRowSchema = z.array(z.object({
    num: z.string(),
    name: z.string(),
    category: z.string(),
    LARGE_LIGHT: z.string(),
    LARGE_HEAVY: z.string(),
    SMALL_LIGHT: z.string(),
    SMALL_HEAVY: z.string(),
}))


type BlockNames = {
    LARGE_LIGHT: string
    LARGE_HEAVY: string
    SMALL_LIGHT: string
    SMALL_HEAVY: string
}

export function getBlockNames(): Record<string, BlockNames> {
    const csvLines = csvRowSchema.parse(readCsv("src/blocks/block-names.csv"))
    const blockNames: Record<string, BlockNames> = {}
    for (const csvLine of csvLines) {
        blockNames[csvLine.name.replaceAll(" ", "").toLowerCase()] = {
            LARGE_HEAVY: csvLine.LARGE_HEAVY,
            LARGE_LIGHT: csvLine.LARGE_LIGHT,
            SMALL_HEAVY: csvLine.SMALL_HEAVY,
            SMALL_LIGHT: csvLine.SMALL_LIGHT,
        }
    }
    return blockNames
}
