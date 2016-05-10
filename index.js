#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
// const config = require('./config');

const lastIpFile = path.join(__dirname, '.lastip');

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
