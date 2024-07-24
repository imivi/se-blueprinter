import { useSettingsStore } from "../stores/useSettingsStore"
import { ReplacementPolicy, ScanOutput } from "../types"
import { scanMeshes } from "../lib/scan-meshes"
import { Vector3 } from "three"
import { MeshBT } from "../lib/MeshBT"
import { useScanOutputStore } from "../stores/useScanOutputStore"
import { fuseSearch } from "../lib/fuse-search"
import { blockSignatures } from "../blocks/block-signatures"
import { CLOSENESS_THRESHOLD } from "../settings"
import { useSlicePattern } from "./useSlicePattern"
import { BlockSignatures } from "../lib/BlockSignatures"



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

    function runScan() {

        const cubeBlockOnly = disabledBlocks.size === (sampleBlockCount - 1) && !disabledBlocks.has("block")

        const offsets = cubeBlockOnly ? [0] : pattern

        const result = scanMeshes({
            meshes,
            offsets,
            raycastDirection,
            closenessThreshold: CLOSENESS_THRESHOLD,
            maxDistanceFromMeshSurface: hollow ? blocksUntilHollow : null,
        })

        if (!result) {
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

        if (createMarkers)
            addMarkers(scanOutput)

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

        setScanOutput({ ...scanOutput })
        setSettingsModified(false)
        setShowBlocks(true)

        setVisibleLayers(gridSize.y - 1)
    }

    return {
        scanOutput,
        runScan,
    }
}



// Find matching blocks
function addMatchingBlockInfo(scanOutput: ScanOutput, disabledBlocks: Set<string>, signatures: BlockSignatures, replacementPolicy: ReplacementPolicy) {

    const allBlocks = signatures.getSignaturesArray()
    let blocks = allBlocks

    if (disabledBlocks.size > 0) {
        blocks = blocks.filter(block => !disabledBlocks.has(block.name.slice(0, -2))) // Remove the orientation code (FU, LF, UB, etc)
    }

    fuseSearch.setBlocks(blocks)

    for (const gridSpace of scanOutput.gridSpaces) {
        const signature = gridSpace.getSignature()
        const match = fuseSearch.findBestMatch(signature, signatures, disabledBlocks, replacementPolicy)
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