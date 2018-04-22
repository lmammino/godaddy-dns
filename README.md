# godaddy-dns

A Node.js script to programmatically update GoDaddy DNS records

[![npm version](https://badge.fury.io/js/godaddy-dns.svg)](http://badge.fury.io/js/godaddy-dns)
[![CircleCI](https://circleci.com/gh/lmammino/godaddy-dns.svg?style=shield)](https://circleci.com/gh/lmammino/godaddy-dns)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

---

## Introduction

This Node.js script allows you to programmatically update one or more GoDaddy DNS
records inserting the public IP of the machine where the script is run.

Quick example:

```bash
godaddy-dns -c config.json
```


## Requirements

This script requires **Node.js** (version >= 6.0.0) and a valid GoDaddy API **key**
and **secret**. You can get register a new key on your [GoDaddy developer page](https://developer.godaddy.com/keys/)


## Installation

To install the script globally you can use NPM:

```bash
npm install --global godaddy-dns
```

*If you have the script already installed in your system, this command will
update it to the latest available version.*

After executing this command the script `godaddy-dns` will be globally available
in your system. Give it a try with:

```bash
godaddy-dns -V
```


### Binaries

From version 1.1.0, you can also install godaddy-dns by simply downloading the binary executable file for your operative system in the [Releases](https://github.com/lmammino/godaddy-dns/releases) section.


## Configuration

The command needs a configuration file in order to be executed. The configuration
file can be specified at runtime using the option `--config`, if not specfied the
command will try to access the file `.godaddy-dns.json` in the home directory of
the current user.

The configuration file contains a JSON object with the following fields:

  * **apiKey**: The API key for your GoDaddy account
  * **secret**: The API key secret for your GoDaddy account
  * **domain**: The domain for which to update the DNS records
  * **records**: An array of objects that defines the records to update. Every
  record object can define the following values:
   * **name**: (mandatory) the name of the record (e.g. `"mysubdomain"`, `"@"` or `"*"`)
   * **type**: (default `"A"`) the type of entry for the record
   * **ttl**: (default `600`) the TTL of the record in seconds (min value is 600)

You can define the DNS records in the **records** configuration also using a shorter
syntax by just passing the **name** of the domain as a plain string (e.g. `"mysubdomain"`).
If you have a single record wrapping it into an array is optional, you can
simply pass it as a single string or object.

See [config.json.sample](config.json.sample) for an example of how to structure
your `config.json`.


## Update multiple domains

If you need to update multiple domains you can use the option `domain` in the records array as in the following configuration example:

```json
{
  "apiKey": "",
  "secret": "",
  "domain": "example.com",
  "records": [
    {"type": "A", "name": "mysubdomain", "ttl": 600},
    {"domain":"my-other-domain.com", "type": "A", "name": "subdomain2", "ttl": 600} //overrides main domain name (example.com)
  ]
}
```

In this example, everytime a new IP is detected the following domains will be updated:

 - `mysubdomain.example.com`
 - `subdomain2.my-other-domain.com`


## Last IP cache

To avoid to send useless requests to the GoDaddy API (e.g. when the IP is not
changed) the script stores the last public ip sent to GoDaddy in a cache file.
This file is by default stored in the default OS temp folder with the name `.lastip`.
You can use a custom location for this file with the option `--ipFile`.
If you want to clear this cache (and force a new request to the GoDaddy API) you
can simply delete this file.


## Running the script continuously with Cron

One of the principal use cases why you might want to use this script (and actually
my original motivation to create it) is to map a DNS record to a machine with a
non-static IP. This way you can recreate your home-made DynamicDNS solution.

In this scenario you might want to add an entry to your Cron configuration as
in the following example:

```
*/5 * * * * godaddy-dns > /var/log/godaddy-dns.log 2>&1
```

In this case the script will be executed every 5 minutes and the logs will be stored
in `/var/logs/godaddy-dns.log`. Also note that in this example you will use the
default configuration file location. If you want to specify a different location
use the option `--config`.


## Command line options

```
Usage: godaddy-dns [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config [file]  specify the configuration file to use  (default "<user home folder>/.godaddy-dns.json")
    -i, --ipfile [file]  specify which file to use to store the last found ip (default "<user temp folder>/.lastip")
```


## Programmatic usage

If you want to use the features of this module in a Node.js project:

```javascript
const dns = require("godaddy-dns");

dns.getCurrentIp().then((currentIp)=>{
  console.log("Current ip",currentIp);

  dns.updateRecords(currentIp,{
    "apiKey": "",
    "secret": "",
    "domain": "example.com",
    "records": [
      {"type": "A", "name": "@", "ttl": 600}
    ]
  })
  .then(() => {
    console.log(`[${new Date()}] Successfully updated DNS records to ip ${currentIp}`)
  })
  .catch((err) => {
    if (err && err.message !== 'Nothing to update') {
      console.error(`[${new Date()}] ${err}`)
      process.exit(1)
    }
  });
});
```

Thanks [@aandrulis](https://github.com/aandrulis) for suggesting to expose this.


## Bugs and improvements

If you find a bug or have an idea about how to improve this script you can [open an issue](https://github.com/lmammino/godaddy-dns/issues) or [submit a pull request](https://github.com/lmammino/godaddy-dns/pulls), it will definitely make you a better person! 😝


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
