const request = require('request-promise')

module.exports = function getCurrentIp () {
  return request('https://api.ipify.org/')
}
