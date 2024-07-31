import { useSettingsStore } from "../stores/useSettingsStore"
import { ScanOutput } from "../types"
import { scanMeshes } from "../lib/scan-meshes"
import { Vector3 } from "three"
import { MeshBT } from "../lib/MeshBT"
import { useScanOutputStore } from "../stores/useScanOutputStore"
import { blockSignatures } from "../blocks/block-signatures"
import { CLOSENESS_THRESHOLD } from "../settings"
import { useSlicePattern } from "./useSlicePattern"
import { useState } from "react"
import { blockFinder } from "../lib/BlockFinder"
import { useDebug } from "./useDebug"



export function useScanMeshes(raycastDirection: Vector3, meshes: MeshBT[], createMarkers: boolean, sampleBlockCount: number) {

    const setSettingsModified = useSettingsStore(store => store.setSettingsModified)
    const hollow = useSettingsStore(store => store.hollow)
    const blocksUntilHollow = useSettingsStore(store => store.blocksUntilHollow)

    const setVisibleLayers = useSettingsStore(store => store.setVisibleLayers)
    const setShowBlocks = useSettingsStore(store => store.setShowBlocks)

    const disabledBlocks = useSettingsStore(store => store.disabledBlocks)

    const replacementPolicy = useSettingsStore(store => store.replacementPolicy)

    const scanOutput = useScanOutputStore(store => store.scanOutput)
    const setScanOutput = useScanOutputStore(store => store.setScanOutput)

    const pattern = useSlicePattern()

    const [benchmark, setBenchmark] = useState<number>(0)

    const debug = useDebug()

    function runScan() {

        const cubeBlockOnly = disabledBlocks.size === (sampleBlockCount - 1) && !disabledBlocks.has("block")

        const allBlocks = blockSignatures.getSignaturesArray()
        let blocks = allBlocks

        if (disabledBlocks.size > 0) {
            blocks = blocks.filter(block => !disabledBlocks.has(block.name.slice(0, -2))) // Remove the orientation code (FU, LF, UB, etc)
        }

        blockFinder.setBlocks(blocks)

        const start = performance.now()
        const result = scanMeshes({
            meshes,
            pattern: cubeBlockOnly ? [0] : pattern,
            raycastDirection,
            closenessThreshold: CLOSENESS_THRESHOLD,
            maxDistanceFromMeshSurface: hollow ? blocksUntilHollow : null,
            blockFinder,
            disabledBlocks,
            replacementPolicy,
            signatures: blockSignatures,
            savePoints: debug,
        })
        const end = performance.now()

        if (!result) {
            setBenchmark(0)
            return
        }

        const { gridSpaces, gridSize, bbox, meshBboxes } = result

        const scanOutput: ScanOutput = {
            gridSpaces,
            gridSize,
            bbox,
            meshBboxes,
            markersInside: [],
            markersNear: [],
            markersOutside: [],
        }

        if (createMarkers) {
            addMarkers(scanOutput)
        }

        setScanOutput({ ...scanOutput })
        setSettingsModified(false)
        setShowBlocks(true)
        setBenchmark((end - start) / 1000)

        setVisibleLayers(gridSize.y - 1)
    }

    return {
        scanOutput,
        runScan,
        benchmark,
    }
}



function addMarkers(scanOutput: ScanOutput) {
    for (const gridSpace of scanOutput.gridSpaces) {
        if (!gridSpace.isEmpty()) {
            for (const point of gridSpace.points) {
                if (!point)
                    continue
                if (point.inside) {
                    scanOutput.markersInside.push(point.position)
                }
                else if (point.near) {
                    scanOutput.markersNear.push(point.position)
                }
                else {
                    scanOutput.markersOutside.push(point.position)
                }
            }
        }
    }
}