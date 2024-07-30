import { expect, test } from "vitest"
import { GridSpace } from "./GridSpace"
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { createMeshBvh } from "./MeshBT"
import { BlockFinder } from "./BlockFinder"
import { blockSignatures } from "../blocks/block-signatures"
import { getCornerEdgeCenterPatternOffsets } from "./get-pattern-offsets"
import { BasicSearchEngine } from "./BlockSearchEngine"


test("GridSpace class", () => {
    const worldPos = new Vector3(0, 0, 0)
    const gridPos = new Vector3(0, 0, 0)
    const gridSpace = new GridSpace(worldPos, gridPos)

    expect(gridSpace.isEmpty()).toBe(true)
    expect(gridSpace.isFullCube()).toBe(false)

    expect(gridSpace.getSignature()).toBe("")

    const pattern = [-0.4, -0.05, 0.05, 0.4]

    const raycastDirection = new Vector3(0, 1, 0)
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ side: DoubleSide })
    const mesh = new Mesh(geometry, material)
    const meshBT = createMeshBvh(mesh)
    meshBT.position.set(...worldPos.toArray())
    meshBT.name = "test_mesh"

    const searchEngine = new BasicSearchEngine()
    const blockFinder = new BlockFinder(searchEngine)

    const pointOffsets = getCornerEdgeCenterPatternOffsets(pattern)

    gridSpace.scanMeshForPoints({
        blockFinder,
        closenessThreshold: 0.1,
        disabledBlocks: new Set<string>(),
        mesh: meshBT,
        raycastDirection,
        replacementPolicy: "next best",
        pointOffsets,
        signatures: blockSignatures,
        maxDistanceFromMeshSurface: null,
    })

    expect(gridSpace.points.length).toBe(8)

    // console.log("matchingBlock", gridSpace.matchingBlock)

    expect(gridSpace.isEmpty()).toBe(false)
    expect(gridSpace.isFullCube()).toBe(true)
    expect(gridSpace.matchingBlock).toMatchObject({
        blockName: "blockfu",
        perfect: true,
    })
})