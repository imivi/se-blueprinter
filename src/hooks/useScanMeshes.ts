import { useSettingsStore } from "../stores/useSettingsStore"
import { ReplacementPolicy, ScanOutput } from "../types"
import { scanMeshes } from "../lib/scan-meshes"
import { Vector3 } from "three"
import { MeshBT } from "../lib/MeshBT"
import { useScanOutputStore } from "../stores/useScanOutputStore"
import { blockSignatures } from "../blocks/block-signatures"
import { CLOSENESS_THRESHOLD } from "../settings"
import { useSlicePattern } from "./useSlicePattern"
import { BlockSignatures } from "../lib/BlockSignatures"
import { useState } from "react"
import { Benchmark } from "../lib/Benchmark"
import { blockFinder } from "../lib/BlockFinder"



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

    const [benchmarks, setBenchmarks] = useState<Record<string, Benchmark>>({})

    function runScan() {

        const cubeBlockOnly = disabledBlocks.size === (sampleBlockCount - 1) && !disabledBlocks.has("block")

        const offsets = cubeBlockOnly ? [0] : pattern

        const benchmarks = {
            scanMeshes: new Benchmark(),
            addMarkers: new Benchmark(),
            matchBlocks: new Benchmark(),
        }

        const signatures = pattern.length === 3 ? blockSignatures.slopes_fast : blockSignatures.slopes_full


        const allBlocks = signatures.getSignaturesArray()
        let blocks = allBlocks

        if (disabledBlocks.size > 0) {
            blocks = blocks.filter(block => !disabledBlocks.has(block.name.slice(0, -2))) // Remove the orientation code (FU, LF, UB, etc)
        }

        blockFinder.setBlocks(blocks)

        benchmarks.scanMeshes.start()
        const result = scanMeshes({
            meshes,
            offsets,
            raycastDirection,
            closenessThreshold: CLOSENESS_THRESHOLD,
            maxDistanceFromMeshSurface: hollow ? blocksUntilHollow : null,
            blockFinder,
            disabledBlocks,
            replacementPolicy,
            signatures,
        })
        benchmarks.scanMeshes.end()

        if (!result) {
            setBenchmarks(benchmarks)
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

        console.info(scanOutput)

        if (createMarkers) {
            benchmarks.addMarkers.start()
            addMarkers(scanOutput)
            benchmarks.addMarkers.end()
        }

        // OBSOLETE - blocks are matched during the raycasting process
        /*
        benchmarks.matchBlocks.start()

        if (pattern.length === 1) {
            for (const block of scanOutput.gridSpaces) {
                if (!block.isEmpty()) {
                    block.matchingBlock = {
                        blockName: "blockfu",
                        perfect: true,
                    }
                }
            }
        }
        else if (pattern.length === 3 || pattern.length === 4) {
            const signatures = pattern.length === 3 ? blockSignatures.slopes_fast : blockSignatures.slopes_full
            addMatchingBlockInfo(scanOutput, disabledBlocks, signatures, replacementPolicy)
        }
        else {
            console.warn("Can't find matching blocks with pattern length", pattern.length)
        }

        benchmarks.matchBlocks.end()
        */

        setScanOutput({ ...scanOutput })
        setSettingsModified(false)
        setShowBlocks(true)
        setBenchmarks(benchmarks)

        setVisibleLayers(gridSize.y - 1)
    }

    return {
        scanOutput,
        runScan,
        benchmarks,
    }
}



// Find matching blocks
function addMatchingBlockInfo(scanOutput: ScanOutput, disabledBlocks: Set<string>, signatures: BlockSignatures, replacementPolicy: ReplacementPolicy) {

    const allBlocks = signatures.getSignaturesArray()
    let blocks = allBlocks

    if (disabledBlocks.size > 0) {
        blocks = blocks.filter(block => !disabledBlocks.has(block.name.slice(0, -2))) // Remove the orientation code (FU, LF, UB, etc)
    }

    blockFinder.setBlocks(blocks)

    for (const gridSpace of scanOutput.gridSpaces) {
        const signature = gridSpace.getSignature()

        const match = blockFinder.findBestMatch(signature, signatures, disabledBlocks, replacementPolicy)

        if (match)
            gridSpace.matchingBlock = {
                blockName: match.name,
                perfect: match.signature === signature,
            }
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