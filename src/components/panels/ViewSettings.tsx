import s from "./ViewSettings.module.scss"
import { useMemo } from "react"
import { useSettingsStore } from "../../stores/useSettingsStore"
import { ScanOutput } from "../../types"
import { useDebug } from "../../hooks/useDebug"
import { IconArrowsMaximize, IconPackages } from "@tabler/icons-react"
import BinaryRadio from "./BinaryRadio"

type Props = {
    scanOutput: ScanOutput | null
}

export function ViewSettings({ scanOutput }: Props) {

    const showBlocks = useSettingsStore(store => store.showBlocks)
    const setShowBlocks = useSettingsStore(store => store.setShowBlocks)

    const showMeshBoundingBoxes = useSettingsStore(store => store.showMeshBoundingBoxes)
    const setShowMeshBoundingBoxes = useSettingsStore(store => store.setShowMeshBoundingBoxes)

    const visibleLayers = useSettingsStore(store => store.visibleLayers)
    const setVisibleLayers = useSettingsStore(store => store.setVisibleLayers)

    const blockCount = useMemo(() => {
        let count = 0
        if (scanOutput)
            for (const space of scanOutput.gridSpaces) {
                if (!space.isEmpty()) {
                    count += 1
                }
            }
        return count
    }, [scanOutput])

    const debug = useDebug()

    if (!scanOutput)
        return null

    const { x, y, z } = scanOutput.gridSize

    if (blockCount === 0) {
        return <p>No blocks found. Make sure to apply scale and rotation to each mesh before exporting the models.</p>
    }

    // Hide the layer slider when there's only 1 layer
    const showSlider = debug || scanOutput.gridSize.y > 1

    return (
        <div className={s.container}>

            <table>
                <tbody>
                    <tr>
                        <td><IconArrowsMaximize size={16} /></td>
                        <td>Grid size</td>
                        <td>{x} x {z} x {y}</td>
                    </tr>
                    <tr>
                        <td><IconPackages size={16} /></td>
                        <td>Blocks</td>
                        <td>{blockCount}</td>
                    </tr>
                </tbody>
            </table>

            <hr />

            <BinaryRadio
                labels={["Show model", "Show blocks"]}
                firstChecked={!showBlocks}
                onCheckedFirst={() => setShowBlocks(false)}
                onCheckedSecond={() => setShowBlocks(true)}
            />

            <label>
                <input type="checkbox" checked={showMeshBoundingBoxes} onChange={(e) => setShowMeshBoundingBoxes(e.target.checked)} />
                Show mesh bounds
            </label>

            {
                showSlider &&
                <label className={s.slider}>
                    Layer {visibleLayers + 1}/{scanOutput.gridSize.y}&nbsp;
                    <input
                        type="range"
                        min={debug ? -1 : 0}
                        max={scanOutput.gridSize.y - 1}
                        value={visibleLayers}
                        onChange={(e) => setVisibleLayers(e.target.valueAsNumber)}
                        step={1}
                    />
                </label>
            }

        </div>
    )
}
