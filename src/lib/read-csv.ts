import fs from "fs"


type CsvRow = Record<string, string>

export function readCsv(pathToCsv: string): CsvRow[] {
    const csvText = fs.readFileSync(pathToCsv, { encoding: "utf-8" }).trim()
    const csvLines = csvText.split("\r\n")
    const headers = csvLines[0].split(",")
    const rows = csvLines.slice(1)

    const outputLines = rows.map(row => {
        const obj: Record<string, string> = {}
        const values = row.split(",")
        for (let i = 0; i < values.length; i++) {
            const key = headers[i]
            obj[key] = values[i]
        }
        return obj
    })

    return outputLines
}
