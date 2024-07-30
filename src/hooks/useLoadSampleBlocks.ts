import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { BufferGeometry, Mesh, Vector3 } from "three"
import { materials } from "../materials"
import { BASE_URL } from "../settings"



export function useLoadSampleBlocks() {

    const gltf = useGLTF(BASE_URL + "/blocks.glb")


    const bvhBlocks = useMemo(() => {
        const blocks = Object.values(gltf.nodes).filter(node => node.type === "Mesh" && !node.name.startsWith("Text")) as Mesh[]
        blocks.forEach(block => {
            (block as Mesh).material = materials.test

            // Check if the scale and rotation have been applied
            if (!block.scale.toArray().every(n => n === 1)) {
                console.error("Scale not applied to sample block", block.name)
            }
            if (!block.rotation.toArray().slice(0, 3).every(n => n === 0)) {
                console.error("Rotation not applied to sample block", block.name)
            }
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
