import { Vector3 } from "three"

export class Point {

    constructor(
        public position: Vector3,
        public inside: boolean, // using raycast
        public near: boolean | null, // using closestPointToPoint
    ) { }

    isFull(): boolean {
        return this.inside || !!this.near
    }

    isEmpty(): boolean {
        return !this.isFull()
    }
}