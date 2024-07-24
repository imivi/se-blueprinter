import { Box3, Vector3 } from "three"
import { GridSpace, hashPosition } from "./GridSpace"
import { BlueprintGrid } from "./BlueprintGrid"
import { MeshBT } from "./MeshBT"
import { pointIsInsideMesh } from "./point-utils"


type Options = {
    meshes: MeshBT[]
    offsets: number[]
    raycastDirection: Vector3
    closenessThreshold: number
    maxDistanceFromMeshSurface: number | null
}

type GridSpaces = Map<string, GridSpace>

type Output = {
    gridSpaces: GridSpace[]
    gridSize: Vector3
    bbox: Box3
    meshBboxes: Box3[]
}

const sixRaycastDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),
]

export function scanMeshes({ meshes, offsets, raycastDirection, closenessThreshold, maxDistanceFromMeshSurface }: Options): Output | null {

    if (meshes.length === 0) {
        console.warn("No meshes received, cannot scan!")
        return null
    }

    const gridSpaces = new Map<string, GridSpace>()

    const grid = new BlueprintGrid(meshes)

    const meshBboxes: Box3[] = []
    meshes.forEach((mesh, i) => {
        const { meshBbox } = createMeshGridSpaces(grid, mesh, i, gridSpaces)
        meshBboxes.push(meshBbox)
    })

    // Scan meshes for blocks
    for (const gridSpace of gridSpaces.values()) {
        gridSpace.setPattern(offsets)

        for (const meshIndex of gridSpace.parentMeshes) {
            if (gridSpace.isEmpty())
                gridSpace.scanMeshForPoints(meshes[meshIndex], raycastDirection, closenessThreshold)
        }
    }

    // Mark cubes as hollow
    // For each grid space, raycast along all six axes from the block center to each parent mesh
    // Only scan cubes that are full
    // If the cube is inside the mesh and the distance is too big, mark this cube as empty
    if (maxDistanceFromMeshSurface) {
        for (const gridSpace of gridSpaces.values()) {

            // Only test spaces that are full blocks
            if (!gridSpace.isFull()) {
                continue
            }

            let markEmpty = true

            for (const meshIndex of gridSpace.parentMeshes) {
                const mesh = meshes[meshIndex]
                for (const direction of sixRaycastDirections) {
                    const { inside, distance } = pointIsInsideMesh(gridSpace.worldPosition, mesh, direction)
                    if (!inside)
                        markEmpty = false
                    if (distance && distance < maxDistanceFromMeshSurface)
                        markEmpty = false
                }
            }

            if (markEmpty) {
                gridSpace.setAsEmpty()
            }
        }
    }

    const realGridSize = new Vector3(0, 0, 0)
    for (const gridSpace of gridSpaces.values()) {
        if (gridSpace.gridPosition.x > realGridSize.x)
            realGridSize.x = gridSpace.gridPosition.x
        if (gridSpace.gridPosition.y > realGridSize.y)
            realGridSize.y = gridSpace.gridPosition.y
        if (gridSpace.gridPosition.z > realGridSize.z)
            realGridSize.z = gridSpace.gridPosition.z
    }
    realGridSize.addScalar(1)

    return {
        gridSpaces: Array.from(gridSpaces.values()),
        meshBboxes,
        bbox: grid.bbox,
        gridSize: realGridSize,
    }
}




/**
 * Create all gridSpaces that are contained inside a mesh
 * @param combinedBoundingBox - the bounding box of all meshes
 * @param mesh - mesh to analyze
 * @param existingGridSpaces - the hashes of gridspaces already created. E.g. gridspace (0,0,0) is hashed to "0,0,0"
 */
function createMeshGridSpaces(grid: BlueprintGrid, mesh: MeshBT, meshIndex: number, allGridSpaces: GridSpaces): { newGridSpaces: GridSpace[], meshBbox: Box3 } {

    const alignedMeshBbox = grid.getGridAlignedMeshBbox(mesh)
    const meshSize = alignedMeshBbox.getSize(new Vector3())

    const newGridSpaces: GridSpace[] = []
    for (let y = 0; y < meshSize.y; y++) {
        for (let x = 0; x < meshSize.x; x++) {
            for (let z = 0; z < meshSize.z; z++) {
                const worldPosition = new Vector3(x, y, z).add(alignedMeshBbox.min)
                const gridPosition = grid.getGridPositionAt(worldPosition)

                const gridHash = hashPosition(gridPosition)

                const gridSpace = allGridSpaces.get(gridHash)
                if (gridSpace) {
                    gridSpace.parentMeshes.push(meshIndex)
                }
                else {
                    // Move the worldPosition so it's at the block center instead of min corner
                    worldPosition.x += 0.5
                    worldPosition.y += 0.5
                    worldPosition.z += 0.5

                    const newGridSpace = new GridSpace(worldPosition, gridPosition)
                    newGridSpace.parentMeshes.push(meshIndex)
                    allGridSpaces.set(gridHash, newGridSpace)
                    newGridSpaces.push(newGridSpace)
                }

            }
        }
    }

    return {
        newGridSpaces,
        meshBbox: alignedMeshBbox,
    }
}