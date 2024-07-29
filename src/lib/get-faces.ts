import { Vector3, Mesh, Triangle } from "three"

function isIndexed(mesh: Mesh) {
    return mesh.geometry.index != null
}


function getFaceOfIndexedGeometry(mesh: Mesh, faceIndex: number): Triangle {
    const position = mesh.geometry.getAttribute('position')

    const index = mesh.geometry.getIndex()!

    // console.info("Getting face " + faceIndex + "...")

    const i1 = index.array[faceIndex * 3]
    const i2 = index.array[faceIndex * 3 + 1]
    const i3 = index.array[faceIndex * 3 + 2]

    // const v1 = new Vector3().fromBufferAttribute(position, i1)
    // const v2 = new Vector3().fromBufferAttribute(position, i2)
    // const v3 = new Vector3().fromBufferAttribute(position, i3)

    const v1 = new Vector3(position.getX(i1), position.getY(i1), position.getZ(i1))
    const v2 = new Vector3(position.getX(i2), position.getY(i2), position.getZ(i2))
    const v3 = new Vector3(position.getX(i3), position.getY(i3), position.getZ(i3))

    const face = new Triangle(v1, v2, v3)
    return face
}

export function getFaces(mesh: Mesh): Triangle[] {

    if (!isIndexed(mesh)) {
        throw new Error("Mesh is not indexed!")
    }

    const index = mesh.geometry.getIndex()

    if (!index) {
        throw new Error("Mesh has no index!")
    }

    const faces: Triangle[] = []

    const faceCount = index.count / 3

    for (let faceIndex = 0; faceIndex < faceCount; faceIndex++) {
        faces.push(getFaceOfIndexedGeometry(mesh, faceIndex))
    }

    return faces
}
