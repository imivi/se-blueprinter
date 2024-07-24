import { Box3, Vector3 } from "three"

type Props = {
    box: Box3
    visible?: boolean
}

export default function BoundingBox({ box, visible = true }: Props) {

    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())

    return (
        <mesh position={center} visible={visible}>
            <boxGeometry args={size.toArray()} />
            <meshBasicMaterial wireframe={true} color="coral" />
        </mesh>
    )
}