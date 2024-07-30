import { Html } from "@react-three/drei"
import { useSettingsStore } from "../../stores/useSettingsStore"
import { PointMarker } from "./PointMarker"
import { GridSpace } from "../../lib/GridSpace"
import { formatSignature } from "../../lib/misc"


type GridSpaceVisualizationProps = {
    gridSpace: GridSpace
}


export default function GridSpaceMarker({ gridSpace }: GridSpaceVisualizationProps) {

    const empty = gridSpace.isEmpty()

    const showLabels = useSettingsStore(store => store.showLabels)
    const showMarkers = useSettingsStore(store => store.showMarkers)

    return (
        <group position={gridSpace.worldPosition}>

            {/* Marker for the gridspace center */}
            <PointMarker
                color="violet"
                position={[0, 0, 0]}
                scale={3}
                visible={showMarkers}
            />

            <Html
                style={{
                    whiteSpace: "pre",
                    // pointerEvents: "none",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    fontFamily: "monospace",
                    display: (empty || !showLabels) ? "none" : "block",
                    maxWidth: "20rem",
                    overflow: "auto",
                    transform: "translateX(-50%) translateY(-50%)",
                }}
            >
                {JSON.stringify({
                    empty,
                    name: gridSpace.matchingBlock?.blockName || "unknown",
                    perfect: gridSpace.matchingBlock?.perfect,
                    position: gridSpace.worldPosition.toArray().join(", "),
                    signature: gridSpace.getSignature(),
                }, null, 4)}
                {/* {formatSignature(gridSpace.getSignature(), 8)} */}
            </Html>
        </group>
    )
}
