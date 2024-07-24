import { useLayoutEffect, useMemo, useRef } from "react"
import { BufferGeometry, InstancedMesh, Material, Object3D, Vector3 } from "three"
import { materials } from "../../materials"
import { useSettingsStore } from "../../stores/useSettingsStore"
import { GridSpace } from "../../lib/GridSpace"

type Props = {
    blocks: GridSpace[]
    cubeGeometries: Record<string, BufferGeometry>
    layer: number
}

/** 
 * Uses mesh instancing to improve performance 
 * https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#instancing
 * */
export function SlicedBlocks({ blocks, cubeGeometries, layer }: Props) {

    const visibleLayers = useSettingsStore(store => store.visibleLayers)

    const blocksForThisLayer = useMemo(() => blocks.filter(block => block.gridPosition.y === layer), [blocks, layer])

    const blocksPerType = useMemo(() => getBlocksPerType(blocksForThisLayer, cubeGeometries), [blocksForThisLayer, cubeGeometries])

    return (
        <group>
            {
                Object.entries(blocksPerType).map(([blockName, data]) => (
                    <InstancedBlocks
                        key={blockName}
                        blocks={data}
                        material={materials.perfectMatch}
                        visible={layer <= visibleLayers}
                    />
                ))
            }
        </group>
    )
}


type InstancedBlocksProps = {
    blocks: BlockData
    material: Material
    visible: boolean
}

function InstancedBlocks({ blocks, material, visible }: InstancedBlocksProps) {

    const instancedMeshRef = useRef<InstancedMesh>(null!)

    const blockCount = blocks.positions.length

    useLayoutEffect(() => {
        const tempObj = new Object3D()
        tempObj.scale.multiplyScalar(0.98) // Make blocks smaller so there's a gap between them

        for (let i = 0; i < blockCount; i++) {
            const { x, y, z } = blocks.positions[i]
            tempObj.position.set(x, y, z)
            tempObj.updateMatrix()
            instancedMeshRef.current.setMatrixAt(i, tempObj.matrix)
        }
    }, [blocks, blockCount])

    return (
        <instancedMesh
            // @ts-expect-error "geometry and material must be passed as props, not args"
            args={[null, null, blockCount]}
            ref={instancedMeshRef}
            visible={visible}
            geometry={blocks.geometry}
            material={material}
        />
    )
}

type BlockData = {
    positions: Vector3[]
    geometry: BufferGeometry
}

function getBlocksPerType(blocks: GridSpace[], cubeGeometries: Record<string, BufferGeometry>) {
    const blocksPerType: Record<string, BlockData> = {}
    for (const info of blocks) {

        if (!info.matchingBlock)
            continue

        if (!(info.matchingBlock.blockName in blocksPerType)) {
            const geometry = cubeGeometries[info.matchingBlock.blockName.toLowerCase()]
            if (!geometry) {
                console.error("No geometry found for block " + info.matchingBlock.blockName)
                continue
            }
            blocksPerType[info.matchingBlock.blockName] = {
                positions: [],
                geometry,
            }
        }

        blocksPerType[info.matchingBlock.blockName].positions.push(info.worldPosition)
    }
    return blocksPerType
}