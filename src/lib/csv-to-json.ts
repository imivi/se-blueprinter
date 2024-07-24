import { readCsv } from "./read-csv"
import fs from "fs"

const inputCsvPath = process.argv[2]
const outputJsonPath = process.argv[3]

fs.writeFileSync(outputJsonPath, JSON.stringify(readCsv(inputCsvPath), null, 4), { encoding: "utf-8" })