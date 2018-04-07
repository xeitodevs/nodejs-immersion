'use strict'

const Heavy = require('heavy')

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

function startLoggingPerformance () {
  heavy.start()
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => logIfAboveThreshold(heavy), minMessageLogTime)
}

module.exports = {
  startLoggingPerformance
}
