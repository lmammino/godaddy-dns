#!/usr/bin/env node

'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const program = require('commander')
const { version } = require('../package.json')
const getCurrentIp = require('./getCurrentIp')
const getLastIp = require('./getLastIp')
const saveLastIp = require('./saveLastIp')
const updateRecords = require('./updateRecords')

const defaultConfigFile = path.join(os.homedir(), '.godaddy-dns.json')
const defaultLastIpFile = path.join(os.tmpdir(), '.lastip')

program
  .version(version)
  .option('-c, --config [file]', `specify the configuration file to use (default "${defaultConfigFile}")`)
  .option('-i, --ipfile [file]', `specify which file to use to store the last found ip (default "${defaultLastIpFile}")`)
  .parse(process.argv)

const config = JSON.parse(fs.readFileSync(program.config || defaultConfigFile, 'utf8'))
const lastIpFile = program.ipfile || defaultLastIpFile

let lastIp
let currentIp

getLastIp(lastIpFile)
  .then((ip) => {
    lastIp = ip
    return getCurrentIp()
  })
  .then((ip) => {
    currentIp = ip
    if (lastIp === currentIp) {
      console.log(`[${new Date()}] Current ip and last ip match. No update neccessary.`)
      return Promise.reject(new Error('Nothing to update'))
    }

    return updateRecords(currentIp, config)
  })
  .then(() => {
    return saveLastIp(currentIp, lastIpFile)
  })
  .then(() => {
    console.log(`[${new Date()}] Successfully updated DNS records to ip ${currentIp}`)
  })
  .catch((err) => {
    if (err && err.message !== 'Nothing to update') {
      console.error(`[${new Date()}] ${err}`)
      process.exit(1)
    }
  })
