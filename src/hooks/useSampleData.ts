import { useMemo } from "react"
import { analyzeBlock } from "../lib/analyze-block"
import { CLOSENESS_THRESHOLD } from "../settings"
import { useLoadSampleBlocks } from "./useLoadSampleBlocks"
import { Vector3 } from "three"
import { useDebug } from "./useDebug"
import { useSlicePattern } from "./useSlicePattern"
import { blockSignatures } from "../blocks/block-signatures"




export function useSampleData(raycastDirection: Vector3) {

    const { sampleMeshes, geometries } = useLoadSampleBlocks()

    const debug = useDebug()

    const pattern = useSlicePattern()

    const sampleSignatures = useMemo(() => {
        // In debug mode, generate the block signatures straight from the loaded models
        if (debug) {
            const signatures = sampleMeshes.map(block => analyzeBlock(block, pattern, raycastDirection, CLOSENESS_THRESHOLD))
            console.info(`[debug] Created signatures on the fly from ${sampleMeshes.length} loaded sample blocks`)
            console.info(signatures.map(block => ({ name: block.name, signature: block.signature })))
            return signatures
        }
        // In production, fetch the blockData from json
        else {
            const signatures = pattern.length === 3 * 3 * 3 ? blockSignatures.slopes_fast : blockSignatures.slopes_full
            return signatures.getSignaturesArray().map(block => ({ ...block, points: [] }))
        }
    }, [sampleMeshes, raycastDirection, debug, pattern])

    return {
        sampleSignatures,
        sampleMeshes,
        sampleGeometries: geometries,
    }
}