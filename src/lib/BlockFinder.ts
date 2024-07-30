import { BlockSignatures } from "./BlockSignatures"
import { sameCorners, sameCorners32 } from "./same-corners"
import { BlockSignature, ReplacementPolicy } from "../types"



interface SearchEngine {
    setCollection: (items: BlockSignature[]) => void
    search: (key: string) => BlockSignature[]
}


export class BasicSearchEngine implements SearchEngine {

    items: BlockSignature[] = []

    setCollection(items: BlockSignature[]) {
        this.items = items
    }

    search(input: string): BlockSignature[] {
        const matches: Match[] = []

        for (const block of this.items) {
            matches.push({
                score: countSameCharacters(input, block.signature),
                name: block.name,
                signature: block.signature,
            })
        }
        return matches.sort((a, b) => b.score - a.score)
    }
}

type Match = {
    score: number
    name: string
    signature: string
}

function countSameCharacters(text1: string, text2: string): number {
    let sameCharacterCount = 0
    for (let i = 0; i < text1.length; i++) {
        if (text1[i] === text2[i])
            sameCharacterCount += 1
    }
    return sameCharacterCount
}




export class BlockFinder {

    constructor(private readonly searchEngine: SearchEngine) { }

    setBlocks(newCollection: BlockSignature[]) {
        this.searchEngine.setCollection(newCollection)
    }

    findBestMatch(input: string, signatures: BlockSignatures, disabledBlocks: Set<string>, replacementPolicy: ReplacementPolicy): BlockSignature | null {

        const ones = countOnes(input)

        // If the regular cube clock is the only block selected,
        // the raycast offset pattern is [0] and the signature is either "0" or "1"
        if (input === "1") {
            return {
                name: "blockfu",
                signature: input,
            }
        }

        // We need at least 1 point to find a block
        if (ones < 1)
            return null

        const perfectMatch = signatures.getBlockName(input)

        if (perfectMatch) {
            const perfectMatchName = perfectMatch.slice(0, -2)
            if (!disabledBlocks.has(perfectMatchName)) {
                return {
                    name: perfectMatch,
                    signature: input,
                }
            }
            else if (replacementPolicy === "empty")
                return null
        }

        // Remember that fuse will never return disabled blocks!
        const results = this.searchEngine.search(input)

        // Return the first result with the same corners
        for (const result of results) {
            if (sameCorners32(input, result.signature))
                return result
        }

        // Otherwise just return the first result
        if (results.length > 0)
            return results[0]

        return null
    }
}


const basicSearchEngine = new BasicSearchEngine()
export const blockFinder = new BlockFinder(basicSearchEngine)


function countOnes(text: string): number {
    let count = 0
    for (const char of text) {
        if (char === "1")
            count += 1
    }
    return count
}