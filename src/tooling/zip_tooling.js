import { BlobReader, BlobWriter, TextReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js"

export const createZipOfTextFiles = async (files) => {
    const zipFileWriter = new BlobWriter()
    const zipWriter = new ZipWriter(zipFileWriter)
    const promises = []
    for (const [fileNames, fileContent] of Object.entries(files)) {
        const helloWorldReader = new TextReader(fileContent)
        promises.push(zipWriter.add(fileNames, helloWorldReader))
    }
    promises.push(zipWriter.close())
    await Promise.all(promises)
    return zipFileWriter.getData()
}

export const extractZipOfTextFiles = async (zipBlob) => {
    const zipReader = new ZipReader(new BlobReader(zipBlob))
    const promises = []
    const files = {} // { fileName: fileContent }
    const items = await zipReader.getEntries()
    for (const each of items) {
        const fileName = each.filename
        promises.push(
            each.getData(new TextWriter()).then((fileContent) => {
                files[fileName] = fileContent
            })
        )
    }
    await Promise.all(promises)
    await zipReader.close()
    return files
}