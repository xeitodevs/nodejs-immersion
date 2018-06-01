const Fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const fsReadFile = promisify(fs.readFile)
const CERTS_DIR = './pki'

async function createServerOptions () {
  const readCertFile = (filename) => {
    return fsReadFile(path.join(CERTS_DIR, filename))
  }
  const [key, cert] = await Promise.all(
    [readCertFile('server.key'), readCertFile('server.crt')])
  return { key, cert }
}

// https is necessary otherwise browsers will not
// be able to connect

(async () => {
  const { key, cert } = await createServerOptions()
  const fastify = Fastify({
    http2: true,
    https: {
      key,
      cert
    }
  })

  fastify.get('/fastify', async (request, reply) => {
    return 'Hello World!'
  })
  await fastify.listen(3000)
})()
