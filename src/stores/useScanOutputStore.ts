import { create } from "zustand"
import { ScanOutput } from "../types"

type Store = {
    scanOutput: ScanOutput | null
    setScanOutput: (scanOutput: ScanOutput | null) => void
}

export const useScanOutputStore = create<Store>((set) => ({
    scanOutput: null,
    setScanOutput: (scanOutput) => set({ scanOutput }),
}))
