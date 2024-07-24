import { Vector3 } from "three"

type Props = {
    position: Vector3 | [number, number, number]
    color: string
    opacity?: number
    scale?: number
    visible?: boolean
}

export function PointMarker({ position, color, visible = true, opacity = 1, scale = 1 }: Props) {
    const radius = 0.02
    const widthSegments = 8
    const heightSegments = 8
    return (
        <mesh position={position} scale={scale} visible={visible}>
            <sphereGeometry args={[radius, widthSegments, heightSegments]} />
            <meshBasicMaterial color={color} opacity={opacity} transparent={opacity < 1} />
        </mesh>
    )
}