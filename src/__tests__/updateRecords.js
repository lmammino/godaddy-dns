const updateRecords = require('../updateRecords')
const request = require('request-promise')

jest.mock('request-promise')

test('It should update a set of records', endTest => {
  const ip = '9.9.9.9'
  const config = {
    apiKey: 'someKey',
    secret: 'someSecret',
    domain: 'example.com',
    records: [
      '@',
      {domain: 'my-other-domain.com', type: 'A', name: 'subdomain2', ttl: 700}
    ]
  }

  const expectedRequests = [
    {
      method: 'PUT',
      url: `https://api.godaddy.com/v1/domains/example.com/records/A/%40`,
      headers: {
        'authorization': `sso-key someKey:someSecret`,
        'content-type': 'application/json'
      },
      body: [ {data: ip, type: 'A', name: '@', ttl: 600} ],
      json: true
    },
    {
      method: 'PUT',
      url: `https://api.godaddy.com/v1/domains/my-other-domain.com/records/A/subdomain2`,
      headers: {
        'authorization': `sso-key someKey:someSecret`,
        'content-type': 'application/json'
      },
      body: [ {data: ip, type: 'A', name: 'subdomain2', ttl: 700} ],
      json: true
    }
  ]

  request.mockImplementation(function (options) {
    return Promise.resolve()
  })

  updateRecords(ip, config)
    .then(() => {
      expect(request).toHaveBeenCalledTimes(expectedRequests.length)
      expectedRequests.forEach((expectedRequest, i) => {
        expect(request.mock.calls[i]).toEqual([expectedRequest])
      })

      endTest()
    })
})

test('It should update a single record', endTest => {
  const ip = '9.9.9.9'
  const config = {
    apiKey: 'someKey',
    secret: 'someSecret',
    domain: 'example.com',
    records: '@'
  }

  const expectedRequest = {
    method: 'PUT',
    url: `https://api.godaddy.com/v1/domains/example.com/records/A/%40`,
    headers: {
      'authorization': `sso-key someKey:someSecret`,
      'content-type': 'application/json'
    },
    body: [ {data: ip, type: 'A', name: '@', ttl: 600} ],
    json: true
  }

  request.mockReset()
  request.mockImplementation(function (options) {
    return Promise.resolve()
  })

  updateRecords(ip, config)
    .then(() => {
      expect(request).toHaveBeenCalledTimes(1)
      expect(request).toHaveBeenCalledWith(expectedRequest)
      endTest()
    })
})
