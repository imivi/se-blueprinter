import { create } from "zustand"
import { BlockSignature } from "../types"

type Store = {
    signatures: BlockSignature[]
    setSignatures: (signatures: BlockSignature[]) => void
}

export const useSampleBlocksStore = create<Store>((set) => ({
    signatures: [],
    setSignatures: (signatures) => set({ signatures }),
}))
