import { create } from "zustand"
import { ArmorType, GridSize } from "../types"


type Store = {
    entityId: string | null // 17 digits
    setEntityId: (entityId: string | null) => void

    ownerSteamId: string // 7 digits
    setOwnserSteamId: (ownerSteamId: string) => void

    gridSize: GridSize
    setGridSize: (gridSize: GridSize) => void

    staticGrid: boolean
    setStaticGrid: (staticGrid: boolean) => void

    armorType: ArmorType
    setArmorType: (armorType: ArmorType) => void

    playerDisplayName: string // digits only
    setPlayerDisplayName: (playerDisplayName: string) => void

    cubeGridDisplayName: string // digits only
    setCubeGridDisplayName: (cubeGridDisplayName: string) => void
}

export const useBlueprintFieldsStore = create<Store>((set) => ({
    entityId: null,
    setEntityId: (entityId) => set({ entityId }),

    ownerSteamId: "0",
    setOwnserSteamId: (ownerSteamId) => set({ ownerSteamId }),

    gridSize: "Large",
    setGridSize: (gridSize) => set({ gridSize }),

    staticGrid: true,
    setStaticGrid: (staticGrid) => set({ staticGrid }),

    armorType: "Heavy",
    setArmorType: (armorType) => set({ armorType }),

    playerDisplayName: "",
    setPlayerDisplayName: (playerDisplayName) => set({ playerDisplayName }),

    cubeGridDisplayName: "",
    setCubeGridDisplayName: (cubeGridDisplayName) => set({ cubeGridDisplayName }),
}))
