#!/usr/bin/env node

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const program = require('commander');
const request = require('request');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .option('-c, --config [file]', 'specify the configuration file to use')
  .option('-i, --ipfile [file]', 'specify which file to use to store the last found ip')
  .parse(process.argv);

const config = JSON.parse(fs.readFileSync(program.config || './config.json', 'utf8'));
const lastIpFile = program.ipfile || path.join(os.tmpdir(), '.lastip');

function getCurrentIp() {
	return new Promise((resolve, reject) => {
		request('https://api.ipify.org/', (err, response, ip) => {
			if (err) {
				return reject(err);
			}

			resolve(ip);
		});
	});
}

function getLastIp() {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(lastIpFile)) {
			return resolve(undefined);
		}

		fs.readFile(lastIpFile, 'utf8', (err, ip) => {
			if (err) {
				return reject(err);
			}

			resolve(ip);
		});
	});
}

function saveLastIp(ip) {
	return new Promise((resolve, reject) => {
		fs.writeFile(lastIpFile, ip, 'utf8', (err) => {
			if (err) {
				return reject(err);
			}

			resolve();
		});
	});
}

function updateRecords() {
  // TODO
	console.log('Should update records now...');
}

let lastIp;
let currentIp;

getLastIp()
.then((ip) => {
	lastIp = ip;
	return getCurrentIp();
})
.then((ip) => {
	currentIp = ip;
	if (lastIp !== currentIp) {
		saveLastIp(currentIp).then(updateRecords);
	}
})
.catch(console.error)
;
