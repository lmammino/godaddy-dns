const fs = require('fs')
const getLastIp = require('../getLastIp')

jest.mock('fs')

test('It should get last saved ip from a file', endTest => {
  const expectedIp = '127.0.0.1'
  fs.existsSync.mockReturnValueOnce(true)
  fs.readFile.mockImplementationOnce(function (file, encoding, callback) {
    return callback(null, expectedIp)
  })
  getLastIp('somefile')
    .then((ip) => {
      expect(ip).toEqual(expectedIp)
      endTest()
    })
})

test('If the given file does not exist return undefined', endTest => {
  fs.existsSync.mockReturnValueOnce(false)
  getLastIp('somefile')
    .then((ip) => {
      expect(ip).toBe(undefined)
      endTest()
    })
})

test('If the file read fails, it should return a rejected promise', endTest => {
  fs.existsSync.mockReturnValueOnce(true)
  fs.readFile.mockImplementationOnce(function (file, encoding, callback) {
    return callback(new Error('something bad happened'))
  })
  getLastIp('somefile')
    .catch((err) => {
      expect(err.message).toEqual('something bad happened')
      endTest()
    })
})
