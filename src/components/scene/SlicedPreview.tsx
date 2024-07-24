import { BufferGeometry, Mesh } from "three"
import { PointMarker } from "./PointMarker"
import { Center } from "@react-three/drei"
import { ScanOutput } from "../../types"
import { PointMarkers } from "./PointMarkers"
import { useSettingsStore } from "../../stores/useSettingsStore"
import BoundingBox from "./BoundingBox"
import { useMemo } from "react"
import { SlicedBlocks } from "./SlicedBlocks"
import GridSpaceMarker from "./GridSpaceMarker"
import { GridSpace } from "../../lib/GridSpace"
import { useDebug } from "../../hooks/useDebug"





type Props = {
    meshes: Mesh[]
    scanOutput: ScanOutput | null
    cubeGeometries: Record<string, BufferGeometry>
}


export default function SlicedPreview({ meshes, scanOutput, cubeGeometries }: Props) {

    const showMeshBoundingBoxes = useSettingsStore(store => store.showMeshBoundingBoxes)
    const showBlocks = useSettingsStore(store => store.showBlocks)
    const showMarkers = useSettingsStore(store => store.showMarkers)

    const nonEmptyBlocks = useMemo(() => {
        if (scanOutput)
            return scanOutput.gridSpaces.filter(space => !space.isEmpty())
        return []
    }, [scanOutput])

    const layers = useMemo(() => getLayers(nonEmptyBlocks), [nonEmptyBlocks])

    const debug = useDebug()

    return (
        <group>

            <Center visible={!scanOutput || !showBlocks} disableY>
                {
                    meshes.map(mesh => (
                        <primitive
                            key={mesh.id}
                            object={mesh}
                        />)
                    )
                }
            </Center>

            <group visible={showBlocks}>
                {
                    layers.map(layer => (
                        <SlicedBlocks
                            key={layer}
                            blocks={nonEmptyBlocks}
                            cubeGeometries={cubeGeometries}
                            layer={layer}
                        />
                    ))
                }
            </group>

            {
                // Display a circle for each grid position and display all markers
                debug &&
                scanOutput &&
                <group>
                    <group>
                        {scanOutput.gridSpaces.map((space, i) => (
                            <GridSpaceMarker
                                gridSpace={space}
                                key={i}
                            />
                        ))}
                    </group>

                    <PointMarkers visible={showMarkers} positions={scanOutput.markersInside} proximity="inside" />
                    <PointMarkers visible={showMarkers} positions={scanOutput.markersNear} proximity="near" />
                    <PointMarkers visible={showMarkers} positions={scanOutput.markersOutside} proximity="outside" />
                </group>
            }

            {
                debug &&
                meshes.map(mesh => (
                    <PointMarker
                        key={mesh.id}
                        position={mesh.position}
                        color="orange"
                        scale={3}
                        visible={showMarkers}
                    />
                ))
            }

            {
                scanOutput &&
                showMeshBoundingBoxes &&
                scanOutput.meshBboxes.map((bbox, i) => (
                    <BoundingBox box={bbox} key={i} />
                ))
            }


        </group>
    )
}


function getLayers(blocks: GridSpace[]): number[] {
    const layers = new Set<number>()
    for (const block of blocks) {
        const layer = block.gridPosition.y
        layers.add(layer)
    }
    return Array.from(layers)
}



// function getCenterOffset(gridSize?: Vector3): Vector3 {
//     if (!gridSize)
//         return new Vector3(0, 0, 0)

//     const offset = new Vector3(0, 0, 0)
//     if (gridSize.x % 2 === 0) {
//         offset.x = 0.5
//     }
//     if (gridSize.z % 2 === 0) {
//         offset.z = 0.5
//     }
//     return offset
// }
