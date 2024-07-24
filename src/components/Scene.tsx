import { Environment, Grid, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { ColorManagement, DoubleSide } from "three"
import SlicedPreview from "./scene/SlicedPreview"
import { useScanMeshes } from "../hooks/useScanMeshes"
import { useRaycastDirection } from "../hooks/useRaycastDirection"
import { useGltfMeshes } from "../hooks/useGltfMeshes"
import { useSampleData } from "../hooks/useSampleData"
import SampleBlocks from "./scene/SampleBlocks"
import { useGltfStore } from "../stores/useGltfStore"
import Loader from "./Loader"
import { Controls } from "./panels/Controls"
import { useDebug } from "../hooks/useDebug"


ColorManagement.enabled = true




export default function Scene() {

    const raycastDirection = useRaycastDirection()

    const { sampleSignatures, sampleMeshes, sampleGeometries } = useSampleData(raycastDirection)

    const meshes = useGltfMeshes()

    const debug = useDebug()

    const { runScan, scanOutput } = useScanMeshes(raycastDirection, meshes, debug, sampleMeshes.length)

    const loading = useGltfStore(store => store.loading)

    return (
        <main>

            <Controls
                sampleSignatures={sampleSignatures}
                meshes={meshes}
                onScan={runScan}
                scanOutput={scanOutput}
            />

            {loading && <Loader />}

            <Canvas
                gl={{ preserveDrawingBuffer: true }} // Must be enabled to save screenshots of the canvas
                frameloop="demand"
                camera={{ position: [0, 5, 10] }}
                style={{ width: "100vw", height: "100vh" }}
            >

                <ambientLight intensity={Math.PI / 2} />
                <Environment files="/environment.jpg" background />
                <OrbitControls />

                <axesHelper args={[1]} />
                <Grid
                    args={[10, 10]}
                    cellSize={1}
                    sectionSize={10}
                    sectionThickness={1}
                    cellColor="white"
                    sectionColor="#aaa"
                    infiniteGrid={true}
                    side={DoubleSide}
                />

                {
                    debug &&
                    <SampleBlocks
                        samplesMeshes={sampleMeshes}
                        samplePoints={sampleSignatures}
                        visible={true}
                    />
                }

                {
                    meshes.length > 0 &&
                    <SlicedPreview
                        meshes={meshes}
                        scanOutput={scanOutput}
                        cubeGeometries={sampleGeometries}
                    />
                }

            </Canvas>

        </main >
    )
}
