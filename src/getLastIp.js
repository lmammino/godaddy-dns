const { existsSync, readFile } = require('fs')

module.exports = function getLastIp (lastIpFile) {
  return new Promise((resolve, reject) => {
    if (!existsSync(lastIpFile)) {
      return resolve(undefined)
    }

    readFile(lastIpFile, 'utf8', (err, ip) => {
      if (err) {
        return reject(err)
      }

      resolve(ip)
    })
  })
}
