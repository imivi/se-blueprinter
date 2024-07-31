import { create } from "zustand"
import { Direction, Pattern, ReplacementPolicy } from "../types"


type Store = {
    slicePattern: Pattern
    setSlicePattern: (pattern: Pattern) => void

    settingsModified: boolean
    setSettingsModified: (modified: boolean) => void

    showMeshBoundingBoxes: boolean
    setShowMeshBoundingBoxes: (show: boolean) => void

    showLabels: boolean
    setShowLabels: (show: boolean) => void

    showBlocks: boolean
    setShowBlocks: (show: boolean) => void

    showMarkers: boolean
    setShowMarkers: (show: boolean) => void

    multiScan: boolean
    setMultiScan: (enabled: boolean) => void

    hollow: boolean
    setHollow: (enabled: boolean) => void

    visibleLayers: number
    setVisibleLayers: (visibleLayers: number) => void

    raycastDirectionOption: Direction
    setRaycastDirectionOption: (direction: Direction) => void

    blocksUntilHollow: number
    setBlocksUntilHollow: (blocks: number) => void

    disabledBlocks: Set<string>
    toggleBlockDisabled: (blockName: string) => void

    replacementPolicy: ReplacementPolicy
    setReplacementPolicy: (policy: ReplacementPolicy) => void
}


export const useSettingsStore = create<Store>((set, get) => ({

    slicePattern: "slopes",
    setSlicePattern: (pattern) => set({ slicePattern: pattern, settingsModified: true }),

    settingsModified: true,
    setSettingsModified: (settingsModified) => set({ settingsModified }),

    showMeshBoundingBoxes: false,
    setShowMeshBoundingBoxes(show) {
        set({ showMeshBoundingBoxes: show })
    },

    showLabels: false,
    setShowLabels(show) {
        set({ showLabels: show })
    },

    showBlocks: true,
    setShowBlocks(show) {
        set({ showBlocks: show })
    },

    showMarkers: false,
    setShowMarkers(show) {
        set({ showMarkers: show })
    },

    multiScan: false,
    setMultiScan(enabled) {
        set({ multiScan: enabled, settingsModified: true })
    },

    hollow: false,
    setHollow: (hollow) => set({ hollow, settingsModified: true }),

    visibleLayers: -1,
    setVisibleLayers(visibleLayers) {
        set({ visibleLayers })
    },

    raycastDirectionOption: "Up",
    setRaycastDirectionOption(direction) {
        set({ raycastDirectionOption: direction, settingsModified: true })
    },

    blocksUntilHollow: 1,
    setBlocksUntilHollow: (blocks) => set({ blocksUntilHollow: blocks, settingsModified: true }),

    disabledBlocks: new Set(),
    toggleBlockDisabled: (block) => {
        const disabled = get().disabledBlocks
        if (disabled.has(block))
            disabled.delete(block)
        else
            disabled.add(block)
        set({ disabledBlocks: new Set(disabled), settingsModified: true })
    },

    replacementPolicy: "next best",
    setReplacementPolicy: (policy) => set({ replacementPolicy: policy, settingsModified: true }),
}))
