import { Html } from "@react-three/drei"
import { Mesh } from "three"
import { PointMarker } from "./PointMarker"
import { useState } from "react"
import { Point } from "../../lib/Point"



type Props = {
    block: Mesh
    points: Point[]
    showLabels: boolean
}

export default function SampleBlock({ block, points, showLabels }: Props) {

    const [selected, setSelected] = useState(false)

    return (
        <group onClick={(e) => { e.stopPropagation(); setSelected(!selected) }}>
            <primitive object={block} />

            <group visible={selected}>
                {points.map((point, i) => (
                    <PointMarker
                        key={i}
                        position={point.position}
                        color={getMarkerColor(point)}
                    />
                ))}
            </group>

            {
                selected &&
                <Html
                    position={[block.position.x, block.position.y + 1, block.position.z]}
                    style={{
                        fontFamily: "monospace",
                        lineHeight: 1,
                        pointerEvents: "none",
                        fontSize: "0.8rem",
                        color: "#ccc",
                        display: showLabels ? "unset" : "none",
                    }}
                    center
                >
                    {block.name}
                </Html>
            }

        </group>
    )
}


/** Green if raycast found intersections, yellow if distance is ok, red if distance too far */
function getMarkerColor(point: Point): string {
    if (!point.inside && point.near) {
        return "orange"
    }
    if (point.inside) {
        return "green"
    }
    return "brown"
}