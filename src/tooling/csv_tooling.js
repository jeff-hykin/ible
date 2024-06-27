import * as csv from "csv/dist/esm/index.js"
import * as yaml from "yaml"

window.yaml = yaml // debugging only
window.csv = csv // debugging only

// TODO: make this a formal format standard in its own repo, with a javascript and python API
const w3schoolsIsoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
const extraIsoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/
const matchesIso8601Date = (string)=>string.match(w3schoolsIsoDateRegex) || string.match(extraIsoDateRegex)
const matchesReservedPattern = (string)=>{
    return (
        // to allow comma-separated lists of strings/numbers/dates that dont have commas in them
        string.includes(",") ||
        // to allow computed items / equations
        string.startsWith("=") ||
        // to allow regex (yeah yeah i know i know)
        (string.startsWith("/") && string.endsWith("/")) ||
        // to allow durations and times
        string.match(/^\d+:/) ||
        // to allow dates (no times) either YYYY-MM-DD and DD/MM/YYYY (probably only want to support YYYY-MM-DD, but will reserve both)
        string.match(/^\d{4}-\d{1,2}-\d{1,2}($| |\t)/) || string.match(/^\d{1,2}\/\d{1,2}\/\d{1,2}($| |\t)/) ||
        // ISO date
        matchesIso8601Date(string)
    )
}

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
            // null/undefined become empty Excel cell
            if (each == null) {
                eachRow[index] =  ""
                continue
            }
            // empty strings become Excel cell containing two quotes
            if (each === "") {
                eachRow[index] =  '""'
                continue
            }
            // non-strings just get yamlified
            // (TODO: consider having strings-with-commas getting quoted, and then some lists of strings/numbers getting converted to a comma-separated string)
            if (typeof each != "string") {
                let newString = yaml.stringify(each)
                if (newString[newString.length-1] == "\n") {
                    newString = newString.slice(0,-1)
                }
                eachRow[index] = newString
                continue
            }
            // if its a string that wouldn't be quoted by yaml, but should be reserved for special things (like date), then quote it manually
            if (matchesReservedPattern(each)) {
                eachRow[index] = JSON.stringify(each)
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

export async function parseCsv(csvString, { delimiter="\t" }={}) {
    const rows = await new Promise((resolve, reject) => {
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
                if (matchesIso8601Date(each)) {
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
