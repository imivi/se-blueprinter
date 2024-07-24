import { useMemo } from "react"
import { Mesh } from "three"
import { createMeshBvh } from "../lib/MeshBT"
import { materials } from "../materials"
import { useGltfStore } from "../stores/useGltfStore"


/** Returns all meshes loaded by the user */
export function useGltfMeshes() {

    const uploadedGltf = useGltfStore(store => store.gltf)

    const gtlfMeshes = useMemo(() => {
        const gltfNodes = Array.from(uploadedGltf?.scene.children || [])
        const meshes = gltfNodes as Mesh[] || []

        // Set double-faced material before raycasting
        for (const mesh of meshes)
            (mesh as Mesh).material = materials.model

        return meshes.map(mesh => createMeshBvh(mesh))
    }, [uploadedGltf])

    return gtlfMeshes
}