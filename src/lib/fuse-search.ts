import Fuse from "fuse.js"
import { BlockSignatures } from "./BlockSignatures"
import { sameCorners } from "./same-corners"
import { BlockSignature, ReplacementPolicy } from "../types"



class FuseSearch {

    // private currentCollection: BlockSignature[] = []

    /* Fuse is initialized with dummy data; the real collection data is set before scanning the model */
    private readonly fuse = new Fuse([{ name: "", signature: "" }], {
        includeScore: false,
        keys: ["signature"],
        isCaseSensitive: false,
    })

    private collectionChanged = true

    /** Cause the fuse collection to be recreated when next used */
    invalidate() {
        this.collectionChanged = true
    }

    setBlocks(newCollection: BlockSignature[]) {
        if (this.collectionChanged) {
            this.fuse.setCollection(newCollection)
            this.collectionChanged = false
        }
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
        const results = this.fuse.search(input).map(res => res.item)

        // Return the first result with the same corners
        for (const result of results) {
            if (sameCorners(input, result.signature))
                return result
        }

        // Otherwise just return the first result
        if (results.length > 0)
            return results[0]

        return null
    }
}

export const fuseSearch = new FuseSearch()


function countOnes(text: string): number {
    let count = 0
    for (const char of text) {
        if (char === "1")
            count += 1
    }
    return count
}