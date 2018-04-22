const request = require('request-promise')

module.exports = function updateRecords (ip, config) {
  let recordDefaults = {
    type: 'A',
    data: ip,
    ttl: 60 * 10 // 10 minutes (minimum allowed)
  }

  let records = config.records
  // if records is a single object or string wrap it into an array
  if (records.constructor !== Array) {
    records = [records]
  }
  records = records.map((record) => {
    // if current record is a single string
    // wrap it in array
    if (typeof record === 'string') {
      record = {name: record}
    }
    return Object.assign({}, recordDefaults, record)
  })

  return Promise.all(
    records.map((record) => {
      let domain = config.domain
      if (typeof (record.domain) !== 'undefined') {
        domain = record.domain
        delete record.domain
      }
      let options = {
        method: 'PUT',
        url: `https://api.godaddy.com/v1/domains/${domain}/records/${record.type}/${record.name.replace('@', '%40')}`,
        headers: {
          'authorization': `sso-key ${config.apiKey}:${config.secret}`,
          'content-type': 'application/json'
        },
        body: [ record ],
        json: true
      }
      return request(options)
    })
  )
}
