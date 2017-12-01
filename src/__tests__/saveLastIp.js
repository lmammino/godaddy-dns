const fs = require('fs')
const saveLastIp = require('../saveLastIp')

jest.mock('fs')

test('It should save the last IP in a given file', (endTest) => {
  const ip = '127.0.0.1'
  const file = 'somefile.txt'
  fs.writeFile.mockImplementationOnce(function (file, content, encoding, callback) {
    return callback()
  })
  saveLastIp(ip, file)
    .then(() => {
      expect(fs.writeFile).toBeCalledWith(file, ip, 'utf8', expect.any(Function))
      endTest()
    })
})

test('It should return a rejected promise if the write fails', (endTest) => {
  const ip = '127.0.0.1'
  const file = 'somefile.txt'
  fs.writeFile.mockImplementationOnce(function (file, content, encoding, callback) {
    return callback(new Error('something terrible happened'))
  })
  saveLastIp(ip, file)
    .catch((err) => {
      expect(err.message).toEqual('something terrible happened')
      endTest()
    })
})
