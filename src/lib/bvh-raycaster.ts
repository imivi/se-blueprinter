import { BufferGeometry, Mesh, Raycaster, Vector3 } from 'three'
import { MeshBVH, acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'

/*
https://github.com/gkjohnson/three-mesh-bvh
*/

// Add the raycast function. Assumes the BVH is available on the `boundsTree` variable
Mesh.prototype.raycast = acceleratedRaycast


interface BvhBufferGeometry extends BufferGeometry {
    boundsTree?: MeshBVH
    computeBoundsTree: typeof computeBoundsTree
    disposeBoundsTree: typeof disposeBoundsTree
}

export function createBvh(geometry: BufferGeometry): BvhBufferGeometry {
    const bvhGeometry = geometry as BvhBufferGeometry
    bvhGeometry.boundsTree = new MeshBVH(geometry)
    return bvhGeometry
}

export class BvhRaycaster extends Raycaster {
    firstHitOnly?: boolean
    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number) {
        super(origin, direction, near, far)
        this.firstHitOnly = true
    }
}
