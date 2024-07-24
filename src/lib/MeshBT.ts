import { Mesh, Vector3 } from "three"
import { HitPointInfo, MeshBVH } from "three-mesh-bvh"


export class MeshBT extends Mesh {
    computeBoundsTree() {
        // @ts-expect-error "This method comes from three-mesh-bvh"
        this.geometry.computeBoundsTree()
    }

    getDistanceToPoint(point: Vector3, output: HitPointInfo, min: number, max: number): void {
        // @ts-expect-error "This property comes from three-mesh-bvh"
        const boundsTree = this.geometry.boundsTree as MeshBVH
        boundsTree.closestPointToPoint(point, output, min, max)
    }
}

export function createMeshBvh(mesh: Mesh): MeshBT {
    // @ts-expect-error "Property used by three-mesh-bvh"
    mesh.geometry.boundsTree = new MeshBVH(mesh.geometry)
    return mesh as MeshBT
}
