import * as csv from "csv/dist/esm/index.js"
import * as yaml from "yaml"

window.yaml = yaml
window.csv = csv

export const rowify = (data, { defaultHeaders=[], delimiter="\t" }={}) => {
    let rows = data
    if (!(data[0] instanceof Array)) {
        const headers = [...defaultHeaders]
        rows = [headers]
        for (const eachRow of data) {
            if (eachRow instanceof Array) {
                rows.push(eachRow)
            } else {
                for (const eachKey of Object.keys(eachRow)) {
                    if (!headers.includes(eachKey)) {
                        headers.push(eachKey)
                    }
                }
                rows.push(
                    headers.map(eachKey=>eachRow[eachKey])
                )
            }
        }
        // pad out rows as needed
        for (const eachRow of rows) {
            while (eachRow.length < headers.length) {
                eachRow.push(null)
            }
        }
    }
    return rows
}

export function convertToCsv(data, { defaultHeaders=[], delimiter="\t" }={}) {
    let rows = rowify(data, { defaultHeaders })
    // this is a way of getting around that CSV treats null and undefined as empty strings
    for (const eachRow of rows) {
        let index = -1
        for (const each of eachRow) {
            index++
            if (each === "") {
                eachRow[index] =  '""'
                continue
            }
            if (each == null) {
                eachRow[index] =  ""
                continue
            }
            if (typeof each != "string") {
                let newString = yaml.stringify(each)
                if (newString[newString.length-1] == "\n") {
                    newString = newString.slice(0,-1)
                }
                eachRow[index] = newString
                continue
            }
            const asString = yaml.stringify(each)
            if (asString.startsWith('"') && asString.endsWith('"\n')) {
                eachRow[index] = asString.slice(0,-1)
            } else {
                eachRow[index] = asString
                // don't have a trailing newline if its not needed (it IS needed for block-strings AFAIK)
                if (eachRow[index].length-1 == each?.length && eachRow[index].slice(-1)[0] === "\n") {
                    eachRow[index] = each
                }
            }
        }
    }
    return new Promise((resolve, reject) => {
        csv.stringify(rows, { delimiter }, (err, output) => {
            if (err) {
                return reject(err)
            }
            resolve(output)
        })
    })
}

export async function parseCsv(csvString) {
    const rows = new Promise((resolve, reject) => {
        csv.parse(csvString, { delimiter }, (err, output) => {
            if (err) {
                return reject(err)
            }
            resolve(output)
        })
    })
    for (const eachRow of rows) {
        let index = -1
        for (const each of eachRow) {
            index++
            try {
                if (each.match(/^\d{1,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}(\.\d+)?(Z|[+-]\d{1,2}(:\d{1,2})?)$/)) {
                    eachRow[index] = new Date(each)
                } else {
                    eachRow[index] = yaml.parse(each)
                }
            } catch (error) {
                eachRow[index] = each
            }
        }
    }
    return rows
}
