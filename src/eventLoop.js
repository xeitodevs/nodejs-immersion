'use strict'

const axios = require('axios')
const Heavy = require('heavy')
const fs = require('fs')

const heavy = new Heavy({
  sampleInterval: 1000
})

const minMessageLogTime = 1000
const eventLoopThreshold = 40

function logIfAboveThreshold (heavy) {
  if (!heavy || !heavy.load) {
    return
  }

  if (heavy.load.eventLoopDelay > eventLoopThreshold) {
    const { eventLoopDelay, heapUsed, rss } = heavy.load
    console.log(JSON.stringify({
      eventLoopThreshold,
      eventLoopDelay,
      heapUsed,
      rss
    }))
  }
}

let interval

const urls = [
  'http://85.91.64.26/coruna/readImage.asp',
  'http://85.91.64.26/tvg/readImage.asp'
]

async function request () {
  for (const url of urls) {
    let http = await axios.get(url)
  }
}

async function requestOverload () {
  while (true) {
    const data = axios.get('http://localhost:3000/issues/tree')
    fs.writeFileSync('/tmp/sample', fs.readFileSync('/dev/zero'), {flag: 'a'})
  }
}

function startLoggingPerformance () {
  heavy.start()
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => logIfAboveThreshold(heavy), minMessageLogTime)
}

module.exports = {
  startLoggingPerformance,
  requestOverload,
  request
}
