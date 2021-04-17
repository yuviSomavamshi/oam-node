<img src="oam.jpg">
# node-oam-cli
Nviera's Generic NPM Module.
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
let oam = require("./srcs/oam");
oam.init(configuration);

// Usage
oam.emit("clearAlert", "component1");
oam.emit("criticalAlert", "component1");
oam.emit("warningAlert", "component1");
oam.emit("unknownAlert", "component1");

Sample Output
-------------
PS D:\WorkSpace\MBS-Generics\oam_cli> node .\test.js
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
- If you find any bug, raise an issue [here](http://172.19.10.136/mbs/MBS-Generics/issues) in gitlab.
- If you want to be a contributor clone the project, create MRs with enhancements / features.

COPYRIGHT STATEMENT AND RESTRICTION
Copyright © 2017 Nviera Technologies Ltd, Registered Office at A-26, Info City, Sector 34, Gurgaon-122001, Haryana, India.
All rights reserved. This document shall not, in whole or in part, be copied, photocopied, reproduced, translated, or reduced to any electronic medium or machine readable form, by any means electronic, mechanical, photographic, optic recording or otherwise without prior consent, in writing, of Nviera Technologies Ltd.
The information in this document is subject to change without notice and describes only the product defined in the introduction of this documentation. This document is intended for the use of prospective Nviera customers for the sole purpose of the transaction for which the document is submitted. No part of it may be reproduced or transmitted in any form or manner whatsoever without the prior written permission of Nviera. The intended audience for this document is the target customer, who/which assumes full responsibility for using the document appropriately. Nviera welcomes customer comments as part of the process of continuous development and improvement.
Nviera has made all reasonable efforts to ensure that the information contained in the document is adequate, sufficient and free of material errors and omissions. Nviera will, if necessary, explain issues, which may not be covered by the document. However, Nviera does not assume any liability of whatsoever nature, for any errors in the document except the responsibility to provide correct information when any such error is brought to Nviera’s knowledge. Nviera will not be responsible, in any event, for errors in this document or for any damages, incidental or consequential, including monetary losses that might arise from the use of this document or of the information contained in it.
This document and the products, solutions and services it describes are intellectual property of Nviera and/or of the respective owners thereof, whether such IPR is registered, registrable, pending for registration, applied for registration or not.
The only warranties for Nviera products, solutions and services are set forth in the express warranty statements accompanying its products and services. Nothing herein should be construed as constituting an additional warranty. Nviera shall not be liable for technical or editorial errors or omissions contained herein.
The Nviera logo is a trademark of Nviera Technologies Ltd. Other products, names, logos mentioned in this document, if any, may be trademarks of their respective owners. 
Copyright © 2017 Nviera Technologies Limited. All rights reserved.
