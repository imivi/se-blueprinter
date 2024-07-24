import { expect, test } from "vitest"
import { GridSpace } from "./GridSpace"
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { createMeshBvh } from "./MeshBT"


test("GridSpace class", () => {
    const worldPos = new Vector3(0, 0, 0)
    const gridPos = new Vector3(0, 0, 0)
    const gridSpace = new GridSpace(worldPos, gridPos)

    expect(gridSpace.isEmpty()).toBe(true)
    expect(gridSpace.isFull()).toBe(false)

    expect(gridSpace.getSignature()).toBe("")

    const pattern = [-0.3, 0, 0.3]
    gridSpace.setPattern(pattern)

    const raycastDirection = new Vector3(0, 1, 0)
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ side: DoubleSide })
    const mesh = new Mesh(geometry, material)
    const meshBT = createMeshBvh(mesh)
    meshBT.position.set(...worldPos.toArray())
    meshBT.name = "test_mesh"

    gridSpace.scanMeshForPoints(meshBT, raycastDirection, 0.1)

    expect(gridSpace.points).toHaveLength(pattern.length * pattern.length * pattern.length)

    expect(gridSpace.isEmpty()).toBe(false)
    expect(gridSpace.isFull()).toBe(true)

    expect(gridSpace.getSignature()).toBe("111111111111111111111111111")
})