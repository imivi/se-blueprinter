import { useLayoutEffect, useRef } from "react"
import { InstancedMesh, Material, Object3D, SphereGeometry, Vector3 } from "three"
import { Proximity } from "../../types"
import { materials } from "../../materials"


type Props = {
    positions: Vector3[]
    proximity: Proximity
    visible?: boolean
}

/** 
 * Uses mesh instancing to improve performance 
 * https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#instancing
 * */
export function PointMarkers({ positions, proximity, visible = true }: Props) {

    const instancedMeshRef = useRef<InstancedMesh>(null!)

    useLayoutEffect(() => {
        const tempObj = new Object3D()
        for (let i = 0; i < positions.length; i++) {
            const { x, y, z } = positions[i]
            tempObj.position.set(x, y, z)
            tempObj.updateMatrix()
            instancedMeshRef.current.setMatrixAt(i, tempObj.matrix)
        }
        // instancedMeshRef.current?.instanceMatrix.needsUpdate = true
    }, [positions])

    return (
        <instancedMesh
            // @ts-expect-error ...
            args={[null, null, positions.length]}
            ref={instancedMeshRef}
            visible={visible}
            geometry={sphereGeometry}
            material={markerMaterials[proximity]}
        />
    )
}


const radius = 0.02
const widthSegments = 8
const heightSegments = 8

const sphereGeometry = new SphereGeometry(radius, widthSegments, heightSegments)

const markerMaterials: Record<Proximity, Material> = {
    inside: materials.markerInside,
    near: materials.markerNear,
    outside: materials.markerOutside,
}