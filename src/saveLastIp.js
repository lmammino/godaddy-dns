const { writeFile } = require('fs')

module.exports = function saveLastIp (ip, lastIpFile) {
  return new Promise((resolve, reject) => {
    writeFile(lastIpFile, ip, 'utf8', (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}
