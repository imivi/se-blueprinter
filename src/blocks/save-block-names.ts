import fs from "fs"
import { getBlockNames } from "./get-block-names"

fs.writeFileSync("src/blocks/block-names.json", JSON.stringify(getBlockNames(), null, 4))