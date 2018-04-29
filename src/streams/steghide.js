/**
 *
 *
 * In this exercise we are playing with for/await and streams. The target is to find all equal blocks between two images.
 * The first one is the original linux tux image without data embedded. The second one its same as first one but
 * with some data embedded (secret.txt) using steganography (with steghide linux cli tool).
 * Its difficult to easily find if one image has data embedded.There is a lot of statistical analysis work for that.
 * There are many tools out there that can do this task very well but for this exercise we will only check how many blocks
 * are equal per chunk size basis.
 * At the end of the report, we can conclude that the steghide algorithm is spreading the hidden bytes along the entire image data
 * progressively.
 */

const fs = require('fs')

async function getChunksFromFile (path, chunkSize) {
  const readStream = getStreamFromFile(path, chunkSize)
  const chunks = []
  for await (const data of readStream) {
    chunks.push(data)
  }
  return chunks
}

function getStreamFromFile (path, highWaterMark) {
  return fs.createReadStream(path, { highWaterMark })
}

function * bufferIterator (buffer) {
  let currentIndex = 0
  while (true) {
    if (currentIndex === buffer.length) {
      return true
    }
    yield buffer[currentIndex]
    currentIndex++
  }
}

function chunkDiff (arrayBuffer1, arrayBuffer2) {
  const diff = {
    differentBlocks: [],
    equalBlocks: [],
    equalBlocksCount: 0,
    differentBlocksCount: 0
  }

  const bufferIterator1 = bufferIterator(arrayBuffer1)
  const bufferIterator2 = bufferIterator(arrayBuffer2)

  while (true) {

    let result1 = bufferIterator1.next()
    let result2 = bufferIterator2.next()
    if (result1.done || result2.done) {
      break
    }
    let buffer1 = result1.value
    let buffer2 = result2.value

    if (buffer1.equals(buffer2)) {
      diff.equalBlocks.push([buffer1, buffer2])
      diff.equalBlocksCount++
    } else {
      diff.differentBlocks.push([buffer1, buffer2])
      diff.differentBlocksCount++
    }
  }

  return diff
}

(async () => {

  const globalChunkSize = 8 // (bytes) You can play with the chunk size to analyze equal blocks granularity. With this size we gain 2 equal blocks !!
  const chunksFromOriginal = await getChunksFromFile('./linux.jpg', globalChunkSize)
  const chunksFromStegged = await getChunksFromFile('./linux_stegged.jpg', globalChunkSize)
  const result = await chunkDiff(chunksFromOriginal, chunksFromStegged)
  console.log(result)

})()





