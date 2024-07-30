import { BlockSignature } from "../types"
import { countSameCharacters, sameCorners } from "./block-signature-utils"


type Match = {
    score: number
    name: string
    signature: string
}


export interface BlockSearchEngine {
    setCollection: (items: BlockSignature[]) => void
    search: (key: string) => BlockSignature[]
}


export class BasicSearchEngine implements BlockSearchEngine {

    items: BlockSignature[] = []

    setCollection(items: BlockSignature[]) {
        this.items = items
    }

    search(input: string): BlockSignature[] {
        const matchesWithSameCorners: Match[] = []
        const matchesWithDifferentCorners: Match[] = []

        for (const block of this.items) {
            const match = {
                score: countSameCharacters(input, block.signature),
                name: block.name,
                signature: block.signature,
            }

            // Prioritize blocks with same corner points
            if (sameCorners(input, block.signature))
                matchesWithSameCorners.push(match)
            else
                matchesWithDifferentCorners.push(match)
        }

        // Sort matches by highest score (only return those with matching corners, if any)
        if (matchesWithSameCorners.length > 0)
            return matchesWithSameCorners.sort((a, b) => b.score - a.score)
        else
            return matchesWithDifferentCorners.sort((a, b) => b.score - a.score)
    }
}
