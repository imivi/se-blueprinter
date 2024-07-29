import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { BufferGeometry, Mesh } from "three"
import { materials } from "../materials"
import { createMeshBvh } from "../lib/MeshBT"
import { BASE_URL } from "../settings"



export function useLoadSampleBlocks() {

    const gltf = useGLTF(BASE_URL + "/blocks.glb")


    const bvhBlocks = useMemo(() => {
        const blocks = Object.values(gltf.nodes).filter(node => node.type === "Mesh" && !node.name.startsWith("Text")) as Mesh[]
        blocks.forEach(block => {
            (block as Mesh).material = materials.test
        })
        // return blocks.map(block => createMeshBvh(block))
        return blocks
    }, [gltf])

    // Set double-faced material before raycasting
    const cubeGeometries = useMemo(() => {
        const geometries: Record<string, BufferGeometry> = {}
        for (const mesh of bvhBlocks) {
            // console.log(mesh.name, mesh, mesh.geometry)
            geometries[mesh.name.toLowerCase()] = mesh.geometry
        }
        return geometries
    }, [bvhBlocks])

    return {
        sampleMeshes: bvhBlocks,
        geometries: cubeGeometries,
    }
}