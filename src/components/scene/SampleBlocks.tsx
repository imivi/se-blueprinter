import SampleBlock from "./SampleBlock";
import { maxVisibleMarkers } from "../../settings";
import { BlockPoints } from "../../types";
import { Mesh } from "three";


type Props = {
    samplesMeshes: Mesh[]
    samplePoints: BlockPoints[]
    visible: boolean
}

export default function SampleBlocks({ samplesMeshes, samplePoints, visible }: Props) {

    return (
        <group visible={visible}>
            {samplesMeshes.map((block, i) => (
                <SampleBlock
                    block={block}
                    points={samplePoints[i].points}
                    key={block.name}
                    showLabels={visible && i < maxVisibleMarkers}
                />
            ))}
        </group>
    )
}