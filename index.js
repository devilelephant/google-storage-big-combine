const MAX_COMBINE_COUNT = 30

exports.combine = combine
exports.collate = collate

/**
 * Overcome GCS combine() limit of 30 files by iterating over any number of files.
 * @param bucket Google Storage bucket instance
 * @param fileList list of files to be combined.  Result file will be in list order.
 * @param file destination file
 */
async function combine(bucket, fileList, file) {
    let files = [...fileList],
        iter = 0
    
    while (files.length > 1) {
        const chunks = collate(files, MAX_COMBINE_COUNT)
        files = []
        iter++
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            
            if (chunk.length === 1) {
                files.push(chunk[0])
            } else {
                let combineFile = bucket.file(`${file.name}.${iter}.${i}`)
                try {
                    await bucket.combine(chunk, combineFile)
                } catch (e) {
                    throw new Error(`${combineFile.name}: ${e}`)
                }
                files.push(combineFile)
            }
        }
    }
    
    // rename outfile to expected file name
    let topFile = files[0]
    if (topFile.name !== file.name) {
        try {
            await topFile.move(file)
        } catch (e) {
            throw new Error(`Failed to move ${topFile.name} to ${file.name}: ${e}`)
        }
    }
    return file
}

/* Split up an array into even-sized pieces. */
function collate(array, size) {
    const arr = []
    for (let i = 0; i < array.length; i += size) {
        arr.push(array.slice(i, i + size));
    }
    return arr;
}
