import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { BufferGeometry, Mesh } from "three"
import { materials } from "../materials"
import { createMeshBvh } from "../lib/MeshBT"



export function useLoadSampleBlocks() {

    const gltf = useGLTF("/cubes.glb")


    const bvhBlocks = useMemo(() => {
        const allBlocks = Object.values(gltf.nodes).filter(node => node.type === "Mesh" && !node.name.startsWith("Text")) as Mesh[]

        const blocks = allBlocks.map(block => createMeshBvh(block))
        blocks.forEach(block => {
            (block as Mesh).material = materials.test
        })
        return blocks
    }, [gltf])

    // Set double-faced material before raycasting
    const cubeGeometries = useMemo(() => {
        const geometries: Record<string, BufferGeometry> = {}
        for (const mesh of bvhBlocks) {
            geometries[mesh.name.toLowerCase()] = mesh.geometry
        }
        return geometries
    }, [bvhBlocks])

    return {
        sampleMeshes: bvhBlocks,
        geometries: cubeGeometries,
    }
}