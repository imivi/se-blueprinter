import { useMemo } from "react"
import { analyzeBlock } from "../lib/analyze-block"
import { CLOSENESS_THRESHOLD } from "../settings"
import { useLoadSampleBlocks } from "./useLoadSampleBlocks"
import { Vector3 } from "three"
import { useDebug } from "./useDebug"
import { useSlicePattern } from "./useSlicePattern"
import { blockSignatures } from "../blocks/block-signatures"
import { getCornerEdgeCenterPatternOffsets } from "../lib/get-pattern-offsets"




export function useSampleData(raycastDirection: Vector3) {

    const { sampleMeshes, geometries } = useLoadSampleBlocks()

    const debug = useDebug()

    const pattern = useSlicePattern()

    const offsets = useMemo(() => getCornerEdgeCenterPatternOffsets(pattern), [pattern])

    const sampleSignatures = useMemo(() => {
        // In debug mode, generate the block signatures straight from the loaded models
        if (debug) {
            const signatures = sampleMeshes.map(block => analyzeBlock(block, offsets, raycastDirection, CLOSENESS_THRESHOLD))
            console.info(`[debug] Created signatures on the fly from ${sampleMeshes.length} loaded sample blocks`)
            return signatures
        }
        // In production, fetch the block signatures from json
        else {
            return blockSignatures.getSignaturesArray().map(block => ({ ...block, points: [] }))
        }
    }, [sampleMeshes, raycastDirection, debug, offsets])

    return {
        sampleSignatures,
        sampleMeshes,
        sampleGeometries: geometries,
    }
}