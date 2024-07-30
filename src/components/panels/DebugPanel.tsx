import { IconCopy, IconTerminal } from "@tabler/icons-react"
import { MeshBT } from "../../lib/MeshBT"
import { BlockSignature, ScanOutput } from "../../types"
import { useCanvasImage } from "../../hooks/useCanvasImage"
import Panel from "./Panel"
import { useSettingsStore } from "../../stores/useSettingsStore"
import { useSlicePattern } from "../../hooks/useSlicePattern"



type Props = {
    meshes: MeshBT[]
    scanOutput: ScanOutput | null
    sampleSignatures: BlockSignature[]
}

export default function DebugPanel({ meshes, scanOutput, sampleSignatures }: Props) {

    const showLabels = useSettingsStore(store => store.showLabels)
    const setShowLabels = useSettingsStore(store => store.setShowLabels)

    const showMarkers = useSettingsStore(store => store.showMarkers)
    const setShowMarkers = useSettingsStore(store => store.setShowMarkers)

    const offsets = useSlicePattern()

    const { getResizedImage, saveCanvasImage } = useCanvasImage()

    function getSignatures() {
        return sampleSignatures.map(data => ({
            name: data.name,
            signature: data.signature,
            // signature32: removeFacesAndCenter(data.signature),
        }))
    }

    function getDuplicateSignatures() {
        // const lines: string[] = []
        // for (const block of sampleSignatures) {
        //     lines.push([block.name, block.signature].join("\t"))
        // }
        // return lines.join("\n")
        const signatureCount: Record<string, string[]> = {}

        for (const block of sampleSignatures) {
            if (block.signature in signatureCount)
                signatureCount[block.signature].push(block.name)
            else
                signatureCount[block.signature] = [block.name]

        }
        for (const [key, value] of Object.entries(signatureCount)) {
            if (value.length < 2)
                delete signatureCount[key]
        }
        return signatureCount
    }

    function logSignatures() {
        console.log(getSignatures())
    }

    async function copySignatures() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(getSignatures(), null, 4))
            console.info("Copied signatures")
        }
        catch (error) {
            console.error(error)
        }
    }

    async function copyDuplicateSignatures() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(getDuplicateSignatures(), null, 4))
            console.info("Copied signatures")
        }
        catch (error) {
            console.error(error)
        }
    }


    return (
        <Panel bottom right>
            <fieldset style={{ display: "grid" }}>
                <legend>Debug</legend>
                <button onClick={copySignatures}><IconCopy size={18} /> Copy sample signatures + names({JSON.stringify(offsets)})</button>
                <button onClick={copyDuplicateSignatures}><IconCopy size={18} /> Copy duplicate signatures</button>
                <button onClick={logSignatures}><IconTerminal size={18} /> Log sample signatures</button>
                <button onClick={() => console.log(meshes)}><IconTerminal size={18} /> Log meshes</button>
                <button onClick={() => console.log(scanOutput)}><IconTerminal size={18} /> Log scanOutput</button>
                <button onClick={() => console.log(scanOutput?.gridSpaces.filter(space => !space.isEmpty()))}><IconTerminal size={18} /> Log non-empty cubes</button>

                <button onClick={saveCanvasImage}>save canvas image</button>
                <button onClick={async () => console.log(await getResizedImage())}>log resized image</button>

                <label>
                    <input type="checkbox" checked={showMarkers} onChange={(e) => setShowMarkers(e.target.checked)} />
                    Show markers
                </label>

                <label>
                    <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
                    Show labels
                </label>

            </fieldset>
        </Panel>
    )
}
