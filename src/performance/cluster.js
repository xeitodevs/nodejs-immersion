'use strict'
const cluster = require('src/performance/cluster')
const os = require('os')

if (cluster.isMaster) {
  const cpus = os.cpus().length

  console.log(`Forking for ${cpus} CPUs`)
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
} else {
  require('./app')
}