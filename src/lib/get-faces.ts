import { Vector3, Mesh, Triangle } from "three"

function isIndexed(mesh: Mesh) {
    return mesh.geometry.index != null
}

/** https://stackoverflow.com/questions/41540313/three-buffergeometry-accessing-face-indices-and-face-normals */
export function getFaces(mesh: Mesh) {
    const faces: Triangle[] = []
    const position = mesh.geometry.getAttribute('position')

    if (!isIndexed(mesh)) {
        console.warn("Mesh is not indexed!", mesh)
        return []
    }

    const index = mesh.geometry.getIndex()

    if (!index) {
        console.warn("Mesh has no index!", mesh)
        return []
    }

    // const normal = new Vector3() // create once and reuse

    const faceCount = index.count / 3

    // console.info("Face count:", faceCount)

    for (let faceIndex = 0; faceIndex < faceCount; faceIndex++) {

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

        /*
        // compute the index where the data is stored
        const vertexIndexes = [0, 1, 2].map(vertexNumber => {
            return index.array[3 * faceIndex + vertexNumber]
        })

        const v1 = new Vector3().fromBufferAttribute(position, vertexIndexes[0])
        const v2 = new Vector3().fromBufferAttribute(position, vertexIndexes[1])
        const v3 = new Vector3().fromBufferAttribute(position, vertexIndexes[2])
        */

        // const vertices = vertexIndexes.map(i => {
        //     return new Vector3(index.getX(i), index.getY(i), index.getZ(i))
        // })

        // get the vertex normal from the attribute data
        // const normals = vertexIndexes.map(i => normal.fromBufferAttribute(mesh.geometry.attributes.normal, i))

        const face = new Triangle(v1, v2, v3)
        faces.push(face)
        // console.log("Face", faceIndex, face)
    }

    return faces
}

/*
function getVertices(mesh) {
    const position = mesh.geometry.getAttribute('position')
    const vertices = []

    for (let i = 0 i < position.count / position.itemSize i++) {
        const vertex = new Vector3(
            position.getX(i),
            position.getY(i),
            position.getZ(i)
        )

        vertices.push(vertex)
    }

    return vertices
}

function getFaceVertexUvs(mesh) {
    const faceVertexUvs = []
    const uv = mesh.geometry.getAttribute('uv')

    if (isIndexed(mesh)) {
        const index = mesh.geometry.getIndex()

        for (let i = 0 i < index.count i += 3) {
            const faceVertexUv = [
                new Vector2(
                    uv.getX(index.getX(i)),
                    uv.getY(index.getX(i))
                ),
                new Vector2(
                    uv.getX(index.getX(i + 1)),
                    uv.getY(index.getX(i + 1))
                ),
                new Vector2(
                    uv.getX(index.getX(i + 2)),
                    uv.getY(index.getX(i + 2))
                )
            ]

            faceVertexUvs.push(faceVertexUv)
        }
    }
    else {
        for (let i = 0 i < uv.count i += 3) {
            const faceVertexUv = [
                new Vector2(
                    uv.getX(i),
                    uv.getY(i)
                ),
                new Vector2(
                    uv.getX(i + 1),
                    uv.getY(i + 1)
                ),
                new Vector2(
                    uv.getX(i + 2),
                    uv.getY(i + 2)
                )
            ]

            faceVertexUvs.push(faceVertexUv)
        }
    }

    return faceVertexUvs
}
*/