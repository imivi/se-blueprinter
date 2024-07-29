import { expect, test } from "vitest"
import { GridSpace } from "./GridSpace"
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { createMeshBvh } from "./MeshBT"
import { BasicSearchEngine, BlockFinder } from "./BlockFinder"
import { blockSignatures } from "../blocks/block-signatures"


test("GridSpace class", () => {
    const worldPos = new Vector3(0, 0, 0)
    const gridPos = new Vector3(0, 0, 0)
    const gridSpace = new GridSpace(worldPos, gridPos)

    expect(gridSpace.isEmpty()).toBe(true)
    expect(gridSpace.isFullCube()).toBe(false)

    expect(gridSpace.getSignature()).toBe("")

    const pattern = [-0.4, -0.05, 0.05, 0.4]
    gridSpace.setPattern(pattern)

    const raycastDirection = new Vector3(0, 1, 0)
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ side: DoubleSide })
    const mesh = new Mesh(geometry, material)
    const meshBT = createMeshBvh(mesh)
    meshBT.position.set(...worldPos.toArray())
    meshBT.name = "test_mesh"

    const searchEngine = new BasicSearchEngine()
    const blockFinder = new BlockFinder(searchEngine)

    gridSpace.scanMeshForPoints({
        blockFinder,
        closenessThreshold: 0.1,
        disabledBlocks: new Set<string>(),
        mesh: meshBT,
        raycastDirection,
        replacementPolicy: "next best",
        signatures: blockSignatures.slopes_full,
        maxDistanceFromMeshSurface: null,
    })

    expect(gridSpace.points).toHaveLength(pattern.length * pattern.length * pattern.length)

    console.log("matchingBlock", gridSpace.matchingBlock)

    expect(gridSpace.isEmpty()).toBe(false)
    expect(gridSpace.isFullCube()).toBe(true)
    expect(gridSpace.matchingBlock).toMatchObject({
        blockName: "blockfu",
        perfect: true,
    })

    // expect(gridSpace.getSignature()).toBe("111111111111111111111111111")
})