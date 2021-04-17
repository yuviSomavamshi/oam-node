/**
 *  Raise critical,warning and clear traps.
 **/
"use strict";

const OAMInterface = require("./OamClass");
const events = require("events");
let client = null;

const RAISED = "RAISED";
const CLEARED = "CLEARED";

const TYPES = { OK: "OK", CRITICAL: "CRITICAL", WARNING: "WARNING", UNKNOWN: "UNKNOWN" };
const MESSAGE_INDEX = { OK: 1, CRITICAL: 2, WARNING: 3, UNKNOWN: 4 };

var featureOpts;

var alertEnabled = false;

class OperationAndMaintenance extends events.EventEmitter {
  constructor() {
    super();
    this.on("clearAlert", raiseClearAlert);
    this.on("criticalAlert", raiseCriticalAlert);
    this.on("warningAlert", raiseWarningAlert);
    this.on("unknownAlert", raiseUnknownAlert);
    global.alert_flag = {};
  }

  init(opts) {
    try {
      featureOpts = opts != null ? opts : {};
      if (opts && opts.enabled == true) {
        alertEnabled = true;
        if (!opts.options) {
          opts.options = { oamServerIp: "127.0.0.1", oamServerPort: 4545, appId: ".1", oidMap: {} };
        }
        client = new OAMInterface(opts.options.oamServerIp, opts.options.oamServerPort, opts.options.appId, opts.options.oidPrefix);
        return true;
      } else {
        alertEnabled = false;
        console.error("Skipping feature 'oam', as it is not enabled.");
      }
    } catch (error) {
      console.error("Failed to Init OAM", error);
    }
    return false;
  }

  connected() {
    if (client) return client.connected();
    else return "disabled";
  }

  raiseCriticalAlert(oname) {
    return raiseCriticalAlert(oname);
  }

  raiseWarningAlert(oname) {
    return raiseWarningAlert(oname);
  }

  raiseClearAlert(oname) {
    return raiseClearAlert(oname);
  }

  raiseUnknownAlert(oname) {
    return raiseUnknownAlert(oname);
  }
}

module.exports = new OperationAndMaintenance();

function alert(oname, severity, type, flag) {
  return new Promise((resolve, reject) => {
    try {
      if (alertEnabled) {
        let oid = getOid(oname);
        let index = MESSAGE_INDEX[severity];
        if (oid > 0) {
          let message = getMessage(oname, index);
          if (!global.alert_flag.hasOwnProperty(oid)) {
            global.alert_flag[oid] = true;
          } else {
            global.alert_flag[oid] = flag;
          }
          if (global.alert_flag[oid] == true) {
            client.snmpSendTrap(
              {
                oid: oid,
                severity,
                msg: message,
                type,
                project: featureOpts.project
              },
              (error, status) => {
                if (error) {
                  return reject(error);
                }
                return resolve(status);
              }
            );
            global.alert_flag[oid] = flag;
          }
        } else {
          if (global.logger && typeof global.logger.isTraceEnabled == "function") {
            global.logger.trace("OID Not configured", oname);
          }
        }
      }
    } catch (error) {
      reject(error);
      if (global.logger && typeof global.logger.error == "function") {
        global.logger.error("Failed to raise alert severity:" + severity + " alert", error);
      } else {
        console.error("Failed to raise alert severity:" + severity + " alert", error);
      }
    }
    return resolve(false);
  });
}

function raiseClearAlert(oname) {
  return alert(oname, TYPES.OK, CLEARED, false);
}

function raiseCriticalAlert(oname) {
  return alert(oname, TYPES.CRITICAL, RAISED, true);
}

function raiseWarningAlert(oname) {
  return alert(oname, TYPES.WARNING, RAISED, true);
}

function raiseUnknownAlert(oname) {
  return alert(oname, TYPES.UNKNOWN, RAISED, true);
}

function getMessage(oname, index) {
  let obj = featureOpts.options.oidMap[oname];
  return obj && obj[index];
}

function getOid(oname) {
  if (featureOpts.options.oidMap[oname]) {
    return featureOpts.options.oidMap[oname][0];
  }
  return -1;
}
