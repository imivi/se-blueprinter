import { BlockSignature } from "../types"
import { compareCorners, compareFaces, countSameCharacters } from "./block-signature-utils"


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
        const matchesWithSameFaces: Match[] = []
        const lowSimilarityMatches: Match[] = []

        for (const block of this.items) {

            const sameCorners = compareCorners(input, block.signature)

            // Prioritize blocks with same corner points
            // As long as we have at least 1 same-corner match, ignore all different-corner matches
            if (!sameCorners && matchesWithSameCorners.length > 0)
                continue

            // Prioritize blocks with same faces
            const sameFaces = compareFaces(input, block.signature)
            if (!sameFaces && matchesWithSameFaces.length > 0)
                continue

            const sameFacesCount = countSameCharacters(input, block.signature, 32, 38) / 6
            const sameEdgesCount = countSameCharacters(input, block.signature, 8, 32) / 24

            const match = {
                score: sameFacesCount + sameEdgesCount,
                name: block.name,
                signature: block.signature,
            }

            if (sameCorners)
                matchesWithSameCorners.push(match)
            else if (sameFaces)
                matchesWithSameFaces.push(match)
            else
                lowSimilarityMatches.push(match)
        }

        // Sort matches by highest score (only return those with matching corners, if any)
        if (matchesWithSameCorners.length > 0)
            return getHighestScoreMatch(matchesWithSameCorners)
        else if (matchesWithSameFaces.length > 0)
            return getHighestScoreMatch(matchesWithSameFaces)
        else
            return getHighestScoreMatch(lowSimilarityMatches)
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