import * as csv from "csv/dist/esm/index.js"

window.csv = csv
export const rowify = (data, { defaultHeaders=[] }={}) => {
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
                eachRow.push("")
            }
        }
    }
    return rows
}

export function convertToCsv(data, { defaultHeaders=[] }={}) {
    let rows = rowify(data, { defaultHeaders })
    return new Promise((resolve, reject) => {
        csv.stringify(rows, (err, output) => {
            if (err) {
                return reject(err)
            }
            resolve(output)
        })
    })
}

export function parseCsv(csvString) {
    return new Promise((resolve, reject) => {
        csv.parse(csvString, (err, output) => {
            if (err) {
                return reject(err)
            }
            resolve(output)
        })
    })
}
