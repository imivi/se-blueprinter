import { getBlockName } from "../blocks/get-block-name"
import { ArmorType, BlockData, GridSize } from "../types"

type Options = {
    playerDisplayName: string // digits only
    cubeGridDisplayName: string // digits only
    entityId: string // digits only
    ownerSteamId: string // digits only
    gridSize: GridSize
    armorType: ArmorType
    staticGrid: boolean
    blocks: BlockData[]
}

export function generateBlueprintXml(options: Options): string {

    const startXml = generateBlueprintStart(options)
    const endXml = generateBlueprintEnd(options)
    const blocksXml = options.blocks.map(block => generateBlockXml(block, getBlockName(block.baseName.toLowerCase(), options.gridSize, options.armorType)))

    return [startXml, blocksXml, endXml].flat().join("\n")
}

function generateBlockXml(block: BlockData, blockName: string): string {

    const [x, y, z] = block.position

    if (block.forward === "Forward" && block.up === "Up")
        return (
            `<MyObjectBuilder_CubeBlock xsi:type="MyObjectBuilder_CubeBlock">
<SubtypeName>${blockName}</SubtypeName>
<Min x="${x}" y="${y}" z="${z}" />
</MyObjectBuilder_CubeBlock>`
        )

    return (
        `<MyObjectBuilder_CubeBlock xsi:type="MyObjectBuilder_CubeBlock">
<SubtypeName>${blockName}</SubtypeName>
<Min x="${x}" y="${y}" z="${z}" />
<BlockOrientation Forward="${block.forward}" Up="${block.up}" />
</MyObjectBuilder_CubeBlock>`
    )
}

function generateBlueprintStart({ playerDisplayName, gridSize, entityId }: Options): string {
    return (
        `<?xml version="1.0"?>
<Definitions xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<ShipBlueprints>
<ShipBlueprint xsi:type="MyObjectBuilder_ShipBlueprintDefinition">
<Id Type="MyObjectBuilder_ShipBlueprintDefinition" Subtype="Three" />
<DisplayName>${playerDisplayName}</DisplayName>
<CubeGrids>
<CubeGrid>
<SubtypeName />
<EntityId>${entityId}</EntityId>
<PersistentFlags>CastShadows InScene</PersistentFlags>
<PositionAndOrientation>
<Position x="13377.074374812126" y="143889.59621305511" z="-108819.58197518782" />
<Forward x="-3.06299046E-18" y="2.26627966E-18" z="-1" />
<Up x="2.92978336E-18" y="1" z="2.26627966E-18" />
<Orientation>
<X>1.13313983E-18</X>
<Y>1.53149523E-18</Y>
<Z>-1.46489168E-18</Z>
<W>1</W>
</Orientation>
</PositionAndOrientation>
<LocalPositionAndOrientation xsi:nil="true" />
<GridSizeEnum>${gridSize}</GridSizeEnum>
<CubeBlocks>`
    )
}

function generateBlueprintEnd({ ownerSteamId, cubeGridDisplayName, staticGrid }: Options): string {
    return (
        `</CubeBlocks>
<IsStatic>${staticGrid ? "true" : "false"}</IsStatic>
<DisplayName>${cubeGridDisplayName}</DisplayName>
<DestructibleBlocks>true</DestructibleBlocks>
<IsRespawnGrid>false</IsRespawnGrid>
<LocalCoordSys>2</LocalCoordSys>
<TargetingTargets />
</CubeGrid>
</CubeGrids>
<EnvironmentType>None</EnvironmentType>
<WorkshopId>0</WorkshopId>
<OwnerSteamId>${ownerSteamId}</OwnerSteamId>
<Points>0</Points>
</ShipBlueprint>
</ShipBlueprints>
</Definitions>`
    )
}