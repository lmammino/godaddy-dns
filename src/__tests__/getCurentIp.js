const getCurrentIp = require('../getCurrentIp')
const request = require('request-promise')

jest.mock('request-promise')

test('It should get the current ip from api.ipify.org', endTest => {
  getCurrentIp()
  expect(request).toHaveBeenCalledWith('https://api.ipify.org/')
  endTest()
})
