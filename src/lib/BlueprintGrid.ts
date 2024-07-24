import { Box3, Mesh, Vector3 } from "three"


export class BlueprintGrid {

    bbox: Box3
    gridSize: Vector3

    constructor(meshes: Mesh[]) {
        this.bbox = getCombinedBoundingBox(meshes)

        // Make sure the bbox size is an integer
        this.gridSize = this.bbox.getSize(new Vector3())
        this.gridSize.x = Math.ceil(this.gridSize.x)
        this.gridSize.y = Math.ceil(this.gridSize.y)
        this.gridSize.z = Math.ceil(this.gridSize.z)
        this.bbox.max.set(
            this.bbox.min.x + this.gridSize.x,
            this.bbox.min.y + this.gridSize.y,
            this.bbox.min.z + this.gridSize.z,
        )
    }

    /** Returns the bounding box of a mesh, but it's aligned with the scene grid */
    getGridAlignedMeshBbox(mesh: Mesh): Box3 {
        mesh.geometry.computeBoundingBox()
        const meshBbox = mesh.geometry.boundingBox!
        const worldMin = mesh.localToWorld(meshBbox.min.clone())
        const worldMax = mesh.localToWorld(meshBbox.max.clone())

        // get the distance from scene origin to bbox min, then round it down
        const offsetMin = worldMin.clone().sub(this.bbox.min).add(new Vector3(0.1, 0.1, 0.1)).floor()

        // get the distance from scene origin to bbox max, then round it up
        const offsetMax = worldMax.sub(this.bbox.min).ceil()

        // Get the world positions, aligned to the scene grid
        const worldMinAligned = this.bbox.min.clone().add(offsetMin)
        const worldMaxAligned = this.bbox.min.clone().add(offsetMax)

        return new Box3(worldMinAligned, worldMaxAligned)
    }

    /** Converts a world coordinate (float) into a grid coordinate (integer) */
    getGridPositionAt(worldPosition: Vector3): Vector3 {
        const offset = worldPosition.clone().sub(this.bbox.min).round()
        return offset
    }
}


function getCombinedBoundingBox(meshes: Mesh[]): Box3 {

    if (meshes.length === 0)
        return new Box3()

    const min = new Vector3(0, 0, 0)
    const max = new Vector3(0, 0, 0)

    meshes.forEach((mesh, i) => {
        const firstMesh = i === 0

        mesh.geometry.computeBoundingBox()

        const bboxWorld = mesh.geometry.boundingBox!
        const bboxMin = mesh.localToWorld(bboxWorld.min.clone())
        const bboxMax = mesh.localToWorld(bboxWorld.max.clone())

        if (firstMesh || bboxMin.x < min.x) min.x = bboxMin.x
        if (firstMesh || bboxMin.y < min.y) min.y = bboxMin.y
        if (firstMesh || bboxMin.z < min.z) min.z = bboxMin.z

        if (firstMesh || bboxMax.x > max.x) max.x = bboxMax.x
        if (firstMesh || bboxMax.y > max.y) max.y = bboxMax.y
        if (firstMesh || bboxMax.z > max.z) max.z = bboxMax.z
    })

    return new Box3(min, max)
}
