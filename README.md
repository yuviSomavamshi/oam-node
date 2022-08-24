<img src="oam.jpg">
# node-oam-cli
Generic NPM Module.
This is a node module which generates the UDP packets for raising an Alarms.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Configuration](#configuration)
- [API Documentation](#oam-cli-api)
- [Support & Help](#support-help)


## Installation
```bash
# clone the repository
npm install
```

## Features
- EventEmitter based Alarm generation
- Configurable OIDs and Mapping Messages for Raise/Clear an Alarm

## Configuration

```javascript
 /**
  * For NPM module settings
  * Following JSON template is expected in init method of OAM cli.
  **/
{
  "enabled": true,
  // OAM properties
  "options": {
    "oamServerIp": "localhost",           // IP Address of OAM Server
    "oamServerPort": 4545,                // PORT Number of OAM Server
    "oidPrefix": "1.3.6.1.4.1.19338.116", // OAM ID project specific
    "oidMap": {                           // Map which holds component specific Alarm property
      // OID of each component
      "component1": [1, "Component1 is up and running", "Component1 is down"],  // OID, Success Message, Failure Message
      "component2": [2, "Component2 is up and running", "Component2 is down"]
    }
  }
}
```
# Sample configuration
```javascript
 /**
  * Holds all configurable values
  **/

let configuration = {
  enabled: true,
  options: {
    oamServerIp: "localhost",
    oamServerPort: 4545,
    appId: 1,
    oidPrefix: "1.3.6.1.4.1.19338.116",
    oidMap: {
      // OID of each component
      component1: [1, "Component1 is up and running", "Component1 is down"],
      component2: [2, "Component2 is up and running", "Component2 is down"]
    }
  }
};
// Initialize the Module
let oam = require("oam-node");
oam.init(configuration);

// Usage
oam.emit("clearAlert", "component1");
oam.emit("criticalAlert", "component1");
oam.emit("warningAlert", "component1");
oam.emit("unknownAlert", "component1");

Sample Output
-------------
PS D:\WorkSpace\Generics\oam_cli> node .\test.js
[1,"Component1 is up and running","Component1 is down"]
ALERT:1.1.3.6.1.4.1.19338.116.1#0#Component1 is up and running#CLEARED#OK#CLIENTNAME
[1,"Component1 is up and running","Component1 is down"]
ALERT:1.1.3.6.1.4.1.19338.116.1#2#Component1 is down#RAISED#CRITICAL#CLIENTNAME
[1,"Component1 is up and running","Component1 is down"]
ALERT:1.1.3.6.1.4.1.19338.116.1#1#Component1 is down#RAISED#WARNING#CLIENTNAME
[1,"Component1 is up and running","Component1 is down"]
ALERT:1.1.3.6.1.4.1.19338.116.1#3#Component1 is down#RAISED#UNKNOWN#CLIENTNAME
(node:25284) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
OAM Alert : RAISED : CRITICAL : Component1 is down
OAM Alert : RAISED : WARNING : Component1 is down
OAM Alert : RAISED : UNKNOWN : Component1 is down
OAM Alert : CLEARED : OK : Component1 is up and running

```

## Support & Help
- For any suggestions on improving documentation write to me at yuvarajsomavamshi@gmail.com
- If you find any bug, raise an issue [here](https://github.com/yuviSomavamshi/oam-node/issues) in gitlab.
- If you want to be a contributor clone the project, create MRs with enhancements / features.
