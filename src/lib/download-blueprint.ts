import JSZip from "jszip";
import FileSaver from "file-saver";
import { blueprintReadmeText } from "../blueprint-readme";
import { generateBlueprintXml } from "./generate-blueprint-xml";
import { ArmorType, BlockData, GridSize } from "../types";
import { generate17digitsID, getBlockOrientation } from "./misc";
import { GridSpace } from "./GridSpace";




export type BlueprintFields = {
    cubeGridDisplayName: string
    entityId: string | null
    gridSize: GridSize
    armorType: ArmorType
    ownerSteamId: string
    staticGrid: boolean
    playerDisplayName: string
}


export async function downloadBlueprintZip(gridSpaces: GridSpace[], blueprintFields: BlueprintFields, canvasImageDataUrl: string) {


    // Fetch the image and parse the response stream as a blob
    const imageResponse = await fetch(canvasImageDataUrl)
    const imageData = await imageResponse.blob()
    const imgData = new File([imageData], "thumb.png");

    const bpName = blueprintFields.cubeGridDisplayName || "blueprint"

    const zip = new JSZip()
    zip.file("README.txt", blueprintReadmeText)
    zip.file(bpName + "/bp.sbc", generateBlueprint(gridSpaces, blueprintFields))
    zip.file(bpName + "/thumb.png", imgData, { base64: true })
    const zipBlob = await zip.generateAsync({ type: "blob" })
    FileSaver.saveAs(zipBlob, bpName + ".zip")
}

export function downloadBlueprint(gridSpaces: GridSpace[], blueprintFields: BlueprintFields) {
    const xml = generateBlueprint(gridSpaces, blueprintFields)
    const blob = new Blob([xml], { type: "text/plain;charset=utf-8" })
    FileSaver.saveAs(blob, "bp.sbc");
}

export function generateBlueprint(gridSpaces: GridSpace[], blueprintFields: BlueprintFields): string {

    const blocks: BlockData[] = []

    for (const space of gridSpaces) {
        if (space.isEmpty() || !space.matchingBlock)
            continue

        const [forward, up] = getBlockOrientation(space.matchingBlock.blockName)

        // Remove orientation code (last two letters)
        const name = space.matchingBlock.blockName.slice(0, space.matchingBlock.blockName.length - 2)

        blocks.push({
            position: space.gridPosition.toArray(),
            forward,
            up,
            baseName: name,
        })
    }

    const blueprintXml = generateBlueprintXml({
        ...blueprintFields,
        entityId: blueprintFields.entityId ?? generate17digitsID(),
        blocks,
    })

    return blueprintXml
}

