import { useState } from "react"
import { GLTFLoader, DRACOLoader } from "three/examples/jsm/Addons.js"
import { useGltfStore } from "../stores/useGltfStore"



// Instantiate a loader
const loader = new GLTFLoader()

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
loader.setDRACOLoader(dracoLoader)



export function useLoadGltf() {

    const [error, setError] = useState(false)
    const [percentLoaded, setPercentLoaded] = useState(0)
    const setGltf = useGltfStore(store => store.setGltf)

    const setLoading = useGltfStore(store => store.setLoading)

    function loadGltf(url: string | null) {
        if (!url)
            return

        setGltf(null)
        setError(false)
        setLoading(true)

        loader.load(
            url,
            (gltf) => {
                setGltf(gltf)
                setLoading(false)
            },
            (progress) => {
                const percent = progress.loaded / progress.total * 100
                setPercentLoaded(percent)
            },
            (error) => {
                console.error(error)
                setGltf(null)
                setError(true)
                setLoading(false)
            },
        )
    }

    return {
        loadGltf,
        error,
        percentLoaded,
        // meshes,
    }
}
