import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import { create } from "zustand"

type Store = {
    gltfFilename: string
    setGltfFilename: (filename: string) => void

    gltfUrl: string | null
    setGltfUrl: (url: string | null) => void

    gltf: GLTF | null
    setGltf: (gltf: GLTF | null) => void

    loading: boolean
    setLoading: (loading: boolean) => void
}

export const useGltfStore = create<Store>((set) => ({
    gltfFilename: "",
    setGltfFilename: (filename) => set({ gltfFilename: filename }),

    gltfUrl: null,
    setGltfUrl: (url) => set({ gltfUrl: url }),

    gltf: null,
    setGltf: (gltf) => set({ gltf }),

    loading: false,
    setLoading: (loading) => set({ loading }),
}))
