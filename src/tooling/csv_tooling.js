import * as csv from "https://esm.sh/csv@6.3.9"

export function convertToCsv(data) {
    return new Promise((resolve, reject) => {
        csv.stringify(data, (err, output) => {
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
