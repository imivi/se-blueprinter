import { BlockSignature } from "../types"
import { compareCorners, countSameCharacters } from "./block-signature-utils"


type Match = {
    score: number
    name: string
    signature: string
}


export interface BlockSearchEngine {
    setCollection: (items: BlockSignature[]) => void
    search: (key: string) => BlockSignature
}


export class BasicSearchEngine implements BlockSearchEngine {

    items: BlockSignature[] = []

    setCollection(items: BlockSignature[]) {
        this.items = items
    }

    search(input: string): BlockSignature {
        const matchesWithSameCorners: Match[] = []
        const matchesWithDifferentCorners: Match[] = []

        for (const block of this.items) {

            const sameCorners = compareCorners(input, block.signature)

            // Prioritize blocks with same corner points
            // As long as we have at least 1 same-corner match, ignore all different-corner matches
            if (!sameCorners && matchesWithDifferentCorners.length > 0)
                continue

            const match = {
                score: countSameCharacters(input, block.signature),
                name: block.name,
                signature: block.signature,
            }

            if (sameCorners)
                matchesWithSameCorners.push(match)
            else if (matchesWithSameCorners.length === 0)
                matchesWithDifferentCorners.push(match)
        }

        // Sort matches by highest score (only return those with matching corners, if any)
        if (matchesWithSameCorners.length > 0)
            return getHighestScoreMatch(matchesWithSameCorners)
        else
            return getHighestScoreMatch(matchesWithDifferentCorners)
    }
}

function getHighestScoreMatch(matches: Match[]): Match {
    let best = matches[0]
    for (let i = 1; i < matches.length; i++) {
        if (matches[i].score > best.score)
            best = matches[i]
    }
    return best
}