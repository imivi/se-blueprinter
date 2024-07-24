import s from "./CreateBlueprintButtons.module.scss"

import { IconCheck, IconCopy, IconCube, IconDownload } from "@tabler/icons-react";
import { useBlueprintFieldsStore } from "../../stores/useBlueprintFieldsStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useState } from "react";
import { BlueprintFields, downloadBlueprintZip, generateBlueprint } from "../../lib/download-blueprint";
import { ScanOutput } from "../../types";
import { useCanvasImage } from "../../hooks/useCanvasImage";
import { GridSpace } from "../../lib/GridSpace";


type Props = {
    scanOutput: ScanOutput | null
    onScan: () => void
}


export default function CreateBlueprintButtons({ onScan, scanOutput }: Props) {

    const blueprintFields = useBlueprintFieldsStore()

    const settingsModified = useSettingsStore(store => store.settingsModified)

    const { getResizedImage } = useCanvasImage()

    const [loading, setLoading] = useState(false)

    function scanMesh() {
        setLoading(true)
        window.setTimeout(() => {
            onScan()
            setLoading(false)
        }, 100)
    }

    async function onDownloadBlueprint() {
        if (scanOutput) {
            try {
                const canvasImage = await getResizedImage()
                downloadBlueprintZip(scanOutput.gridSpaces, blueprintFields, canvasImage)
            }
            catch (error) {
                alert(error)
            }
        }
    }

    return (
        <div className={s.buttons}>
            {
                settingsModified &&
                <button
                    onClick={scanMesh}
                    className={s.btn_create}
                    disabled={loading}
                    data-loading={loading}
                >
                    <IconCube size={20} />
                    {loading ? "Creating blueprint..." : "Create blueprint"}
                </button>
            }
            {
                !settingsModified &&
                scanOutput &&
                <>
                    <button disabled={!scanOutput} className={s.btn_download} onClick={onDownloadBlueprint}>
                        <IconDownload size={20} /> Download blueprint
                    </button>
                    <CopyBlueprintButton gridSpaces={scanOutput.gridSpaces} blueprintFields={blueprintFields} />
                </>
            }
        </div>
    )
}


type CopyButtonProps = {
    gridSpaces: GridSpace[]
    blueprintFields: BlueprintFields
}

function CopyBlueprintButton({ gridSpaces, blueprintFields }: CopyButtonProps) {

    const [copied, setCopied] = useState(false)

    async function copyBlueprint() {
        const xml = generateBlueprint(gridSpaces, blueprintFields)

        try {
            await navigator.clipboard.writeText(xml)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <button className={s.btn_copy} onClick={copyBlueprint}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            {copied ? "Copied!" : "Copy to clipboard"}
        </button>
    )
}